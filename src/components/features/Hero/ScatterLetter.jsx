import { motion, useTransform, cubicBezier } from "framer-motion";

/**
 * منحنی شتاب اکسپوننشیال نرم برای استقرار حروف در موقعیت نهایی
 * Cubic bezier curve (0.22, 1, 0.36, 1) ensuring organic deceleration
 */
const easeOut = cubicBezier(0.22, 1, 0.36, 1);

/**
 * محدود کردن مقدار عددی در بازه [0, 1]
 * @param {number} v - ورودی
 * @returns {number} مقدار کلمپ‌شده بین ۰ و ۱
 */
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * @typedef {Object} Glyph
 * @property {string} char - کاراکتر نمایشی
 * @property {number} x - موقعیت افقی هدف در استیج
 */

/**
 * @typedef {Object} Seed
 * @property {number} x - ضریب جابجایی افقی اولیه
 * @property {number} y - ضریب جابجایی عمودی اولیه
 * @property {number} rotate - زاویه چرخش اولیه به درجه
 * @property {number} scale - ضریب اندازه اولیه
 * @property {number} end - زمان پایان پراکندگی در اسکرول
 * @property {number} floatSpeed - سرعت نوسان شناور بودن در فضا
 * @property {number} floatPhase - فاز اولیه نوسان
 */

/**
 * کامپوننت تک‌حرف واگرا و شناور در سکشن Hero
 * 
 * این کامپوننت رفتار فیزیکی هر کاراکتر را هنگام اسکرول هدایت می‌کند:
 * ۱. در ابتدای صفحه، حروف با مختصات تصادفی در کل استیج پراکنده‌اند و حرکتی معلق (Floating) دارند.
 * ۲. با اسکرول کاربر، فاکتور k از ۱ به ۰ کاهش می‌یابد و هر حرف در جایگاه دقیق املایی کلمه "Rok Studio" می‌نشیند.
 * ۳. نوسانات سینوسی و کسینوسی به آرامی خنثی شده و انیمیشن بدون لرزش قفل می‌شود.
 * 
 * @param {Object} props
 * @param {Glyph} props.glyph - مشخصات کاراکتر و مختصات نهایی
 * @param {Seed} props.seed - ضرایب تصادفی تولید شده برای هر حرف
 * @param {Object} props.layout - ابعاد استیج (عرض، ارتفاع، سایز قلم)
 * @param {import("framer-motion").MotionValue<number>} props.progress - پیشرفت انیمیشن اسکرول
 * @param {import("framer-motion").MotionValue<number>} props.time - زمان میلی‌ثانیه‌ای فریم رندر
 * @param {number} props.fontWeight - وزن قلم
 */
export default function ScatterLetter({
  glyph,
  seed,
  layout,
  progress,
  time,
  fontWeight,
}) {
  // k: فاکتور پراکندگی؛ از ۱ (کاملاً پراکنده و شناور) تا ۰ (نشسته در جای اصلی)
  const k = (p) => 1 - easeOut(clamp01(p / seed.end));

  // t: تبدیل زمان میلی‌ثانیه به زاویه رادیان بر اساس سرعت و فاز نوسان
  const t = (ms) => (ms / 1000) * seed.floatSpeed + seed.floatPhase;

  // محاسبه موقعیت افقی X با تلفیق اسکرول و نوسان سینوسی پیوسته
  const x = useTransform([progress, time], ([p, ms]) => {
    const kk = k(p);
    return seed.x * layout.width * kk + Math.sin(t(ms)) * 14 * kk;
  });

  // محاسبه موقعیت عمودی Y با تلفیق اسکرول و نوسان کسینوسی پیوسته
  const y = useTransform([progress, time], ([p, ms]) => {
    const kk = k(p);
    return seed.y * layout.height * kk + Math.cos(t(ms) * 0.9) * 14 * kk;
  });

  // محاسبه چرخش زاویه‌ای با کاهش تدریجی تا صفر
  const rotate = useTransform([progress, time], ([p, ms]) => {
    const kk = k(p);
    return seed.rotate * kk + Math.sin(t(ms) * 0.7) * 6 * kk;
  });

  // تغییر اسکیل حرف از اندازه بزرگ/کوچک پراکنده تا اندازه استاندارد (1)
  const scale = useTransform(progress, (p) => 1 + (seed.scale - 1) * k(p));

  return (
    <motion.span
      aria-hidden
      className="absolute whitespace-pre text-white will-change-transform"
      style={{
        left: glyph.x,
        top: layout.top,
        fontSize: layout.size,
        fontWeight,
        lineHeight: 1,
        letterSpacing: 0,
        x,
        y,
        rotate,
        scale,
      }}
    >
      {glyph.char}
    </motion.span>
  );
}
