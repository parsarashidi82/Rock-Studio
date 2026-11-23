import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  cubicBezier,
} from "framer-motion";

const LINES = [
  ["WE", "TURN", "IDEAS"],
  ["INTO", "EXPERIENCES."],
];
const SERVICES = ["Web", "Motion", "Visual", "Digital"];

// زمان‌بندی (۰ تا ۱ پیشرفت اسکرول سکشن)
const LETTERS_END = 0.6; // تمام شدن حروف تیتر
const SUB_RANGE = [0.60, 0.82]; // ظاهر شدن زیرنویس

const ease = cubicBezier(0.22, 1, 0.36, 1);

// حروف را یک‌بار و ثابت ایندکس‌گذاری می‌کنیم
let counter = 0;
const PARSED = LINES.map((words) =>
  words.map((word) =>
    Array.from(word).map((char) => ({ char, i: counter++ })),
  ),
);
const TOTAL = counter;

// t بین ۰ و ۱: از سفید تا cyan (#67E8F9)
const mix = (t) => {
  const from = [255, 255, 255];
  const to = [103, 232, 249];
  const c = from.map((v, k) => Math.round(v + (to[k] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

function Letter({ char, i, progress, tint = null }) {
  const span = 0.22; // پنجره‌ی انیمیشن هر حرف
  const start = (i / (TOTAL - 1)) * (LETTERS_END - span);
  const end = start + span;

  const y = useTransform(progress, [start, end], ["36px", "0px"], { ease });
  const scale = useTransform(progress, [start, end], [0.92, 1], { ease });
  const opacity = useTransform(progress, [start, start + span * 0.75], [0, 1]);
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
        color: tint === null ? undefined : mix(tint),
      }}
    >
      {char}
    </motion.span>
  );
}

/**
 * سکشن بیانیه مانیفست استودیو راک (Statement).
 * پدیدار شدن تدریجی کاراکترهای تیتر با اسکرول و نمایش خدمات و دلیوربل‌های اصلی استودیو.
 */
export default function Statement() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // شروع وقتی بالای سکشن به ۶۰٪ ارتفاع صفحه رسید
    offset: ["start 0.6", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const subOpacity = useTransform(progress, SUB_RANGE, [0, 1]);
  const subY = useTransform(progress, SUB_RANGE, [16, 0], { ease });
  const subSpacing = useTransform(
    progress,
    [SUB_RANGE[0], 0.95],
    ["0.7em", "0.3em"],
    { ease },
  );
  const glow = useTransform(progress, [0.3, 0.8], [0, 1]);

  // محو شدن نرم و سینمایی هنگام انتقال به سکشن بعدی
  const exitOpacity = useTransform(progress, [0.86, 0.98], [1, 0]);
  const exitScale = useTransform(progress, [0.86, 0.98], [1, 0.96]);

  return (
    <section
      ref={sectionRef}
      id="services"
      data-section="statement"
      className="relative z-10 h-[250vh] bg-transparent"
    >
      <motion.div
        style={{ opacity: exitOpacity, scale: exitScale }}
        className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6"
      >
        {/* Glow که با اسکرول قوی‌تر می‌شود */}
        <motion.div
          style={{ opacity: glow }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,232,249,0.10),transparent_45%)]"
        />

        {/* تیتر */}
        <h2
          aria-label="We turn ideas into experiences."
          className="relative text-center font-semibold uppercase leading-[1.08] tracking-tight text-white text-[clamp(2.5rem,9vw,8.5rem)]"
        >
          <span aria-hidden className="block">
            {PARSED.map((words, li) => (
              <span
                key={li}
                className="flex flex-wrap justify-center gap-x-[0.28em] py-1"
              >
                {words.map((letters, wi) => {
                  const isAccent = li === 1 && wi === 1;
                  return (
                    <span
                      key={wi}
                      className="inline-flex"
                    >
                      {letters.map((l, k) => (
                        <Letter
                          key={l.i}
                          char={l.char}
                          i={l.i}
                          progress={progress}
                          tint={
                            isAccent
                              ? 0.25 + 0.75 * (k / (letters.length - 1))
                              : null
                          }
                        />
                      ))}
                    </span>
                  );
                })}
              </span>
            ))}
          </span>
        </h2>

        {/* زیرنویس یکپارچه بدون خط جداکننده */}
        <motion.p
          style={{ opacity: subOpacity, y: subY, letterSpacing: subSpacing }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-3 font-mono text-[11px] uppercase text-white/60 md:mt-14 md:text-xs"
        >
          {SERVICES.map((s, i) => (
            <span key={s} className="flex items-center gap-x-3">
              {s}
              {i < SERVICES.length - 1 && (
                <span className="text-[#67E8F9]">·</span>
              )}
            </span>
          ))}
        </motion.p>
      </motion.div>
    </section>
  );
}