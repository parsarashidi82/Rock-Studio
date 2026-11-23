import { useEffect, useState } from "react";
import { BREAKPOINTS } from "@/lib/constants";

/**
 * هوک اختصاصی ری‌اکت جهت تشخیص ریسپانسیو ابعاد موبایل.
 * کاملاً ایمن برای رندرینگ سمت سرور (SSR-Safe) با لود اولیه تنبل (Lazy State)
 * و لغو رویدادهای matchMedia جهت جلوگیری از نشت حافظه.
 *
 * @param {number} [breakpoint=BREAKPOINTS.MOBILE] - عرض به پیکسل (پیش‌فرض ۷۶۸px)
 * @returns {boolean} آیا اندازه ویوپورت کمتر از مقدار بریک‌پوینت است؟
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
