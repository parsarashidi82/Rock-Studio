import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CARD_WIDTH = 250;
const CARD_HEIGHT = 160;

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

const CIRCLE_RADIUS = 22;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~138.23
const HOLD_DURATION = 2000; // 2 seconds required hold

function MobileHoldButton({ side, project, onTrigger }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const cancelHold = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setIsHolding(false);
    setProgress(0);
  }, []);

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    setIsHolding(true);
    startRef.current = performance.now();

    const loop = (now) => {
      if (!startRef.current) return;
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / HOLD_DURATION);
      setProgress(p);

      if (p >= 1) {
        if (navigator.vibrate) {
          try {
            navigator.vibrate([40, 60, 40]);
          } catch {
            // ignore
          }
        }
        cancelHold();
        onTrigger(project, side);
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  const handleTouchMove = (e) => {
    if (!isHolding || !e.touches[0]) return;
    const touch = e.touches[0];
    const dist = Math.hypot(
      touch.clientX - touchStartPos.current.x,
      touch.clientY - touchStartPos.current.y
    );
    // اگر انگشت بیش از ۱۲ پیکسل حرکت کرد (قصد اسکرول داشت)، سریعاً لغو کن
    if (dist > 12) {
      cancelHold();
    }
  };

  const handleTouchEnd = () => {
    cancelHold();
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!project) return null;

  const isRight = side === "right";
  const strokeOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className={`fixed ${
        isRight ? "right-2.5" : "left-2.5"
      } top-1/2 -translate-y-1/2 z-[75] md:hidden select-none touch-none`}
    >
      {/* نمایش مشخصات پروژه با حلقه شمارش معکوس هنگام نگه‌داشتن انگشت */}
      {isHolding && (
        <div
          className={`pointer-events-none absolute ${
            isRight ? "right-16" : "left-16"
          } top-1/2 -translate-y-1/2 flex items-center gap-2.5 rounded-xl border border-[#67E8F9]/40 bg-[#050508]/95 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(103,232,249,0.25)] backdrop-blur-xl animate-fade-in`}
        >
          <div className="flex flex-col text-left">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#67E8F9]">
              {isRight ? "Hold 2s for Next" : "Hold 2s for Prev"}
            </span>
            <span className="truncate max-w-[130px] text-xs font-semibold text-white">
              {project.title}
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-[#67E8F9]">
            {Math.ceil(2 - progress * 2)}s
          </span>
        </div>
      )}

      {/* دکمه با حلقه نئونی متحرک ۲ ثانیه‌ای */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-all ${
          isHolding ? "scale-105" : "opacity-75"
        }`}
        role="button"
        tabIndex={0}
        aria-label={`${isRight ? "Next" : "Previous"} Project (Hold 2 seconds)`}
      >
        {/* رینگ SVG با انیمیشن پر شدن در ۲ ثانیه */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 56 56"
        >
          <circle
            cx="28"
            cy="28"
            r={CIRCLE_RADIUS}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="3"
          />
          <circle
            cx="28"
            cy="28"
            r={CIRCLE_RADIUS}
            fill="transparent"
            stroke="#67E8F9"
            strokeWidth="3.5"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            style={{
              transition: isHolding ? "none" : "stroke-dashoffset 0.2s ease-out",
            }}
          />
        </svg>

        {/* نماد و برچسب داخل دکمه */}
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#050508]/90 text-sm font-bold backdrop-blur-md transition-colors ${
            isHolding
              ? "border-[#67E8F9] text-[#67E8F9] shadow-[0_0_20px_rgba(103,232,249,0.5)]"
              : "text-white/80"
          }`}
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-base">{isRight ? "›" : "‹"}</span>
            <span className="font-mono text-[8px] uppercase tracking-tighter text-white/50">
              {isRight ? "Next" : "Prev"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectPortalNav({
  nextProject,
  prevProject,
  onNavigate,
}) {
  const [activeSide, setActiveSide] = useState(null); // 'left' | 'right' | null

  const followerRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, active: false, side: null });
  const rafRef = useRef(null);

  // ناوبری به پروژه مقصد
  const triggerNavigation = useCallback(
    (targetProject, side) => {
      if (!targetProject) return;
      if (onNavigate) {
        onNavigate(targetProject, {
          x: mouseRef.current.x || (side === "right" ? window.innerWidth - 80 : 80),
          y: mouseRef.current.y || window.innerHeight / 2,
          side,
        });
      }
    },
    [onNavigate]
  );

  // پشتیبانی از کلیدهای کیبورد (ArrowRight برای بعدی، ArrowLeft برای قبلی)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (e.key === "ArrowRight" && nextProject) {
        triggerNavigation(nextProject, "right");
      } else if (e.key === "ArrowLeft" && prevProject) {
        triggerNavigation(prevProject, "left");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextProject, prevProject, triggerNavigation]);

  // رویدادهای ماوس دسکتاپ
  const handleRightMove = (e) => {
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

  const handleLeftMove = (e) => {
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

  // تعقیب ماوس در دسکتاپ
  useEffect(() => {
    const tick = () => {
      const follower = followerRef.current;
      if (follower && mouseRef.current.active) {
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
  }, []);

  const activeProject = activeSide === "right" ? nextProject : prevProject;
  const isRight = activeSide === "right";

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* ─── نسخه موبایل: دکمه‌های نگه‌داشتن ۲ ثانیه‌ای برای جلوگیری از لمس تصادفی ─── */}
      <MobileHoldButton
        side="left"
        project={prevProject}
        onTrigger={triggerNavigation}
      />
      <MobileHoldButton
        side="right"
        project={nextProject}
        onTrigger={triggerNavigation}
      />

      {/* ─── نسخه دسکتاپ: نوارهای حساس به ماوس با پیش‌نمایش شناور ─── */}
      {prevProject && (
        <div
          onPointerEnter={handleLeftMove}
          onPointerMove={handleLeftMove}
          onPointerLeave={handleLeave}
          onClick={() => triggerNavigation(prevProject, "left")}
          className={`hidden md:block fixed left-0 top-0 bottom-0 z-[70] w-36 cursor-pointer select-none transition-colors duration-300 ${
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

      {nextProject && (
        <div
          onPointerEnter={handleRightMove}
          onPointerMove={handleRightMove}
          onPointerLeave={handleLeave}
          onClick={() => triggerNavigation(nextProject, "right")}
          className={`hidden md:block fixed right-0 top-0 bottom-0 z-[70] w-36 cursor-pointer select-none transition-colors duration-300 ${
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

      {/* کارت شناور پیش‌نمایش ماوس (مخصوص دسکتاپ) */}
      {activeProject && (
        <div
          ref={followerRef}
          className={`pointer-events-none fixed left-0 top-0 z-[80] will-change-transform transition-opacity duration-200 hidden md:block ${
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
    </>,
    document.body,
  );
}
