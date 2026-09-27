import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { PERSONAL } from "../data/site";
import { sendEnquiry } from "../services/emailService";
import { EASE } from "../lib/motion";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY = { name: "", email: "", message: "" };

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = "Please enter your name.";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (!email.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Please enter a valid email.";
  if (!message.trim()) errors.message = "Please enter a message.";
  else if (message.trim().length < 10) errors.message = "Message must be at least 10 characters.";
  return errors;
}

/** Input with a floating label, focus glow + slight lift, and a small shake when invalid. */
function Field({ id, name, label, type = "text", value, onChange, onBlur, error, multiline = false, autoComplete, shakeKey, disabled }) {
  const controls = useAnimationControls();
  useEffect(() => {
    if (shakeKey && error) controls.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4 } });
  }, [shakeKey, error, controls]);

  const Tag = multiline ? "textarea" : "input";
  return (
    <motion.div animate={controls} className="relative">
      <Tag
        id={id}
        name={name}
        type={multiline ? undefined : type}
        rows={multiline ? 5 : undefined}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder=" "
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`peer w-full rounded-xl border bg-white px-4 pb-2.5 pt-6 text-sm text-[var(--color-text)] outline-none transition-[border-color,box-shadow,transform] duration-200 ease-out focus:-translate-y-px disabled:opacity-70 ${
          multiline ? "resize-none" : ""
        } ${
          error
            ? "border-red-300 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.15),0_8px_20px_-12px_rgba(248,113,113,0.5)]"
            : "border-[var(--color-border)] hover:border-[var(--color-text-faint)]/60 focus:border-[var(--color-indigo)] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12),0_10px_24px_-14px_rgba(99,102,241,0.55)]"
        }`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-4 origin-left text-sm text-[var(--color-text-faint)] transition-all duration-200 ease-out peer-focus:top-2 peer-focus:scale-[0.78] peer-focus:font-medium peer-focus:text-[var(--color-indigo-ink)] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-[0.78] peer-[:not(:placeholder-shown)]:font-medium"
      >
        {label}
      </label>
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="mt-1.5 text-xs text-red-500">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Circle draws, then the check draws — a small spring-y confirmation. */
function SuccessCheck() {
  return (
    <motion.svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 16 }} aria-hidden="true">
      <motion.circle cx="20" cy="20" r="17" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease: EASE }} />
      <motion.path d="M12.5 20.5 L18 26 L28 15" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.35, ease: EASE }} />
    </motion.svg>
  );
}

export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [attempt, setAttempt] = useState(0);
  const [notice, setNotice] = useState(null); // "success" | "error" | null
  const sendingRef = useRef(false);
  const restoreTimer = useRef(0);

  useEffect(() => () => clearTimeout(restoreTimer.current), []);

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (notice === "success") setNotice(null);
  };

  // After a first submit attempt, re-check a field when the visitor leaves it.
  const handleBlur = (field) => () => {
    if (!attempt) return;
    const fieldError = validate(values)[field];
    setErrors((current) => ({ ...current, [field]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sendingRef.current) return; // no double submits

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setAttempt((n) => n + 1);
    if (Object.keys(nextErrors).length > 0) return;

    // Honeypot filled → almost certainly a bot. Quietly do nothing.
    if (honeypot.trim()) return;

    sendingRef.current = true;
    setStatus("sending");
    setNotice(null);
    try {
      await sendEnquiry(values);
      setStatus("sent");
      setNotice("success");
      setValues(EMPTY);
      setErrors({});
      setAttempt(0);
      restoreTimer.current = window.setTimeout(() => setStatus("idle"), 2600);
    } catch (err) {
      console.error("[ContactForm] Enquiry failed to send:", err);
      setStatus("error");
      setNotice("error"); // values are kept so nothing is lost
    } finally {
      sendingRef.current = false;
    }
  };

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-4" aria-busy={sending}>
      <Field id="contact-name" name="name" label="Name" autoComplete="name" value={values.name} onChange={handleChange("name")} onBlur={handleBlur("name")} error={errors.name} shakeKey={attempt} disabled={sending} />
      <Field id="contact-email" name="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={handleChange("email")} onBlur={handleBlur("email")} error={errors.email} shakeKey={attempt} disabled={sending} />
      <Field id="contact-message" name="message" label="What are you building?" multiline value={values.message} onChange={handleChange("message")} onBlur={handleBlur("message")} error={errors.message} shakeKey={attempt} disabled={sending} />

      {/* Honeypot: off-screen, skipped by keyboard and hidden from assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <button
        type="submit"
        disabled={sending}
        className={`group relative mt-1 inline-flex h-12 items-center justify-center overflow-hidden rounded-xl font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-[background-position,background-color,transform,box-shadow] duration-500 active:scale-[0.98] disabled:cursor-progress ${
          status === "sent" ? "bg-[linear-gradient(120deg,#10b981,#06b6d4)] shadow-[0_10px_28px_-10px_rgba(16,185,129,0.7)]" : "glow-btn bg-[linear-gradient(120deg,#6366f1,#8b5cf6_60%,#06b6d4_130%)] bg-[length:180%_100%] bg-[position:0%_0%] hover:bg-[position:100%_0%]"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={status === "error" ? "idle" : status} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.25, ease: EASE }} className="flex items-center gap-2">
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending message…
              </>
            ) : status === "sent" ? (
              <>✓ Message sent</>
            ) : (
              <>
                Send message
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Status messages are announced to screen readers */}
      <div aria-live="polite" role="status" className="min-h-0">
        <AnimatePresence mode="wait">
          {notice === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5">
                <SuccessCheck />
                <div>
                  <motion.p initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-emerald-ink)]">
                    Message sent
                  </motion.p>
                  <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">Thanks — your message has been sent successfully.</p>
                </div>
              </div>
            </motion.div>
          )}
          {notice === "error" && (
            <motion.div
              key="error"
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50/60 p-3.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>
                  Something went wrong while sending your message. Please try again or email me directly at{" "}
                  <a href={`mailto:${PERSONAL.email}`} className="font-semibold underline underline-offset-2">
                    {PERSONAL.email}
                  </a>
                  .
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
