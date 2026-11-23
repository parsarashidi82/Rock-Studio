import { useEffect, useRef, useState } from "react";

// تبدیل ثانیه‌ها به فرمت دقیقه و ثانیه (mm:ss)
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

/**
 * کامپوننت نمایش مدیا و پلیر اختصاصی ویدیو در صفحه پروژه (Project Media Showcase).
 * شامل پخش روان ویدیوی ۴K با کنترل‌های اختصاصی (Play/Pause, Seekable Progress Bar, Mute, Fullscreen)،
 * یا نمایش موکاپ اسکرول‌پذیر مرورگر و تصاویر باکیفیت.
 * 
 * @param {Object} props
 * @param {import("@/data/projects").Project} props.project - اطلاعات پروژه و فایل مدیا
 */
export default function ProjectMedia({ project }) {
  const videoRef = useRef(null);
  const progressContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

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
      container
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
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

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-14">
      {project.video ? (
        <div
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)]"
          onMouseMove={handleMouseMovePlayer}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
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

          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play video"
              className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#67E8F9] hover:bg-[#67E8F9] hover:text-[#050508]"
            >
              <svg className="ml-1 h-8 w-8 fill-current" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          )}

          <div
            className={`absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 md:p-6 ${
              showControls || !isPlaying
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
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
    </div>
  );
}
