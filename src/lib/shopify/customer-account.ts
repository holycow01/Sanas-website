/**
 * Shopify "New customer accounts" — passwordless auth via the Customer Account
 * API (OAuth 2.0 authorization-code flow with PKCE, public client).
 *
 * Flow: /api/auth/login → Shopify hosted login → /api/auth/callback (code →
 * token) → tokens in httpOnly cookies → Customer Account GraphQL API.
 *
 * Endpoints are derived from the numeric shop id. Confirmed against this
 * store's /.well-known/openid-configuration.
 */

import crypto from "node:crypto";
import { cookies } from "next/headers";

const SHOP_ID = process.env.SHOPIFY_SHOP_ID || "99606757662";
const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID || "";
/** Optional — only set if the Customer Account API client is "confidential". */
const CLIENT_SECRET = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET || "";
const API_VERSION = "2026-04";

const AUTHORIZE_URL = `https://shopify.com/authentication/${SHOP_ID}/oauth/authorize`;
const TOKEN_URL = `https://shopify.com/authentication/${SHOP_ID}/oauth/token`;
const LOGOUT_URL = `https://shopify.com/authentication/${SHOP_ID}/logout`;
const GRAPHQL_URL = `https://shopify.com/${SHOP_ID}/account/customer/api/${API_VERSION}/graphql`;
const SCOPE = "openid email customer-account-api:full";

const COOKIE = {
  access: "bayan_ca_access",
  refresh: "bayan_ca_refresh",
  idToken: "bayan_ca_idtoken",
  flag: "bayan_signed_in",
  state: "bayan_oauth_state",
  verifier: "bayan_oauth_verifier",
} as const;

const isProd = process.env.NODE_ENV === "production";

export function isCustomerAccountsConfigured(): boolean {
  return !!CLIENT_ID;
}

// ───────────────────────────────────────────── PKCE helpers

function base64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomString(bytes = 32): string {
  return base64url(crypto.randomBytes(bytes));
}

function challengeFromVerifier(verifier: string): string {
  return base64url(crypto.createHash("sha256").update(verifier).digest());
}

function redirectUri(origin: string): string {
  return `${origin}/api/auth/callback`;
}

// ───────────────────────────────────────────── OAuth: authorize

export async function buildAuthorizationUrl(origin: string): Promise<string> {
  const state = randomString(16);
  const nonce = randomString(16);
  const verifier = randomString(32);
  const challenge = challengeFromVerifier(verifier);

  const jar = await cookies();
  const tmp = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };
  jar.set(COOKIE.state, state, tmp);
  jar.set(COOKIE.verifier, verifier, tmp);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri(origin),
    scope: SCOPE,
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

// ───────────────────────────────────────────── OAuth: token exchange

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
};

async function requestToken(body: URLSearchParams, origin: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    // Public clients are validated against the registered JavaScript origin.
    Origin: origin,
  };
  if (CLIENT_SECRET) {
    headers.Authorization =
      "Basic " +
      Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  }
  const res = await fetch(TOKEN_URL, { method: "POST", headers, body });
  if (!res.ok) {
    console.error("[customer-account] token request failed", res.status, await res.text().catch(() => ""));
    return null;
  }
  return (await res.json()) as TokenResponse;
}

async function setTokenCookies(tokens: TokenResponse) {
  const jar = await cookies();
  const base = {
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
  };
  jar.set(COOKIE.access, tokens.access_token, {
    ...base,
    httpOnly: true,
    maxAge: Math.max(60, tokens.expires_in - 30),
  });
  if (tokens.refresh_token) {
    jar.set(COOKIE.refresh, tokens.refresh_token, {
      ...base,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  if (tokens.id_token) {
    jar.set(COOKIE.idToken, tokens.id_token, {
      ...base,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  jar.set(COOKIE.flag, "1", {
    ...base,
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function exchangeCodeForTokens(
  origin: string,
  code: string,
  state: string,
): Promise<boolean> {
  const jar = await cookies();
  const savedState = jar.get(COOKIE.state)?.value;
  const verifier = jar.get(COOKIE.verifier)?.value;
  jar.delete(COOKIE.state);
  jar.delete(COOKIE.verifier);

  if (!savedState || savedState !== state || !verifier) return false;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    redirect_uri: redirectUri(origin),
    code,
    code_verifier: verifier,
  });
  const tokens = await requestToken(body, origin);
  if (!tokens?.access_token) return false;
  await setTokenCookies(tokens);
  return true;
}

async function refreshAccessToken(origin: string): Promise<string | null> {
  const jar = await cookies();
  const refresh = jar.get(COOKIE.refresh)?.value;
  if (!refresh) return null;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refresh,
  });
  const tokens = await requestToken(body, origin);
  if (!tokens?.access_token) return null;
  await setTokenCookies(tokens);
  return tokens.access_token;
}

// ───────────────────────────────────────────── logout

export async function buildLogoutUrl(origin: string): Promise<string> {
  const jar = await cookies();
  const idToken = jar.get(COOKIE.idToken)?.value;
  jar.delete(COOKIE.access);
  jar.delete(COOKIE.refresh);
  jar.delete(COOKIE.idToken);
  jar.delete(COOKIE.flag);

  const params = new URLSearchParams({ post_logout_redirect_uri: origin });
  if (idToken) params.set("id_token_hint", idToken);
  return `${LOGOUT_URL}?${params.toString()}`;
}

// ───────────────────────────────────────────── Customer Account GraphQL

const CUSTOMER_QUERY = /* GraphQL */ `
  query {
    customer {
      firstName
      lastName
      emailAddress { emailAddress }
      orders(first: 50) {
        edges {
          node {
            id
            name
            processedAt
            totalPrice { amount currencyCode }
            lineItems(first: 50) {
              edges { node { title quantity } } }
          }
        }
      }
    }
  }
`;

export type CustomerOrderLine = { title: string; quantity: number };
export type CustomerOrder = {
  id: string;
  name: string;
  numericId: string;
  processedAt: string;
  total: { amount: string; currencyCode: string } | null;
  lineItems: CustomerOrderLine[];
};
export type Customer = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  orders: CustomerOrder[];
};

type GraphQLResult = {
  data?: {
    customer: {
      firstName: string | null;
      lastName: string | null;
      emailAddress: { emailAddress: string | null } | null;
      orders: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            processedAt: string;
            totalPrice: { amount: string; currencyCode: string } | null;
            lineItems: {
              edges: Array<{ node: { title: string; quantity: number } }>;
            };
          };
        }>;
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
};

async function customerAccountFetch(
  accessToken: string,
): Promise<GraphQLResult | null> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Shopify Customer Account API expects the token directly (no "Bearer ").
      Authorization: accessToken,
    },
    body: JSON.stringify({ query: CUSTOMER_QUERY }),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("[customer-account] graphql failed", res.status);
    return null;
  }
  return (await res.json()) as GraphQLResult;
}

/** Read the customer + orders. `origin` lets us refresh an expired token. */
export async function getCustomerAccount(
  origin: string,
): Promise<Customer | null> {
  const jar = await cookies();
  let token = jar.get(COOKIE.access)?.value;
  if (!token) {
    token = (await refreshAccessToken(origin)) ?? undefined;
  }
  if (!token) return null;

  let result = await customerAccountFetch(token);
  // One retry with a refreshed token if the call was rejected.
  if (result?.errors?.length || !result?.data?.customer) {
    const refreshed = await refreshAccessToken(origin);
    if (refreshed) result = await customerAccountFetch(refreshed);
  }
  const c = result?.data?.customer;
  if (!c) return null;

  const orders: CustomerOrder[] = c.orders.edges
    .map(({ node }) => ({
      id: node.id,
      name: node.name,
      numericId: node.name.replace(/[^0-9]/g, ""),
      processedAt: node.processedAt,
      total: node.totalPrice,
      lineItems: node.lineItems.edges.map(({ node: li }) => ({
        title: li.title,
        quantity: li.quantity,
      })),
    }))
    .sort(
      (a, b) =>
        new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime(),
    );

  return {
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.emailAddress?.emailAddress ?? null,
    orders,
  };
}
