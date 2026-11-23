import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import { projects } from "@/data/projects";
import { useMobile } from "@/hooks/useMobile";
import DriftWall from "./DriftWall";

/**
 * نگاشت آرایه پروژه‌ها به آیتم‌های سازگار با کامپوننت DriftWall
 */
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
 * 
 * شامل:
 * ۱. چیدمان سه‌بعدی شناور DriftWall با پرسپکتیو پویا
 * ۲. ترنزیشن‌های اسکرول مبتنی بر فیزیک اسپرینگ
 * ۳. نمایش عنوان و اطلاعات پروژه فعال در بالای استیج
 * ۴. پاسخگویی تطبیقی به موبایل و تبلت با استفاده از هوک useMobile
 */
export default function Work() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(null);
  const [last, setLast] = useState(null); // نگهداری آخرین پروژه برای فید بدون پرش متن
  const isMobile = useMobile(768);

  // محاسبه پیشرفت اسکرول سکشن
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

  // افکت فید ملایم و پیوسته در ابتدای ورود و انتهای خروج
  const wallOpacity = useTransform(
    smoothProgress,
    [0, 0.18, 0.78, 0.98],
    [0, 1, 1, 0],
  );

  // تغییر اسکیل بسیار ظریف و طبیعی برای شبیه‌سازی عمق دوربین
  const wallScale = useTransform(
    smoothProgress,
    [0, 0.22, 0.78, 0.98],
    [0.96, 1, 1, 0.97],
  );

  // بروزرسانی تایتل شناور با هاور کاربر روی کاشی‌های پروژه
  const handleActiveChange = (item) => {
    setActive(item);
    if (item) setLast(item);
  };

  const current = active || last;

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative z-30 h-[450vh] bg-transparent text-white"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* لایه‌ی سه‌بعدی دیواره کاشی‌ها */}
        <motion.div
          style={{ opacity: wallOpacity, scale: wallScale }}
          className="absolute inset-0"
        >
          <DriftWall
            items={items}
            scrollProgress={smoothProgress}
            onActiveChange={handleActiveChange}
            columns={isMobile ? 3 : 5}
            perspective={1000}
            baseAngle={20}
            hoverScale={isMobile ? 1.04 : 1.08}
            activeScale={isMobile ? 1.05 : 1.1}
            focusOrigin={{ x: 0.5, y: 0.5 }}
            columnVariance={isMobile ? 0.08 : 0.25}
          />
        </motion.div>

        {/* عنوان ثابت سکشن در بالا سمت چپ */}
        <div className="pointer-events-none absolute left-6 top-8 z-30 sm:left-12 sm:top-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#67E8F9]">
            Selected Work
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            Recent Projects
          </h2>
        </div>

        {/* پیش‌نمایش شناور عنوان و کتگوری پروژه فعال در پایین */}
        <div className="pointer-events-none absolute bottom-8 left-6 right-6 z-30 flex items-end justify-between sm:bottom-12 sm:left-12 sm:right-12">
          <div
            className={`transition-all duration-500 ease-out ${
              active
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0 pointer-events-none"
            }`}
          >
            {current && (
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#67E8F9]">
                  {current.category}
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-3xl">
                  {current.title}
                </h3>
              </div>
            )}
          </div>

          {/* راهنمای تعامل با کاشی‌ها */}
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-white/30 md:block">
            Hover to Preview · Click to Explore
          </p>
        </div>
      </div>
    </section>
  );
}
