"use server";

/**
 * Customer auth via the Shopify Storefront API (classic email/password flow).
 *
 * The access token is stored in an httpOnly cookie. A second, readable cookie
 * (`bayan_signed_in`) lets the client nav show a signed-in indicator without
 * exposing the token to JavaScript.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
  CUSTOMER_CREATE_MUTATION,
} from "./mutations";
import { GET_CUSTOMER_QUERY } from "./queries";
import { shopifyFetch } from "./shopify-fetch";
import type { Image, Money } from "./types";

const TOKEN_COOKIE = "bayan_customer_token";
const FLAG_COOKIE = "bayan_signed_in";

export type AuthState = { error: string | null };

export type CustomerOrderLine = {
  title: string;
  quantity: number;
  variantTitle: string | null;
  image: Image | null;
  price: Money | null;
};

export type CustomerOrder = {
  id: string;
  orderNumber: number;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: Money;
  lineItems: CustomerOrderLine[];
};

export type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  orders: CustomerOrder[];
};

async function setAuthCookies(token: string, expiresAt: string) {
  const jar = await cookies();
  const maxAge = Math.max(
    60,
    Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
  );
  const opts = {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge,
  };
  jar.set(TOKEN_COOKIE, token, { ...opts, httpOnly: true });
  jar.set(FLAG_COOKIE, "1", { ...opts, httpOnly: false });
}

async function clearAuthCookies() {
  const jar = await cookies();
  jar.delete(TOKEN_COOKIE);
  jar.delete(FLAG_COOKIE);
}

type TokenCreateResult = {
  customerAccessTokenCreate: {
    customerAccessToken: { accessToken: string; expiresAt: string } | null;
    customerUserErrors: Array<{ code: string | null; message: string }>;
  };
};

async function createToken(
  email: string,
  password: string,
): Promise<{ token?: string; expiresAt?: string; error?: string }> {
  const data = await shopifyFetch<TokenCreateResult>({
    query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    variables: { input: { email, password } },
    cache: "no-store",
  });
  const res = data.customerAccessTokenCreate;
  if (res.customerUserErrors.length || !res.customerAccessToken) {
    return {
      error:
        res.customerUserErrors[0]?.message ||
        "We couldn't sign you in. Check your email and password.",
    };
  }
  return {
    token: res.customerAccessToken.accessToken,
    expiresAt: res.customerAccessToken.expiresAt,
  };
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Enter your email and password." };
  }
  const result = await createToken(email, password);
  if (result.error || !result.token) {
    return { error: result.error ?? "Login failed." };
  }
  await setAuthCookies(result.token, result.expiresAt!);
  redirect("/account");
}

type CustomerCreateResult = {
  customerCreate: {
    customer: { id: string; email: string } | null;
    customerUserErrors: Array<{ code: string | null; message: string }>;
  };
};

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!firstName || !email || !password) {
    return { error: "Please fill in your name, email and password." };
  }
  if (password.length < 5) {
    return { error: "Password must be at least 5 characters." };
  }

  const data = await shopifyFetch<CustomerCreateResult>({
    query: CUSTOMER_CREATE_MUTATION,
    variables: {
      input: { firstName, lastName: lastName || undefined, email, password },
    },
    cache: "no-store",
  });
  const res = data.customerCreate;
  if (res.customerUserErrors.length || !res.customer) {
    return {
      error:
        res.customerUserErrors[0]?.message ||
        "We couldn't create your account.",
    };
  }

  // Auto-login the new customer.
  const token = await createToken(email, password);
  if (token.error || !token.token) {
    // Account created but auto-login failed — send them to login.
    redirect("/account/login");
  }
  await setAuthCookies(token.token, token.expiresAt!);
  redirect("/account");
}

export async function logoutAction() {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value;
  if (token) {
    try {
      await shopifyFetch({
        query: CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
        variables: { customerAccessToken: token },
        cache: "no-store",
      });
    } catch {
      // best-effort server-side revoke
    }
  }
  await clearAuthCookies();
  redirect("/");
}

type CustomerQueryResult = {
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    orders: {
      edges: Array<{
        node: {
          id: string;
          orderNumber: number;
          name: string;
          processedAt: string;
          financialStatus: string | null;
          fulfillmentStatus: string | null;
          totalPrice: Money;
          lineItems: {
            edges: Array<{
              node: {
                title: string;
                quantity: number;
                variant: {
                  title: string | null;
                  image: Image | null;
                  price: Money | null;
                } | null;
              };
            }>;
          };
        };
      }>;
    };
  } | null;
};

export async function getCustomer(): Promise<Customer | null> {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value;
  if (!token) return null;

  let data: CustomerQueryResult;
  try {
    data = await shopifyFetch<CustomerQueryResult>({
      query: GET_CUSTOMER_QUERY,
      variables: { token },
      cache: "no-store",
    });
  } catch {
    return null;
  }
  if (!data.customer) return null;

  const c = data.customer;
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    orders: c.orders.edges.map(({ node }) => ({
      id: node.id,
      orderNumber: node.orderNumber,
      name: node.name,
      processedAt: node.processedAt,
      financialStatus: node.financialStatus,
      fulfillmentStatus: node.fulfillmentStatus,
      totalPrice: node.totalPrice,
      lineItems: node.lineItems.edges.map(({ node: li }) => ({
        title: li.title,
        quantity: li.quantity,
        variantTitle: li.variant?.title ?? null,
        image: li.variant?.image ?? null,
        price: li.variant?.price ?? null,
      })),
    })),
  };
}
