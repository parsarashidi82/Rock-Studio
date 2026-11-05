import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const EDGE_THRESHOLD = 130; // پیکسل‌های حساس در گوشه‌های چپ و راست
const CARD_WIDTH = 240;
const CARD_HEIGHT = 150;

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

export default function ProjectPortalNav({ nextProject, prevProject }) {
  const navigate = useNavigate();

  const [activeSide, setActiveSide] = useState(null); // 'left' | 'right' | null
  const [isNavigating, setIsNavigating] = useState(false);

  const followerRef = useRef(null);
  const leftEdgeRef = useRef(null);
  const rightEdgeRef = useRef(null);

  const posRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, side: null });
  const rafRef = useRef(null);

  // تغییر پروژه با انیمیشن پورتال
  const goToProject = useCallback(
    (targetProject) => {
      if (!targetProject || isNavigating) return;
      setIsNavigating(true);

      const follower = followerRef.current;
      if (follower) {
        gsap.to(follower, {
          scale: 1.35,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => {
            navigate(`/projects/${targetProject.slug}`);
            window.scrollTo({ top: 0, behavior: "instant" });
            setIsNavigating(false);
            setActiveSide(null);
          },
        });
      } else {
        navigate(`/projects/${targetProject.slug}`);
        window.scrollTo({ top: 0, behavior: "instant" });
        setIsNavigating(false);
        setActiveSide(null);
      }
    },
    [navigate, isNavigating],
  );

  // میانبرهای کیبورد (ArrowRight برای بعدی، ArrowLeft برای قبلی)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // اگر کاربر در حال تایپ در فرم نیست
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

  // رهگیری موس و تشخیص گوشه‌های چپ و راست صفحه
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (isNavigating) return;
      const x = e.clientX;
      const y = e.clientY;
      const w = window.innerWidth;

      let side = null;
      if (x < EDGE_THRESHOLD && y > 80) {
        side = "left";
      } else if (x > w - EDGE_THRESHOLD && y > 80) {
        side = "right";
      }

      mouseRef.current = { x, y, side };
      setActiveSide(side);
    };

    const handlePointerLeave = () => {
      mouseRef.current.side = null;
      setActiveSide(null);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isNavigating]);

  // انیمیشن نرم دنبال‌کننده موس (Lerp Follower)
  useEffect(() => {
    const tick = () => {
      const follower = followerRef.current;
      const { x, y, side } = mouseRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (follower && side) {
        // محاسبه موقعیت ایده‌آل کارت برای خروج نزدن از کادر
        const targetY = clamp(y - CARD_HEIGHT / 2, 90, h - CARD_HEIGHT - 30);
        const targetX =
          side === "right"
            ? clamp(x - CARD_WIDTH - 24, 20, w - CARD_WIDTH - 20)
            : clamp(x + 24, 20, w - CARD_WIDTH - 20);

        // نرم‌سازی حرکت (Lerp)
        posRef.current.x += (targetX - posRef.current.x) * 0.16;
        posRef.current.y += (targetY - posRef.current.y) * 0.16;

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
      {/* گوشه تعاملی سمت چپ (پروژه قبلی) */}
      {prevProject && (
        <div
          ref={leftEdgeRef}
          onClick={() => goToProject(prevProject)}
          className={`fixed left-0 top-20 bottom-0 z-40 w-20 md:w-28 cursor-pointer transition-all duration-500 ${
            activeSide === "left"
              ? "bg-gradient-to-r from-[#67E8F9]/15 via-[#67E8F9]/5 to-transparent"
              : "bg-transparent hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent"
          }`}
          aria-label={`Previous Project: ${prevProject.title}`}
          role="button"
          tabIndex={0}
        >
          {/* نشانگر ظریف عمودی */}
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-300 ${
              activeSide === "left"
                ? "opacity-100 translate-x-0 scale-110"
                : "opacity-25 -translate-x-1"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#67E8F9]/40 bg-[#050508]/80 text-[#67E8F9] backdrop-blur-md shadow-[0_0_20px_rgba(103,232,249,0.3)]">
              ‹
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#67E8F9] [writing-mode:vertical-rl] rotate-180">
              PREV
            </span>
          </div>
        </div>
      )}

      {/* گوشه تعاملی سمت راست (پروژه بعدی) */}
      {nextProject && (
        <div
          ref={rightEdgeRef}
          onClick={() => goToProject(nextProject)}
          className={`fixed right-0 top-20 bottom-0 z-40 w-20 md:w-28 cursor-pointer transition-all duration-500 ${
            activeSide === "right"
              ? "bg-gradient-to-l from-[#67E8F9]/15 via-[#67E8F9]/5 to-transparent"
              : "bg-transparent hover:bg-gradient-to-l hover:from-white/[0.04] hover:to-transparent"
          }`}
          aria-label={`Next Project: ${nextProject.title}`}
          role="button"
          tabIndex={0}
        >
          {/* نشانگر ظریف عمودی */}
          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-300 ${
              activeSide === "right"
                ? "opacity-100 translate-x-0 scale-110"
                : "opacity-25 translate-x-1"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#67E8F9]/40 bg-[#050508]/80 text-[#67E8F9] backdrop-blur-md shadow-[0_0_20px_rgba(103,232,249,0.3)]">
              ›
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#67E8F9] [writing-mode:vertical-rl]">
              NEXT
            </span>
          </div>
        </div>
      )}

      {/* پیش‌نمایش شناور کارت پورتال (Floating Portal Preview Follower) */}
      {activeProject && (
        <div
          ref={followerRef}
          onClick={() => goToProject(activeProject)}
          className={`pointer-events-auto fixed left-0 top-0 z-50 cursor-pointer will-change-transform transition-opacity duration-200 ${
            activeSide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ width: `${CARD_WIDTH}px` }}
        >
          {/* تگ راهنما */}
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#67E8F9] bg-[#67E8F9] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#050508] shadow-[0_0_15px_rgba(103,232,249,0.5)]">
              {isRight ? "Next Project →" : "← Prev Project"}
            </span>
          </div>

          {/* کارت تصویر و مشخصات با تم نئون راک استودیو */}
          <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-[#080812]/95 p-1.5 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(103,232,249,0.25)] transition-all duration-300 hover:border-[#67E8F9]">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#0b0b14]">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />
            </div>

            <div className="p-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#67E8F9]">
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
