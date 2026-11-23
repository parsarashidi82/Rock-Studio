import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectPortalNav from "@/components/features/Work/ProjectPortalNav";
import ProjectView from "@/components/features/ProjectDetail/ProjectView";

/**
 * کانتینر اصلی صفحه کیس‌استادی پروژه (Project Detail Page Container).
 * 
 * وظایف کلیدی:
 * ۱. خواندن شناسه اسلاگ از آدرس URL و یافتن پروژه متناظر در دیتابیس
 * ۲. هماهنگی ترنزیشن زوم تمام‌صفحه (Full-Page Zoom) از محل دقیق کلیک کاربر
 * ۳. نگهداری بافر پروژه زیرین برای جلوگیری از سفید شدن یا پرش پس‌زمینه در حین ترنزیشن
 * ۴. پشتیبانی از ناوبری شناور پرتال در گوشه‌های صفحه (ProjectPortalNav)
 */
export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const currentProject = projects.find((p) => p.slug === slug);
  const [underlyingProject, setUnderlyingProject] = useState(null);
  const [transitioning, setTransitioning] = useState(null); // { targetProject, origin, id }

  // پروژه مبنای فعلی در حال مشاهده یا مقصد ترنزیشن
  const focusProject =
    transitioning?.targetProject || underlyingProject || currentProject;
  const focusIndex = projects.findIndex((p) => p.slug === focusProject?.slug);
  const count = projects.length;
  const nextProject =
    focusIndex !== -1 ? projects[(focusIndex + 1) % count] : projects[0];
  const prevProject =
    focusIndex !== -1
      ? projects[(focusIndex - 1 + count) % count]
      : projects[count - 1];

  // اسکرول آنی به بالای صفحه هنگام تغییر پروژه
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  // مدیریت ناوبری زوم روی کل صفحه مقصد بر اساس مختصات کلیک
  const handleNavigate = useCallback((targetProject, origin) => {
    if (!targetProject) return;
    setTransitioning((prev) => {
      if (prev?.targetProject) {
        setUnderlyingProject(prev.targetProject);
      }
      return {
        targetProject,
        origin:
          origin || {
            x: window.innerWidth - 80,
            y: window.innerHeight / 2,
            side: "right",
          },
        id: Date.now(),
      };
    });
  }, []);

  const handleAnimationComplete = () => {
    if (!transitioning) return;
    const target = transitioning.targetProject;
    setUnderlyingProject(null);
    navigate(`/projects/${target.slug}`, { replace: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    setTransitioning(null);
  };

  if (!currentProject) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#050508] px-6 text-center text-white">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#67E8F9]">
          404 · Project Not Found
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          We couldn&apos;t find this case study.
        </h1>
        <Link
          to="/"
          className="mt-8 rounded-full border border-white/20 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-white transition-colors duration-300 hover:border-[#67E8F9] hover:bg-[#67E8F9] hover:text-[#050508]"
        >
          ← Return to Home
        </Link>
      </main>
    );
  }

  // محاسبه مرکز دوران و بزرگ‌نمایی زوم بر اساس سمت کلیک کاربر
  const originStyle = transitioning
    ? {
        transformOrigin:
          transitioning.origin.side === "right"
            ? `92% ${transitioning.origin.y}px`
            : transitioning.origin.side === "left"
              ? `8% ${transitioning.origin.y}px`
              : "50% 50%",
      }
    : {};

  return (
    <div className="relative min-h-screen bg-[#050508]">
      {/* نمای پروژه جاری (بافر پایدار در پس‌زمینه برای عدم پرش) */}
      <ProjectView
        project={underlyingProject || currentProject}
        nextProject={nextProject}
        onNextClick={(p) =>
          handleNavigate(p, {
            x: window.innerWidth / 2,
            y: window.innerHeight * 0.75,
            side: "center",
          })
        }
      />

      {/* لایه زوم پویا و تمام‌صفحه به پروژه مقصد */}
      {transitioning && (
        <motion.div
          key={transitioning.targetProject.slug}
          initial={{
            scale: 0.22,
            opacity: 0,
            borderRadius: "28px",
            boxShadow:
              "0 30px 100px rgba(0,0,0,0.95), 0 0 60px rgba(103,232,249,0.35)",
          }}
          animate={{
            scale: 1,
            opacity: 1,
            borderRadius: "0px",
            boxShadow: "0 0 0 rgba(0,0,0,0)",
          }}
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1], // منحنی اکسپوننشیال نرم
          }}
          onAnimationComplete={handleAnimationComplete}
          style={originStyle}
          className="pointer-events-none fixed inset-0 z-50 select-none overflow-hidden bg-[#050508] will-change-transform"
        >
          <ProjectView
            project={transitioning.targetProject}
            nextProject={
              projects[
                (projects.findIndex(
                  (p) => p.slug === transitioning.targetProject.slug
                ) +
                  1) %
                  projects.length
              ]
            }
          />
        </motion.div>
      )}

      {/* کنترل‌های ناوبری پرتال در گوشه‌های صفحه (دسکتاپ و موبایل) */}
      <ProjectPortalNav
        nextProject={nextProject}
        prevProject={prevProject}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
