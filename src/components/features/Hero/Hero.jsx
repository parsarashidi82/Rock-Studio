import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTime,
  useTransform,
} from "framer-motion";

import { useTextLayout } from "@/hooks/useTextLayout";
import { useIdle } from "@/hooks/useIdle";
import { createLetterSeeds } from "@/lib/seededRandom";
import ScatterLetter from "./ScatterLetter";
import TechText from "./TechText";
import HeroMessage from "./HeroMessage";

/**
 * تنظیمات متنی و فونت سکشن ابتدایی Hero
 */
const TEXT = "Rok Studio";
const FONT_WEIGHT = 600;
const FONT_SIZE = 150;
const LETTER_SPACING = -0.05;
const ANIMATION_END = 0.5; // در ۵۰٪ اسکرول سکشن حروف کاملاً می‌نشینند

/**
 * کامپوننت سکشن اصلی Hero.
 * 
 * ویژگی‌های تعاملی و انیمیشن:
 * ۱. چیدمان چسبیده (Sticky Viewport) در ارتفاع ۳۰۰vh جهت کنترل گام‌به‌گام با اسکرول.
 * ۲. انتقال تدریجی حروف از فاز پراکنده (Scatter) به متن منظم Rok Studio.
 * ۳. جایگزینی نام استودیو با کامپوننت سایبری TechText پس از استقرار حروف.
 * ۴. نمایش خطوط داستان متنی (HeroMessage) در پایین صفحه در بازه‌های اسکرول تعیین‌شده.
 * ۵. تشخیص بی‌حرکتی ماوس (Idle) برای فعال‌سازی خودکار انیمیشن جاروب نوری (Sweep).
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  // پیشرفت اسکرول عمودی سکشن (از ۰ تا ۱ در طول ۳۰۰vh)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // اسپرینگ بسیار نرم برای روایت پیام‌ها و فید انتهای سکشن Hero
  const story = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // فید و اسکیل خروجی در انتهای هیرو جهت اتصال بدون درز به سکشن Statement
  const heroOpacity = useTransform(story, [0.92, 1], [1, 0]);
  const heroScale = useTransform(story, [0.92, 1], [1, 1.04]);

  // مقیاس‌بندی پیشرفت انیمیشن حروف (تا ۵۰٪ اسکرول به پایان می‌رسد)
  const scaled = useTransform(scrollYProgress, [0, ANIMATION_END], [0, 1]);
  const progress = useSpring(scaled, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // تایمر پیوسته میلی‌ثانیه‌ای فریم‌ها برای فیزیک شناوری حروف
  const time = useTime();

  // محاسبه ابعاد دقیق و مختصات قرارگیری کاراکترها روی استیج
  const layout = useTextLayout(stageRef, {
    text: TEXT,
    fontWeight: FONT_WEIGHT,
    fontSize: FONT_SIZE,
    letterSpacing: LETTER_SPACING,
  });

  // تولید ضرایب تصادفی پایدار و بدون تغییر در طول رندر
  const seeds = useMemo(() => createLetterSeeds(TEXT.length, 7), []);

  // کنترل شفافیت لایه‌های مختلف در طول اسکرول
  const lettersOpacity = useTransform(progress, [0.7, 0.8], [1, 0]);
  const techOpacity = useTransform(progress, [0.55, 0.75], [0, 1]);
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  // TechText فقط وقتی حروف نشستند mount می‌شود
  const [techOn, setTechOn] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    setTechOn(v > 0.5);
  });

  const techRef = useRef(null);

  // تشخیص ۱ ثانیه عدم حرکت ماوس برای راه‌اندازی جاروب نوری
  const idle = useIdle(stageRef, 1000, techOn);

  // هنگام idle شدن، تریگر خروج ماوس را شبیه‌سازی می‌کند تا جاروب شروع شود
  useEffect(() => {
    if (idle)
      techRef.current?.firstElementChild?.dispatchEvent(
        new Event("pointerleave"),
      );
  }, [idle]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative z-10 h-[300vh] bg-transparent"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          {/* هاله نورانی کانونی در پس‌زمینه */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(103,232,249,0.12),transparent_35%)]" />

          {/* استیج اصلی رندر تایپوگرافی */}
          <div ref={stageRef} className="absolute inset-0 font-sans">
            {/* لایه‌ی حروف واگرا و پراکنده */}
            {layout && (
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{ opacity: lettersOpacity }}
              >
                {layout.glyphs.map((glyph, i) => (
                  <ScatterLetter
                    key={i}
                    glyph={glyph}
                    seed={seeds[i]}
                    layout={layout}
                    progress={progress}
                    time={time}
                    fontWeight={FONT_WEIGHT}
                  />
                ))}
              </motion.div>
            )}

            {/* لایه‌ی تعاملی سایبری TechText */}
            {techOn && (
              <motion.div
                ref={techRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto"
                style={{ opacity: techOpacity }}
              >
                <TechText text={TEXT} />
              </motion.div>
            )}

            {/* نشانگر راهنمای اسکرول در پایین صفحه */}
            <motion.div
              style={{ opacity: hintOpacity }}
              className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                Scroll to Assemble
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="h-4 w-[1px] bg-gradient-to-b from-[#67E8F9] to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* پیام‌های روایی گام‌به‌گام استودیو در پایین صفحه */}
        <HeroMessage progress={story} />
      </div>
    </section>
  );
}
