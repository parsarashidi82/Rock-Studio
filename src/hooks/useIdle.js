import { useEffect, useState } from "react";

// وقتی enabled است و روی element به مدت delay میلی‌ثانیه موس حرکت نکرده، true می‌شود
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

    arm(); // از لحظه‌ی فعال شدن، ۲ ثانیه شمارش شروع می‌شود
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