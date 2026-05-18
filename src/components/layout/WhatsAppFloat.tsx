import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const FALLBACK = "923000000000";

export function WhatsAppFloat() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || FALLBACK;
  const href = `https://wa.me/${number}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-7 right-7 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_36px_-10px_rgba(37,211,102,0.5)] transition-transform duration-300 hover:scale-[1.08]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1.5 rounded-full border-2 border-[rgba(37,211,102,0.4)] animate-[pulse-ring_2.4s_ease_infinite]"
      />
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
