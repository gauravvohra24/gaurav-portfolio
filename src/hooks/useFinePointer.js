import { useEffect, useState } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

/** True on mouse/trackpad devices — gates cursor effects, tilt, magnetism and parallax. */
export function useFinePointer() {
  const [fine, setFine] = useState(() => typeof window !== "undefined" && window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return fine;
}
