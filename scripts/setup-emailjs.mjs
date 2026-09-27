#!/usr/bin/env node
// Saves the three EmailJS client-side values into the project's .env.
//   npm run setup:email
// Uses plain readline input, so Cmd+V pastes normally. Values are never printed after saving.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";

// Always the project root's .env, regardless of where the command is run from.
const envPath = process.env.EMAILJS_ENV_PATH || resolve(dirname(fileURLToPath(import.meta.url)), "..", ".env");

const FIELDS = [
  ["VITE_EMAILJS_SERVICE_ID", "Service ID (EmailJS → Email Services): "],
  ["VITE_EMAILJS_TEMPLATE_ID", "Template ID (EmailJS → Email Templates): "],
  ["VITE_EMAILJS_PUBLIC_KEY", "Public Key (EmailJS → Account → General): "],
];

const clean = (v) => v.trim().replace(/^["']|["']$/g, "").trim();

const rl = createInterface({ input, output, terminal: Boolean(input.isTTY) });
const lines = rl[Symbol.asyncIterator]();
const values = {};
try {
  for (const [key, prompt] of FIELDS) {
    let value = "";
    while (!value) {
      output.write(prompt);
      const { value: line, done } = await lines.next();
      if (done) {
        console.error("\n✗ Input ended before all three values were entered — nothing was saved.");
        process.exit(1);
      }
      value = clean(line);
      if (!value) console.log("  This value can't be empty — please paste it again.");
    }
    values[key] = value;
  }
} finally {
  rl.close();
}

let text = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
for (const [key] of FIELDS) {
  const line = `${key}=${values[key]}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  text = pattern.test(text) ? text.replace(pattern, line) : `${text.replace(/\n?$/, "\n")}${line}\n`;
}
writeFileSync(envPath, text, { mode: 0o600 });

// Re-read and confirm all three are present and non-empty (without printing them).
const saved = readFileSync(envPath, "utf8");
const missing = FIELDS.filter(([key]) => !new RegExp(`^${key}=\\S+`, "m").test(saved)).map(([key]) => key);
if (missing.length) {
  console.error(`✗ Could not save: ${missing.join(", ")}`);
  process.exit(1);
}
console.log("✓ EmailJS configuration saved successfully.");
