import { motion } from "framer-motion";
import { useSequence } from "../../hooks/useSequence";

/**
 * A small animated pipeline: a packet hops node → node and each node lights
 * as it arrives. Runs only while `running` and on screen (useSequence), so
 * cards animate on hover rather than all the time.
 *
 * layout: "vertical" | "horizontal" | "auto" (vertical on mobile, horizontal from sm)
 */
export function FlowChain({ nodes, running = false, color = "#6366f1", layout = "vertical", interval = 750, selected, onSelect, size = "sm", className = "" }) {
  const { ref, step } = useSequence(nodes.length, { interval, rest: 1, enabled: running });
  const auto = layout === "auto";
  const horizontal = layout === "horizontal";
  const dir = horizontal ? "flex-row items-center" : auto ? "flex-col sm:flex-row sm:items-center" : "flex-col";
  const text = size === "sm" ? "text-[10.5px]" : "text-xs";

  return (
    <ol ref={ref} className={`flex ${dir} ${className}`}>
      {nodes.map((node, i) => {
        const label = typeof node === "string" ? node : node.label;
        const lit = step === i || selected === i;
        const hop = step === i + 1; // packet is travelling into the next node
        const Tag = onSelect ? "button" : "span";
        return (
          <li key={label} className={`flex ${horizontal ? "flex-row items-center" : auto ? "flex-col sm:flex-row sm:items-center" : "flex-col"} ${i < nodes.length - 1 ? (horizontal || auto ? "sm:flex-1" : "") : ""}`}>
            <Tag
              {...(onSelect ? { type: "button", onClick: () => onSelect(i), "aria-pressed": selected === i, "data-cursor": "ring" } : {})}
              className={`relative block whitespace-nowrap rounded-lg border bg-white px-2.5 py-1.5 text-center font-mono font-semibold ${text} text-[var(--color-text)] transition-all duration-300 ${
                lit ? "-translate-y-px shadow-md" : "border-[var(--color-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              } ${onSelect ? "cursor-pointer hover:border-[var(--color-text-faint)]" : ""}`}
              style={lit ? { borderColor: `${color}88`, boxShadow: `0 0 0 3px ${color}1f, 0 6px 16px -8px ${color}99` } : undefined}
            >
              {label}
              {typeof node !== "string" && node.sub && <span className="ml-1.5 font-sans font-normal text-[var(--color-text-faint)]">{node.sub}</span>}
            </Tag>
            {i < nodes.length - 1 && (
              <span
                aria-hidden="true"
                className={`relative shrink-0 bg-[var(--color-border)] ${
                  horizontal ? "mx-1 h-px w-4 flex-1 min-w-3" : auto ? "ml-4 h-3.5 w-px sm:mx-1 sm:ml-0 sm:h-px sm:w-auto sm:min-w-3 sm:flex-1" : "ml-4 h-3.5 w-px"
                }`}
              >
                {hop && (horizontal || auto) && (
                  <motion.span
                    className={`absolute -top-[2.5px] h-[6px] w-[6px] rounded-full ${auto ? "hidden sm:block" : ""}`}
                    style={{ backgroundColor: color }}
                    initial={{ left: "0%", opacity: 0 }}
                    animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                    transition={{ duration: interval / 1000 - 0.1, ease: "easeInOut" }}
                  />
                )}
                {hop && !horizontal && (
                  <motion.span
                    className={`absolute -left-[2.5px] h-[6px] w-[6px] rounded-full ${auto ? "sm:hidden" : ""}`}
                    style={{ backgroundColor: color }}
                    initial={{ top: "0%", opacity: 0 }}
                    animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                    transition={{ duration: interval / 1000 - 0.1, ease: "easeInOut" }}
                  />
                )}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
