import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import { projects } from "@/data/projects";
import { useMobile } from "@/hooks/useMobile";
import DriftWall from "./DriftWall";

const items = projects.map((p) => ({
  image: p.image,
  fullImage: p.scrollImage || p.fullImage,
  video: p.video,
  hoverClip: p.hoverClip,
  slug: p.slug,
  title: p.title,
  category: p.category,
  href: `/projects/${p.slug}`,
  externalUrl: p.externalUrl,
}));

/**
 * سکشن کارهای برگزیده استودیو راک (Selected Works).
 * دیواره سه‌بعدی شناور DriftWall با پرسپکتیو پویا، فیزیک اسپرینگ و عنوان ثابت.
 */
export default function Work() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(null);
  const [last, setLast] = useState(null); // برای fade-out بدون پریدن متن
  const isMobile = useMobile(768);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // فیزیک اسپرینگ بسیار روان برای خنثی کردن پرش اسکرول ماوس
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.5,
    restDelta: 0.0001,
  });

  // افکت فید ملایم و پیوسته
  const wallOpacity = useTransform(
    smoothProgress,
    [0, 0.18, 0.78, 0.98],
    [0, 1, 1, 0],
  );

  // تغییر اسکیل بسیار ظریف و طبیعی
  const wallScale = useTransform(
    smoothProgress,
    [0, 0.22, 0.78, 0.98],
    [0.96, 1, 1, 0.97],
  );

  // بلور نرم برای فوکوس سینمایی هنگام ورود و خروج
  const wallBlur = useTransform(
    smoothProgress,
    [0, 0.16, 0.8, 0.98],
    [8, 0, 0, 8],
  );
  const wallFilter = useTransform(wallBlur, (b) =>
    b <= 0.1 ? "none" : `blur(${b}px)`,
  );

  // انیمیشن نرم عنوان بالا
  const headerOpacity = useTransform(
    smoothProgress,
    [0.06, 0.22, 0.76, 0.94],
    [0, 1, 1, 0],
  );
  const headerY = useTransform(
    smoothProgress,
    [0.06, 0.22, 0.76, 0.94],
    [-20, 0, 0, -15],
  );

  // انیمیشن نمایش نام پروژه فعال در پایین
  const bottomScrollOpacity = useTransform(
    smoothProgress,
    [0.16, 0.24, 0.76, 0.94],
    [0, 1, 1, 0],
  );

  const handleActive = (item) => {
    setActive(item);
    if (item) setLast(item);
  };

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative z-20 h-[280vh] w-full isolate bg-transparent"
    >
      {/* کانتینر استیکی که هنگام اسکرول در صفحه قفل می‌ماند */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          style={{
            opacity: wallOpacity,
            scale: wallScale,
            filter: wallFilter,
          }}
        >
          <DriftWall
            items={items}
            columns={isMobile ? 3 : 5}
            tileWidth={isMobile ? 130 : 200}
            tileHeight={isMobile ? 86 : 132}
            gap={isMobile ? 10 : 18}
            tilt={isMobile ? 10 : 16}
            turn={isMobile ? -8 : -14}
            perspective={isMobile ? 900 : 1200}
            depth={isMobile ? 60 : 120}
            speed={isMobile ? 30 : 42}
            variance={0.45}
            parallax={isMobile ? 0.35 : 0.6}
            lift={isMobile ? 32 : 64}
            fade={0}
            dim={1}
            radius={isMobile ? 10 : 14}
            overlayColor="#050508"
            newTab={true}
            onActiveChange={handleActive}
            scrollYProgress={smoothProgress}
          />

          {/* عنوان سکشن */}
          <motion.div
            style={{ opacity: headerOpacity, y: headerY }}
            className="pointer-events-none absolute left-5 top-20 z-20 md:left-10 md:top-24"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#67E8F9] md:text-[11px] md:tracking-[0.3em]">
              Selected Work
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-6xl">
              Things we&apos;ve made.
            </h2>
          </motion.div>

          {/* اسم پروژه‌ی زیر موس */}
          <motion.div
            style={{ opacity: bottomScrollOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-8 z-20 text-center md:bottom-12"
          >
            <div
              className={`transition-all duration-500 ${
                active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#67E8F9] md:text-[11px] md:tracking-[0.3em]">
                {last?.category}
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-5xl">
                {last?.title}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
