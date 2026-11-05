import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectPortalNav from "@/components/features/Work/ProjectPortalNav";

// فرمت‌بندی ثانیه به mm:ss
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  // محاسبه پروژه بعدی و قبلی برای چرخش پیوسته
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const count = projects.length;
  const nextProject =
    currentIndex !== -1
      ? projects[(currentIndex + 1) % count]
      : projects[0];
  const prevProject =
    currentIndex !== -1
      ? projects[(currentIndex - 1 + count) % count]
      : projects[count - 1];

  // استیت‌های ویدیو پلیر
  const videoRef = useRef(null);
  const progressContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // اسکرول به ابتدای صفحه هنگام باز شدن یا تغییر اسلاگ
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  // رویدادهای ویدیو
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [project?.video]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSeek = (e) => {
    const bar = progressContainerRef.current;
    const video = videoRef.current;
    if (!bar || !video || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pos * duration;
    setCurrentTime(video.currentTime);
  };

  const handleMouseMovePlayer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  if (!project) {
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

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#050508]/90 text-white selection:bg-[#67E8F9] selection:text-[#050508]">
      {/* هلو و گرادیان پس‌زمینه */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(103,232,249,0.12),transparent_70%)]" />

      {/* نوار ناوبری اختصاصی پروژه */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050508]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
          <Link
            to="/#work"
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-[#67E8F9]"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span>Back to Works</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
          >
            ROK
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#67E8F9]" />
          </Link>

          {project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-white transition-colors duration-300 hover:border-[#67E8F9] hover:bg-[#67E8F9] hover:text-[#050508]"
            >
              <span>Visit Live</span>
            </a>
          ) : (
            <Link
              to="/#contact"
              className="rounded-full border border-white/20 px-5 py-1.5 font-mono text-xs uppercase tracking-wider text-white transition-colors duration-300 hover:border-[#67E8F9] hover:bg-[#67E8F9] hover:text-[#050508]"
            >
              Let&apos;s Talk
            </Link>
          )}
        </div>
      </header>

      {/* بدنه اصلی */}
      <main className="relative mx-auto max-w-7xl px-6 pb-28 pt-12 md:px-12 md:pt-16">
        {/* عنوان و هدر پروژه */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#67E8F9]" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#67E8F9]">
              {project.category} · Case Study
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-7xl">
            {project.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/70 md:text-xl">
            {project.description}
          </p>
        </motion.div>

        {/* شبکه اطلاعات بنتو (Bento Metadata) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid grid-cols-2 gap-4 border-y border-white/10 py-8 md:grid-cols-4 md:gap-8"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Client
            </p>
            <p className="mt-2 text-base font-medium text-white md:text-lg">
              {project.client || "Studio Project"}
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Year
            </p>
            <p className="mt-2 text-base font-medium text-white md:text-lg">
              {project.year || "2024"}
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Discipline
            </p>
            <p className="mt-2 text-base font-medium text-white md:text-lg">
              {project.category}
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Output
            </p>
            {project.externalUrl ? (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-flex items-center gap-1 text-base font-medium text-[#67E8F9] hover:underline md:text-lg"
              >
                <span>See Website</span>
              </a>
            ) : project.video ? (
              <p className="mt-2 text-base font-medium text-[#67E8F9] md:text-lg">
                Full 4K Video
              </p>
            ) : (
              <p className="mt-2 text-base font-medium text-white md:text-lg">
                Visual Identity
              </p>
            )}
          </div>
        </motion.div>

        {/* مدیا پلیر اختصاصی / شوکیس اصلی */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          {project.video ? (
            <div
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)]"
              onMouseMove={handleMouseMovePlayer}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              {/* هاله نئونی ظریف در پس‌زمینه ویدیو */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,232,249,0.06),transparent_60%)]" />

              <video
                ref={videoRef}
                src={project.video}
                poster={project.image}
                playsInline
                preload="metadata"
                onClick={togglePlay}
                className="aspect-video w-full cursor-pointer object-cover"
              />

              {/* دکمه بزرگ مرکزی Play هنگام توقف */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play video"
                  className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#67E8F9] hover:bg-[#67E8F9] hover:text-[#050508]"
                >
                  <svg
                    className="ml-1 h-8 w-8 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              )}

              {/* کنترل بار مدرن شیشه‌ای */}
              <div
                className={`absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 md:p-6 ${
                  showControls || !isPlaying ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                {/* نوار پیشرفت اسکراب */}
                <div
                  ref={progressContainerRef}
                  onClick={handleSeek}
                  className="group/seek relative h-2 w-full cursor-pointer rounded-full bg-white/20 transition-all hover:h-2.5"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#67E8F9] to-cyan-400"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <div
                    className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-white bg-[#67E8F9] shadow-md transition-opacity group-hover/seek:opacity-100"
                    style={{ left: `calc(${progressPercent}% - 7px)` }}
                  />
                </div>

                {/* دکمه‌های کنترل و زمان‌سنج */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="text-white/80 transition-colors hover:text-[#67E8F9]"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className="text-white/80 transition-colors hover:text-[#67E8F9]"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? (
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                      )}
                    </button>

                    <span className="font-mono text-xs tracking-wider text-white/60">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="text-white/80 transition-colors hover:text-[#67E8F9]"
                    aria-label="Toggle fullscreen"
                  >
                    {isFullscreen ? (
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-14v3h3v2h-5V5h2z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : project.fullImage ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08080f] shadow-2xl">
              <div className="flex h-10 items-center gap-2 border-b border-white/10 bg-white/5 px-4">
                <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="mx-auto font-mono text-[11px] text-white/40">
                  {project.externalUrl || project.title}
                </span>
              </div>
              <img
                src={project.fullImage}
                alt={project.title}
                className="w-full object-cover"
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08080f] shadow-2xl">
              <img
                src={project.image}
                alt={project.title}
                className="aspect-video w-full object-cover"
              />
            </div>
          )}
        </motion.div>

        {/* خدمات، تگ‌ها و جزئیات پروژه */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 grid grid-cols-1 gap-12 border-t border-white/10 pt-16 md:grid-cols-3"
        >
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#67E8F9]">
              Services Provided
            </h2>
            <ul className="mt-4 space-y-2">
              {project.services?.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 text-base text-white/80"
                >
                  <span className="h-1 w-1 rounded-full bg-[#67E8F9]" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#67E8F9]">
              Technologies & Tags
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#67E8F9]">
              Project Inquiry
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Inspired by this work? We design and engineer world-class motion,
              web, and visual experiences tailored for ambitious brands.
            </p>
            <Link
              to="/#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#67E8F9] bg-[#67E8F9] px-5 py-2 font-mono text-xs uppercase tracking-wider text-[#050508] transition-all hover:bg-transparent hover:text-white"
            >
              Start A Project →
            </Link>
          </div>
        </motion.div>

        {/* پروژه بعدی (Next Case Study Card) */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-28 border-t border-white/10 pt-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            Next Case Study
          </p>

          <Link
            to={`/projects/${nextProject.slug}`}
            className="group mt-6 block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-500 hover:border-[#67E8F9]/50 hover:bg-white/[0.04] md:p-12"
          >
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#67E8F9]">
                  {nextProject.category}
                </span>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white transition-colors group-hover:text-[#67E8F9] md:text-5xl">
                  {nextProject.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm text-white/60 md:text-base">
                  {nextProject.description}
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-white/80 group-hover:text-[#67E8F9]">
                <span>View Project</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </div>
          </Link>
        </motion.section>
      </main>

      {/* سیستم پیش‌نمایش شناور و ناوبری پورتال گوشه‌های صفحه */}
      <ProjectPortalNav key={slug} nextProject={nextProject} prevProject={prevProject} />
    </div>
  );
}
