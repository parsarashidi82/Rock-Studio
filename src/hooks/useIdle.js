import { useEffect, useState } from "react";

/**
 * هوک تشخیص عدم تحرک ماوس (Idle Detector).
 * هرگاه کاربر برای مدت زمان تعیین‌شده (delay) روی المان مورد نظر حرکتی انجام ندهد، مقدار true برمی‌گرداند
 * تا افکت‌های انیمیشن خودکار (مانند جاروب نوری TechText) فعال شوند.
 * 
 * @param {React.RefObject} ref - ارجاع DOM به المان استیج مورد نظر
 * @param {number} [delay=2000] - زمان انتظار به میلی‌ثانیه قبل از حالت Idle
 * @param {boolean} [enabled=true] - فعال یا غیرفعال بودن هوک
 * @returns {boolean} آیا کاربر در وضعیت بی‌حرکت است؟
 */
export function useIdle(ref, delay = 2000, enabled = true) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) {
      setIdle(false);
      return undefined;
    }

    let timer;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), delay);
    };
    const onActivity = () => {
      setIdle(false);
      arm();
    };

    arm(); // آغاز شمارش تایمر از لحظه فعال‌سازی
    el.addEventListener("pointermove", onActivity, { passive: true });
    el.addEventListener("pointerdown", onActivity, { passive: true });

    return () => {
      clearTimeout(timer);
      el.removeEventListener("pointermove", onActivity);
      el.removeEventListener("pointerdown", onActivity);
    };
  }, [ref, delay, enabled]);

  return idle;
}
