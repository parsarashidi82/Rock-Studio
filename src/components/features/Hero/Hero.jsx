import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTime,
  useTransform,
} from "framer-motion";

import { useTextLayout } from "../../../hooks/useTextLayout";
import { createLetterSeeds } from "../../../lib/seededRandom";
import { useIdle } from "../../../hooks/useIdle";
import ScatterLetter from "./ScatterLetter";
import TechText from "./TechText";

const TEXT = "Rok Studio"; // اگر حروف بزرگ می‌خواهی: "ROK STUDIO"
const FONT_WEIGHT = 600;
const FONT_SIZE = 150;
const LETTER_SPACING = -0.05;
const ANIMATION_END = 0.7;

export default function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  // پیشرفت اسکرول کل سکشن (۰ تا ۱)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // پیشرفت انیمیشن در ۸۰٪ اسکرول به ۱ می‌رسد و بعد همان‌جا می‌ماند
  const scaled = useTransform(scrollYProgress, [0, ANIMATION_END], [0, 1]);
  const progress = useSpring(scaled, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const time = useTime();

  const layout = useTextLayout(stageRef, {
    text: TEXT,
    fontWeight: FONT_WEIGHT,
    fontSize: FONT_SIZE,
    letterSpacing: LETTER_SPACING,
  });

  // موقعیت‌های اولیه‌ی قطعی
  const seeds = useMemo(() => createLetterSeeds(TEXT.length, 7), []);

  const lettersOpacity = useTransform(progress, [0.7, 0.8], [1, 0]);
  const techOpacity = useTransform(progress, [0.55, 0.75], [0, 1]);
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  // TechText فقط وقتی حروف نشستند mount می‌شود
  const [techOn, setTechOn] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
  setTechOn(v > 0.5);
});

  const techRef = useRef(null);

  // ۲ ثانیه بی‌حرکتی موس، بعد از اینکه TechText فعال شد
  const idle = useIdle(stageRef, 1000, techOn);

  // وقتی idle شد، به TechText می‌گوییم موس بیرون است تا sweep شروع شود
  useEffect(() => {
    if (idle)
      techRef.current?.firstElementChild?.dispatchEvent(
        new Event("pointerleave"),
      );
  }, [idle]);

  return (
    <section ref={sectionRef} className="relative h-[350vh] bg-[#050508]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(103,232,249,0.12),transparent_35%)]" />

        {/* استیج: فونت از اینجا به هر دو لایه به ارث می‌رسد */}
        <div ref={stageRef} className="absolute inset-0 font-sans">
          {/* لایه‌ی حروف پراکنده */}
          {layout && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ opacity: lettersOpacity }}
            >
              {layout.glyphs.map((glyph) => (
                <ScatterLetter
                  key={glyph.index}
                  glyph={glyph}
                  seed={seeds[glyph.index]}
                  layout={layout}
                  progress={progress}
                  time={time}
                  fontWeight={FONT_WEIGHT}
                />
              ))}
            </motion.div>
          )}

          {/* لایه‌ی TechText */}
          {layout && techOn && (
            <motion.div
              ref={techRef}
              className="absolute inset-0"
              style={{ opacity: techOpacity }}
            >
              <TechText
                text={TEXT}
                fontWeight={FONT_WEIGHT}
                fontSize={layout.size}
                reveal="letter"
                dashLength={4}
                dashGap={2}
                specks={15}
                color="#ffffff"
                accentColor="#67E8F9"
                letterSpacing={LETTER_SPACING}
                reach={200}
                softness={0.7}
                strokeWidth={1.5}
                speed={0.5}
                lineStyle="dashed"
                selection
                labels
                draggable
                sweep={idle}
              />
            </motion.div>
          )}
        </div>

        {/* راهنمای اسکرول */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
        >
          Scroll
        </motion.div>
      </div>
    </section>
  );
}
