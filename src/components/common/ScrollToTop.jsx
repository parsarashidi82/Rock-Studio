import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * کامپوننت اسکرول خودکار به بالای صفحه (Scroll To Top).
 * با هر بار تغییر مسیر (URL Pathname) در React Router، اسکرول صفحه را بلافاصله به بالای صفحه بازمی‌گرداند.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
