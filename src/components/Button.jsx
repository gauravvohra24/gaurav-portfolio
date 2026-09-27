import { forwardRef } from "react";

const VARIANTS = {
  primary:
    "text-white bg-[linear-gradient(120deg,#6366f1_0%,#8b5cf6_55%,#06b6d4_130%)] bg-[length:180%_100%] bg-[position:0%_0%] hover:bg-[position:100%_0%] glow-btn",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-indigo)]/40 hover:bg-[var(--color-surface-2)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  ghost: "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
};

const SIZES = {
  md: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-sm",
};

/**
 * Polymorphic button — renders an <a> when `href` is provided, else a <button>.
 */
export const Button = forwardRef(function Button(
  { as, href, variant = "primary", size = "md", className = "", children, icon: Icon, iconPosition = "right", ...rest },
  ref
) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-tight transition-all duration-500 ease-out active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon className="h-4 w-4" aria-hidden="true" />}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
      )}
    </>
  );

  const Component = as ?? (href ? "a" : "button");

  return (
    <Component ref={ref} href={href} className={classes} {...rest}>
      {content}
    </Component>
  );
});
