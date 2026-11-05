import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const CARD_WIDTH = 250;
const CARD_HEIGHT = 160;

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

export default function ProjectPortalNav({ nextProject, prevProject }) {
  const navigate = useNavigate();

  const [activeSide, setActiveSide] = useState(null); // 'left' | 'right' | null
  const [isNavigating, setIsNavigating] = useState(false);

  const followerRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, active: false, side: null });
  const rafRef = useRef(null);

  // پاکسازی انیمیشن هنگام آن‌مانت
  useEffect(() => {
    const el = followerRef.current;
    return () => {
      if (el) {
        gsap.killTweensOf(el);
      }
    };
  }, []);

  // ناوبری به پروژه مقصد با افکت پورتال
  const goToProject = useCallback(
    (targetProject) => {
      if (!targetProject || isNavigating) return;
      setIsNavigating(true);

      const follower = followerRef.current;
      if (follower) {
        gsap.to(follower, {
          scale: 1.25,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            navigate(`/projects/${targetProject.slug}`);
            window.scrollTo({ top: 0, behavior: "instant" });
          },
        });
      } else {
        navigate(`/projects/${targetProject.slug}`);
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    },
    [navigate, isNavigating],
  );

  // پشتیبانی از کلیدهای کیبورد
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (e.key === "ArrowRight" && nextProject) {
        goToProject(nextProject);
      } else if (e.key === "ArrowLeft" && prevProject) {
        goToProject(prevProject);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextProject, prevProject, goToProject]);

  // رویدادهای هاور و حرکت ماوس روی محدوده سمت راست
  const handleRightMove = (e) => {
    if (isNavigating) return;
    const x = e.clientX;
    const y = e.clientY;
    const w = window.innerWidth;
    const h = window.innerHeight;

    mouseRef.current = { x, y, active: true, side: "right" };
    targetPosRef.current = {
      x: clamp(x - CARD_WIDTH - 24, 20, w - CARD_WIDTH - 20),
      y: clamp(y - CARD_HEIGHT / 2, 20, h - CARD_HEIGHT - 20),
    };

    if (activeSide !== "right") {
      setActiveSide("right");
      // همگام‌سازی موقعیت اولیه بدون پرش
      posRef.current = { ...targetPosRef.current };
    }
  };

  // رویدادهای هاور و حرکت ماوس روی محدوده سمت چپ
  const handleLeftMove = (e) => {
    if (isNavigating) return;
    const x = e.clientX;
    const y = e.clientY;
    const w = window.innerWidth;
    const h = window.innerHeight;

    mouseRef.current = { x, y, active: true, side: "left" };
    targetPosRef.current = {
      x: clamp(x + 24, 20, w - CARD_WIDTH - 20),
      y: clamp(y - CARD_HEIGHT / 2, 20, h - CARD_HEIGHT - 20),
    };

    if (activeSide !== "left") {
      setActiveSide("left");
      // همگام‌سازی موقعیت اولیه بدون پرش
      posRef.current = { ...targetPosRef.current };
    }
  };

  const handleLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.side = null;
    setActiveSide(null);
  };

  // انیمیشن فریم به فریم برای تعقیب روان ماوس (Lerp)
  useEffect(() => {
    const tick = () => {
      const follower = followerRef.current;
      if (follower && mouseRef.current.active) {
        const target = targetPosRef.current;
        // همگرایی نرم با موقعیت ماوس
        posRef.current.x += (target.x - posRef.current.x) * 0.2;
        posRef.current.y += (target.y - posRef.current.y) * 0.2;

        follower.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const activeProject = activeSide === "right" ? nextProject : prevProject;
  const isRight = activeSide === "right";

  return (
    <>
      {/* محدوده فعال لبه سمت چپ (پروژه قبلی) - سرتاسر ارتفاع صفحه */}
      {prevProject && (
        <div
          onPointerEnter={handleLeftMove}
          onPointerMove={handleLeftMove}
          onPointerLeave={handleLeave}
          onClick={() => goToProject(prevProject)}
          className={`fixed left-0 top-0 bottom-0 z-40 w-24 md:w-36 cursor-pointer select-none transition-colors duration-300 ${
            activeSide === "left"
              ? "bg-gradient-to-r from-[#67E8F9]/15 via-[#67E8F9]/5 to-transparent"
              : "bg-transparent hover:bg-gradient-to-r hover:from-white/[0.03] hover:to-transparent"
          }`}
          aria-label={`Previous Project: ${prevProject.title}`}
          role="button"
          tabIndex={0}
        >
          {/* دکمه و آیکون راهنمای چپ */}
          <div
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-300 ${
              activeSide === "left"
                ? "opacity-100 translate-x-0 scale-110"
                : "opacity-25 -translate-x-1 hover:opacity-75"
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#67E8F9]/50 bg-[#050508]/90 text-[#67E8F9] text-lg backdrop-blur-md shadow-[0_0_25px_rgba(103,232,249,0.35)]">
              ‹
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#67E8F9] [writing-mode:vertical-rl] rotate-180">
              PREV
            </span>
          </div>
        </div>
      )}

      {/* محدوده فعال لبه سمت راست (پروژه بعدی) - سرتاسر ارتفاع صفحه */}
      {nextProject && (
        <div
          onPointerEnter={handleRightMove}
          onPointerMove={handleRightMove}
          onPointerLeave={handleLeave}
          onClick={() => goToProject(nextProject)}
          className={`fixed right-0 top-0 bottom-0 z-40 w-24 md:w-36 cursor-pointer select-none transition-colors duration-300 ${
            activeSide === "right"
              ? "bg-gradient-to-l from-[#67E8F9]/15 via-[#67E8F9]/5 to-transparent"
              : "bg-transparent hover:bg-gradient-to-l hover:from-white/[0.03] hover:to-transparent"
          }`}
          aria-label={`Next Project: ${nextProject.title}`}
          role="button"
          tabIndex={0}
        >
          {/* دکمه و آیکون راهنمای راست */}
          <div
            className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-300 ${
              activeSide === "right"
                ? "opacity-100 translate-x-0 scale-110"
                : "opacity-25 translate-x-1 hover:opacity-75"
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#67E8F9]/50 bg-[#050508]/90 text-[#67E8F9] text-lg backdrop-blur-md shadow-[0_0_25px_rgba(103,232,249,0.35)]">
              ›
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#67E8F9] [writing-mode:vertical-rl]">
              NEXT
            </span>
          </div>
        </div>
      )}

      {/* کارت شناور پیش‌نمایش (با pointer-events-none تا هرگز مانع ماوس یا لبه‌ها نشود) */}
      {activeProject && (
        <div
          ref={followerRef}
          className={`pointer-events-none fixed left-0 top-0 z-50 will-change-transform transition-opacity duration-200 ${
            activeSide ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: `${CARD_WIDTH}px` }}
        >
          {/* برچسب جهت و راهنما */}
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#67E8F9] bg-[#67E8F9] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#050508] shadow-[0_0_15px_rgba(103,232,249,0.5)]">
              {isRight ? "Next Project →" : "← Prev Project"}
            </span>
          </div>

          {/* کارت تصویر پروژه با استایل شیشه‌ای نئون */}
          <div className="relative overflow-hidden rounded-xl border border-white/20 bg-[#080812]/95 p-1.5 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(103,232,249,0.3)]">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#0b0b14]">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />
            </div>

            <div className="p-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#67E8F9]">
                {activeProject.category}
              </span>
              <p className="mt-0.5 truncate text-sm font-semibold tracking-tight text-white">
                {activeProject.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
