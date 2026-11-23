import { motion, useTransform } from "framer-motion";

/**
 * خطوط داستانی استودیو راک به ترتیب نمایش در اسکرول
 * فرمت range: [شروع ورود، تکمیل ورود، شروع خروج، پایان خروج] بر مبنای پیشرفت ۰ تا ۱ اسکرول هیرو
 */
const MESSAGES = [
  { text: "It all starts with an idea", range: [0.06, 0.09, 0.17, 0.2] },
  { text: "Even we were once just an idea", range: [0.21, 0.24, 0.32, 0.35] },
  { text: "Three minds, one vision", range: [0.36, 0.39, 0.47, 0.5] },
  { text: "This is Rok Studio", range: [0.52, 0.55, 0.66, 0.7] },
  {
    text: "Our story starts here. Yours could too.",
    range: [0.72, 0.75, 0.88, 0.92],
  },
];

/**
 * کامپوننت پیام تکی که در بازه اسکرول اختصاصی خود به نرمی وارد و خارج می‌شود.
 * 
 * @param {Object} props
 * @param {string} props.text - متن پیام
 * @param {number[]} props.range - بازه‌های ۴گانه پیشرفت [a, b, c, d]
 * @param {import("framer-motion").MotionValue<number>} props.progress - اسپرینگ اسکرول سراسری هیرو
 */
function Message({ text, range, progress }) {
  const [a, b, c, d] = range;
  // شفافیت از ۰ به ۱ و سپس دوباره به ۰
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  // جابجایی عمودی ظریف ۸ پیکسل جهت ایجاد حس بالا آمدن و سپس ادامه حرکت
  const y = useTransform(progress, [a, b, c, d], [8, 0, 0, -8]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center whitespace-nowrap font-mono text-[16px] uppercase tracking-[0.3em] text-white/40"
    >
      {text}
    </motion.div>
  );
}

/**
 * نگهدارنده مجموعه پیام‌های روایی استودیو در پایین صفحه هیرو
 * 
 * @param {Object} props
 * @param {import("framer-motion").MotionValue<number>} props.progress - مقدار اسپرینگ اسکرول هیرو
 */
export default function HeroMessage({ progress }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {MESSAGES.map((m) => (
        <Message key={m.text} {...m} progress={progress} />
      ))}
    </div>
  );
}
