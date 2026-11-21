import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { projects } from "@/data/projects";
import DriftWall from "./DriftWall";

const items = projects.map((p) => ({
  image: p.image,
  fullImage: p.fullImage,
  video: p.video,
  hoverClip: p.hoverClip,
  slug: p.slug,
  title: p.title,
  category: p.category,
  href: `/projects/${p.slug}`,
  externalUrl: p.externalUrl,
}));

export default function Work() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(null);
  const [last, setLast] = useState(null); // برای fade-out بدون پریدن متن

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // افکت فید و اسکیل کلی وال
  const wallOpacity = useTransform(scrollYProgress, [0, 0.16, 0.82, 0.98], [0, 1, 1, 0]);
  const wallScale = useTransform(scrollYProgress, [0, 0.22, 0.82, 0.98], [0.94, 1, 1, 0.96]);

  // انیمیشن ورود و خروج عنوان بالا
  const headerOpacity = useTransform(scrollYProgress, [0.08, 0.22, 0.82, 0.94], [0, 1, 1, 0]);
  const headerY = useTransform(scrollYProgress, [0.08, 0.22, 0.82, 0.94], [-30, 0, 0, -25]);

  // انیمیشن نمایش نام پروژه فعال در پایین
  const bottomScrollOpacity = useTransform(scrollYProgress, [0.18, 0.24, 0.82, 0.94], [0, 1, 1, 0]);

  const handleActive = (item) => {
    setActive(item);
    if (item) setLast(item);
  };

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative z-20 h-[300vh] w-full isolate bg-transparent"
    >
      {/* کانتینر استیکی که هنگام اسکرول در صفحه قفل می‌ماند */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          style={{ opacity: wallOpacity, scale: wallScale }}
        >
          <DriftWall
            items={items}
            columns={5}
            tileWidth={200}
            tileHeight={132}
            gap={18}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={42}
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0}
            dim={1}
            radius={14}
            overlayColor="#050508"
            newTab={true}
            onActiveChange={handleActive}
            scrollYProgress={scrollYProgress}
          />

          {/* عنوان سکشن */}
          <motion.div
            style={{ opacity: headerOpacity, y: headerY }}
            className="pointer-events-none absolute left-6 top-24 z-20 md:left-10"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#67E8F9]">
              Selected Work
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Things we&apos;ve made.
            </h2>
          </motion.div>

          {/* اسم پروژه‌ی زیر موس */}
          <motion.div
            style={{ opacity: bottomScrollOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-12 z-20 text-center"
          >
            <div
              className={`transition-all duration-500 ${
                active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#67E8F9]">
                {last?.category}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                {last?.title}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
