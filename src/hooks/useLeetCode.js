import { useEffect, useRef, useState } from "react";
import { fetchLeetCode, readCachedLeetCode } from "../services/leetcodeService";

/**
 * Loads live LeetCode data when the section approaches the viewport — never
 * during the initial page render. Returns:
 *   status: "loading" | "live" | "stale" (last known copy, live failed) | "error" (nothing to show)
 */
export function useLeetCode() {
  const ref = useRef(null);
  const [state, setState] = useState(() => {
    const cached = readCachedLeetCode();
    return { status: "loading", data: cached, error: null };
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let cancelled = false;
    const load = () =>
      fetchLeetCode()
        .then((data) => !cancelled && setState({ status: "live", data, error: null }))
        .catch((error) => !cancelled && setState((s) => ({ status: s.data ? "stale" : "error", data: s.data, error })));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "900px 0px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return { ref, ...state };
}
