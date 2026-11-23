import { useEffect, useState } from "react";
import { BREAKPOINTS } from "@/lib/constants";

/**
 * Custom React hook to detect mobile viewport width.
 * SSR-safe with lazy initialization and clean event listener cleanup.
 *
 * @param {number} [breakpoint=BREAKPOINTS.MOBILE] - Width in px below which is considered mobile
 * @returns {boolean} Whether the current viewport is mobile
 */
export function useMobile(breakpoint = BREAKPOINTS.MOBILE) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = `(max-width: ${breakpoint}px)`;
    const mq = window.matchMedia(query);

    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

export default useMobile;
