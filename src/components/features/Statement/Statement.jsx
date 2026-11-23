import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  cubicBezier,
} from "framer-motion";

/**
 * خطوط بیانیه مانیفست استودیو راک
 */
const LINES = [
  ["WE", "TURN", "IDEAS"],
  ["INTO", "EXPERIENCES."],
];
const SERVICES = ["Web", "Motion", "Visual", "Digital"];

// نقاط عطف پیشرفت انیمیشن بر مبنای اسکرول (بازه ۰ تا ۱)
const LETTERS_END = 0.6; // تا ۶۰٪ اسکرول تمام حروف حل و ظاهر شده‌اند
const SUB_RANGE = [0.6, 0.82]; // در بازه ۶۰٪ تا ۸۲٪ زیرنویس خدمات ظاهر می‌شود

const ease = cubicBezier(0.22, 1, 0.36, 1);

// ایندکس‌گذاری قطعی و پایدار تمام حروف برای ایجاد تاخیر متوالی (Stagger)
let counter = 0;
const PARSED = LINES.map((words) =>
  words.map((word) =>
    Array.from(word).map((char) => ({ char, i: counter++ })),
  ),
);
const TOTAL = counter;

/**
 * درون‌یابی خطی رنگ بین سفید (#FFFFFF) و فیروزه‌ای (#67E8F9)
 * @param {number} t - پیشرفت درون‌یابی بین ۰ تا ۱
 * @returns {string} فرمت rgb
 */
const mix = (t) => {
  const from = [255, 255, 255];
  const to = [103, 232, 249];
  const c = from.map((v, k) => Math.round(v + (to[k] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

/**
 * کامپوننت رندر هر کاراکتر بیانیه به همراه افکت‌های ورود و خروج ذره‌ای
 */
function Letter({ char, i, progress, tint = null }) {
  const span = 0.22; // پهنای پنجره زمانی انیمیشن ورود هر حرف
  const start = (i / (TOTAL - 1)) * (LETTERS_END - span);
  const end = start + span;

  // ورود به سمت بالا و استقرار در جایگاه
  const y = useTransform(progress, [start, end], ["36px", "0px"], { ease });
  const scale = useTransform(progress, [start, end], [0.92, 1], { ease });
  const opacity = useTransform(progress, [start, start + span * 0.75], [0, 1]);
  // خروج از حالت تار بودن به وضوح کامل
  const filter = useTransform(
    progress,
    [start, end],
    ["blur(8px)", "blur(0px)"],
  );

  return (
    <motion.span
      className="inline-block will-change-transform"
      style={{
        y,
        scale,
        opacity,
        filter,
        color: tint ?? undefined,
      }}
    >
      {char}
    </motion.span>
  );
}

/**
 * سکشن مانیفست استودیو راک (Statement).
 * این بخش با تایپوگرافی غول‌آسا پیام برند را با اسکرول کاربر آشکار کرده
 * و خدمات اصلی استودیو را در زیرنویس به نمایش می‌گذارد.
 */
export default function Statement() {
  const containerRef = useRef(null);

  // رصد اسکرول سکشن
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // اسپرینگ روان برای حذف شوک اسکرول ماوس
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
  });

  // تغییر تدریجی رنگ کلمه EXPERIENCES به فیروزه‌ای شاخص راک
  const tint = useTransform(progress, [0.42, 0.65], [0, 1]);
  const expColor = useTransform(tint, mix);

  // انیمیشن ورود زیرنویس خدمات
  const subOpacity = useTransform(progress, SUB_RANGE, [0, 1]);
  const subY = useTransform(progress, SUB_RANGE, ["20px", "0px"], { ease });
  const subBlur = useTransform(progress, SUB_RANGE, ["6px", "0px"]);

  // محو شدن کل سکشن در انتها برای ورود نرم به بخش بعدی
  const exitOpacity = useTransform(progress, [0.88, 0.98], [1, 0]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-20 h-[220vh] bg-transparent text-white"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* لایه اصلی با افکت محو شدن پایانی */}
        <motion.div
          style={{ opacity: exitOpacity }}
          className="relative flex w-full max-w-7xl flex-col items-center px-6 text-center"
        >
          {/* تیتر عظیم مانیفست */}
          <h2 className="flex flex-col items-center font-sans text-[11vw] font-bold leading-[0.9] tracking-[-0.04em] sm:text-[9vw] md:text-[8vw] lg:text-[7.5vw]">
            {PARSED.map((lineWords, lineIndex) => (
              <span
                key={lineIndex}
                className="flex flex-wrap justify-center gap-x-[0.25em]"
              >
                {lineWords.map((wordChars, wordIndex) => {
                  const isExp = lineIndex === 1 && wordIndex === 1;
                  return (
                    <span key={wordIndex} className="inline-block whitespace-nowrap">
                      {wordChars.map(({ char, i }) => (
                        <Letter
                          key={i}
                          char={char}
                          i={i}
                          progress={progress}
                          tint={isExp ? expColor : null}
                        />
                      ))}
                    </span>
                  );
                })}
              </span>
            ))}
          </h2>

          {/* زیرنویس خدمات استودیو با تگ‌های فیروزه‌ای */}
          <motion.div
            style={{
              opacity: subOpacity,
              y: subY,
              filter: useTransform(subBlur, (b) => `blur(${b})`),
            }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.25em] text-white/50 sm:text-sm md:text-base"
          >
            {SERVICES.map((s, idx) => (
              <span key={s} className="flex items-center gap-2">
                {idx > 0 && (
                  <span className="inline-block h-1 w-1 rounded-full bg-[#67E8F9]" />
                )}
                <span className="text-white/80">{s}</span>
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
