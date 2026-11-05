import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const [portalLayer, setPortalLayer] = useState(null);

  const followerRef = useRef(null);
  const portalElRef = useRef(null);
  const portalTitleRef = useRef(null);

  const posRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, active: false, side: null });
  const rafRef = useRef(null);

  // پاکسازی انیمیشن هنگام آن‌مانت
  useEffect(() => {
    const el = followerRef.current;
    const portalEl = portalElRef.current;
    return () => {
      if (el) gsap.killTweensOf(el);
      if (portalEl) gsap.killTweensOf(portalEl);
    };
  }, []);

  // شروع انیمیشن گسترش پورتال تمام‌صفحه به سبک Portal Carousel
  const goToProject = useCallback(
    (targetProject) => {
      if (!targetProject || isNavigating) return;
      setIsNavigating(true);

      const follower = followerRef.current;
      const followerRect = follower?.getBoundingClientRect();

      const origin =
        followerRect && followerRect.width > 0
          ? {
              left: followerRect.left,
              top: followerRect.top,
              width: followerRect.width,
              height: followerRect.height,
            }
          : {
              left: posRef.current.x || window.innerWidth - CARD_WIDTH - 24,
              top: posRef.current.y || window.innerHeight / 2 - CARD_HEIGHT / 2,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
            };

      // مخفی کردن پیش‌نمایش کوچک کرسر تا با پورتال گسترش‌یابنده ادغام شود
      setActiveSide(null);

      setPortalLayer({
        project: targetProject,
        origin,
      });
    },
    [isNavigating],
  );

  // اجرای انیمیشن گسترش تمام‌صفحه (Expanding Layer) با GSAP
  useEffect(() => {
    if (!portalLayer) return;
    const el = portalElRef.current;
    const title = portalTitleRef.current;
    if (!el) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // انتقال روت به پروژه جدید
        navigate(`/projects/${portalLayer.project.slug}`);
        window.scrollTo({ top: 0, behavior: "instant" });

        // فید اوت نرم لایه برای رونمایی از صفحه جدید
        gsap.to(el, {
          opacity: 0,
          duration: 0.45,
          delay: 0.1,
          ease: "power2.out",
          onComplete: () => {
            setPortalLayer(null);
            setIsNavigating(false);
          },
        });
      },
    });

    // گسترش کارت از موقعیت ماوس به اندازه کل پنجره با منحنی اکسپوننشال
    tl.to(el, {
      left: 0,
      top: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      duration: 0.75,
      ease: "expo.inOut",
    });

    // طلوع همزمان عنوان و مشخصات پروژه جدید
    if (title) {
      tl.fromTo(
        title,
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.55, ease: "expo.out" },
        "-=0.45",
      );
    }
  }, [portalLayer, navigate]);

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
    if (isNavigating || portalLayer) return;
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
      posRef.current = { ...targetPosRef.current };
    }
  };

  // رویدادهای هاور و حرکت ماوس روی محدوده سمت چپ
  const handleLeftMove = (e) => {
    if (isNavigating || portalLayer) return;
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
      if (follower && mouseRef.current.active && !portalLayer) {
        const target = targetPosRef.current;
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
  }, [portalLayer]);

  const activeProject = activeSide === "right" ? nextProject : prevProject;
  const isRight = activeSide === "right";

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* محدوده فعال لبه سمت چپ (پروژه قبلی) */}
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

      {/* محدوده فعال لبه سمت راست (پروژه بعدی) */}
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

      {/* کارت شناور پیش‌نمایش ماوس */}
      {activeProject && !portalLayer && (
        <div
          ref={followerRef}
          className={`pointer-events-none fixed left-0 top-0 z-50 will-change-transform transition-opacity duration-200 ${
            activeSide ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: `${CARD_WIDTH}px` }}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#67E8F9] bg-[#67E8F9] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#050508] shadow-[0_0_15px_rgba(103,232,249,0.5)]">
              {isRight ? "Next Project →" : "← Prev Project"}
            </span>
          </div>

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

      {/* لایه پورتال تمام‌صفحه گسترش‌یابنده (Expanding Portal Layer) */}
      {portalLayer && (
        <div
          ref={portalElRef}
          className="fixed z-[99999] overflow-hidden bg-[#050508] shadow-[0_0_120px_rgba(103,232,249,0.4)] will-change-transform"
          style={{
            left: portalLayer.origin.left,
            top: portalLayer.origin.top,
            width: portalLayer.origin.width,
            height: portalLayer.origin.height,
            borderRadius: "14px",
          }}
        >
          <img
            src={portalLayer.project.image}
            alt={portalLayer.project.title}
            className="h-full w-full object-cover"
          />

          {/* گرادیان‌ها و افکت محوکننده سینمایی */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/50 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,8,0.85)_100%)]" />

          {/* تایتل رولینگ که در مرکز-پایین طلوع می‌کند */}
          <div
            ref={portalTitleRef}
            className="pointer-events-none absolute bottom-16 left-8 md:bottom-24 md:left-20 z-10 flex flex-col gap-2.5"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#67E8F9] shadow-[0_0_12px_#67E8F9]" />
              <span className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-[#67E8F9]">
                {portalLayer.project.category} · Launching Case Study
              </span>
            </div>
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
              {portalLayer.project.title}
            </h2>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
