// Only the EmailJS *public* key lives in the frontend. Service/template IDs
// are identifiers, not secrets. Values come from .env (see .env.example).
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const isEmailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY in .env.");
    this.name = "EmailNotConfiguredError";
  }
}

if (!isEmailConfigured && import.meta.env.DEV) {
  console.warn("[emailService] EmailJS env vars missing — the contact form will show its error state until they are set. See .env.example.");
}

function formatSentAt(date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(date) + " IST";
}

/**
 * Sends a portfolio enquiry through EmailJS.
 * Resolves only when EmailJS confirms delivery to its API (HTTP 200); rejects otherwise.
 *
 * Template variables (see emailjs/portfolio-enquiry-template.html):
 *   {{name}} {{email}} {{message}} {{sent_at}} {{source}} {{subject}} {{reply_to}}
 */
export async function sendEnquiry({ name, email, message }) {
  if (!isEmailConfigured) throw new EmailNotConfiguredError();

  const params = {
    name: name.trim(),
    email: email.trim(),
    reply_to: email.trim(),
    message: message.trim(),
    subject: `Portfolio Enquiry — ${name.trim()}`,
    sent_at: formatSentAt(new Date()),
    source: "Portfolio contact form",
  };

  // Loaded on demand: the SDK touches localStorage at import time, which throws in
  // browsers with site data blocked — importing lazily keeps the page itself safe.
  const { default: emailjs } = await import("@emailjs/browser");
  const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
  if (response?.status !== 200) {
    throw new Error(`EmailJS responded with status ${response?.status ?? "unknown"}: ${response?.text ?? ""}`);
  }
  return response;
}
