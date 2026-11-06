import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import teamImg from "@/assets/team.jpg";

// Founders configuration
const FOUNDERS = [
  {
    id: "nima",
    step: "01",
    name: "Nima",
    role: "Director & Creative Lead",
    tagline: "The Vision & Cinematic Soul",
    quote:
      "Every project starts as an emotion. My obsession is uncovering that emotion, crafting its narrative heartbeat, and directing every visual nuance so audiences don't just watch — they feel it.",
    skills: ["Film Directing", "Visual Storytelling", "Cinematography", "Creative Direction"],
    // Position on the 1024x576 source frame
    bounds: {
      left: "2%",
      top: "8%",
      width: "40%",
      height: "88%",
    },
    imgOffset: {
      left: "-5%",
      top: "-9%",
      width: "250%",
    },
    range: [0.15, 0.23, 0.35, 0.42],
    target: { x: "-24vw", y: "-4vh", scale: 1.18 },
  },
  {
    id: "parsa",
    step: "02",
    name: "Parsa",
    role: "Developer & Code Architect",
    tagline: "The Logic & Digital Engine",
    quote:
      "Code is the canvas where design impossibilities become fluid, living interactions. Clean engineering, reactive physics, and ultra-smooth performance turn digital spaces into unforgettable experiences.",
    skills: ["Creative Engineering", "Full-Stack Dev", "UI Physics & Motion", "Performance Architecture"],
    bounds: {
      left: "38%",
      top: "20%",
      width: "26%",
      height: "76%",
    },
    imgOffset: {
      left: "-146%",
      top: "-26%",
      width: "385%",
    },
    range: [0.44, 0.51, 0.63, 0.70],
    target: { x: "-22vw", y: "-4vh", scale: 1.25 },
  },
  {
    id: "saman",
    step: "03",
    name: "Saman",
    role: "Editor & Motion Artist",
    tagline: "The Rhythm & Kinetic Flow",
    quote:
      "Motion without rhythm is just visual noise. In the edit suite, I shape the tempo, sculpt the soundscapes, and calibrate every cut to release pure kinetic energy.",
    skills: ["Video Editing", "Motion Graphics", "Sound Architecture", "Pacing & Tempo"],
    bounds: {
      left: "58%",
      top: "4%",
      width: "40%",
      height: "94%",
    },
    imgOffset: {
      left: "-145%",
      top: "-4%",
      width: "250%",
    },
    range: [0.72, 0.79, 0.90, 0.96],
    target: { x: "24vw", y: "-4vh", scale: 1.18 },
  },
];

// Story Bio Card for each founder
function StoryBioCard({ founder, progress }) {
  const [inStart, inEnd, outStart, outEnd] = founder.range;
  const opacity = useTransform(progress, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0]);
  const y = useTransform(progress, [inStart, inEnd, outStart, outEnd], [35, 0, 0, -35]);
  const scale = useTransform(progress, [inStart, inEnd, outStart, outEnd], [0.93, 1, 1, 0.95]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`pointer-events-none absolute z-30 w-full max-w-md px-4 sm:px-0 ${
        founder.id === "saman"
          ? "left-6 lg:left-14 top-1/2 -translate-y-1/2 text-left"
          : "right-6 lg:right-14 top-1/2 -translate-y-1/2 text-left"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#67E8F9]/30 bg-[#050508]/90 p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(103,232,249,0.18)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#67E8F9]/80 before:to-transparent">
        {/* HUD Indicator */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#67E8F9] shadow-[0_0_10px_#67E8F9]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#67E8F9]">
              {founder.step} // {founder.role.split("&")[0].trim()}
            </span>
          </div>
          <span className="font-mono text-[11px] text-white/40">ROK TRIO</span>
        </div>

        {/* Name and Role */}
        <div className="mt-4">
          <h3 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {founder.name}
          </h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[#67E8F9]">
            {founder.role}
          </p>
        </div>

        {/* Founder Story Quote */}
        <blockquote className="mt-5 border-l-2 border-[#67E8F9]/50 pl-4 text-xs sm:text-sm leading-relaxed text-white/80 italic">
          &ldquo;{founder.quote}&rdquo;
        </blockquote>

        {/* Skills Tag Cloud */}
        <div className="mt-6 flex flex-wrap gap-2 pt-2">
          {founder.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/70 backdrop-blur-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Detachable Portrait component
function DetachablePortrait({ founder, progress }) {
  const [inStart, inEnd, outStart, outEnd] = founder.range;

  const flyX = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    ["0vw", founder.target.x, founder.target.x, "0vw"]
  );
  const flyY = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    ["0vh", founder.target.y, founder.target.y, "0vh"]
  );
  const scale = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [1, founder.target.scale, founder.target.scale, 1]
  );
  const zIndex = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [10, 40, 40, 10]
  );
  const shadowOpacity = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [0, 1, 1, 0]
  );
  const borderWidth = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [0, 2, 2, 0]
  );

  return (
    <motion.div
      style={{
        left: founder.bounds.left,
        top: founder.bounds.top,
        width: founder.bounds.width,
        height: founder.bounds.height,
        x: flyX,
        y: flyY,
        scale,
        zIndex,
      }}
      className="absolute overflow-hidden rounded-xl will-change-transform"
    >
      <motion.div
        style={{
          boxShadow: useTransform(
            shadowOpacity,
            (v) => `0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(103,232,249,${v * 0.6})`
          ),
          borderWidth,
          borderColor: "rgba(103,232,249,0.8)",
        }}
        className="relative h-full w-full overflow-hidden rounded-xl bg-[#080812]"
      >
        <img
          src={teamImg}
          alt={founder.name}
          style={{
            position: "absolute",
            left: founder.imgOffset.left,
            top: founder.imgOffset.top,
            width: founder.imgOffset.width,
            maxWidth: "none",
          }}
          className="pointer-events-none select-none transition-all duration-300"
        />

        {/* Hover / Active Badge */}
        <motion.div
          style={{ opacity: shadowOpacity }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent p-3 pt-6 text-center"
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#67E8F9]">
            {founder.step} // {founder.name}
          </span>
          <p className="font-mono text-[9px] uppercase tracking-wider text-white/70">
            {founder.role.split("&")[0].trim()}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function OurStory() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });

  // Background photo dimming effect
  const basePhotoDim = useTransform(
    progress,
    [0.12, 0.18, 0.38, 0.44, 0.50, 0.65, 0.70, 0.76, 0.92, 0.98],
    [1, 0.25, 0.25, 1, 0.25, 0.25, 1, 0.25, 0.25, 1]
  );

  const basePhotoBlur = useTransform(
    progress,
    [0.12, 0.18, 0.38, 0.44, 0.50, 0.65, 0.70, 0.76, 0.92, 0.98],
    [
      "blur(0px)",
      "blur(6px)",
      "blur(6px)",
      "blur(0px)",
      "blur(6px)",
      "blur(6px)",
      "blur(0px)",
      "blur(6px)",
      "blur(6px)",
      "blur(0px)",
    ]
  );

  // Intro header animation
  const introOpacity = useTransform(progress, [0, 0.08, 0.14], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.14], [0, -25]);

  // Unified team conclusion at the end
  const conclusionOpacity = useTransform(progress, [0.93, 0.97, 1], [0, 1, 1]);
  const conclusionScale = useTransform(progress, [0.93, 0.98], [0.94, 1]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-20 h-[460vh] bg-transparent"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4 md:px-8">
        {/* Ambient Radial Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,232,249,0.08),transparent_60%)]" />

        {/* Section Title */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="pointer-events-none absolute top-12 md:top-16 text-center select-none"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#67E8F9] backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#67E8F9]" />
            OUR STORY · THE FOUNDING TRIO
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-5xl">
            Three Minds. One Vision.
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-white/50">
            Scroll to explore each founder&apos;s story
          </p>
        </motion.div>

        {/* Main 16:9 Team Photo Frame */}
        <div className="relative w-full max-w-4xl aspect-[16/9] rounded-2xl md:rounded-3xl p-1.5 md:p-2.5 border border-white/15 bg-[#050508]/80 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
          <div className="relative h-full w-full overflow-hidden rounded-xl md:rounded-2xl bg-[#080812]">
            {/* Background Group Photo */}
            <motion.img
              src={teamImg}
              alt="Rok Studio Founders - Nima, Parsa, Saman"
              style={{
                opacity: basePhotoDim,
                filter: basePhotoBlur,
              }}
              className="h-full w-full object-cover transition-all duration-300 select-none"
            />

            {/* Cyber vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,8,0.7)_100%)]" />

            {/* Technical HUD corner brackets */}
            <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[#67E8F9]/60" />
            <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-[#67E8F9]/60" />
            <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#67E8F9]/60" />
            <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#67E8F9]/60" />

            {/* Three Detachable Founder Portraits */}
            {FOUNDERS.map((founder) => (
              <DetachablePortrait
                key={founder.id}
                founder={founder}
                progress={progress}
              />
            ))}
          </div>
        </div>

        {/* Story Bio Cards that appear during scrolling */}
        {FOUNDERS.map((founder) => (
          <StoryBioCard
            key={founder.id}
            founder={founder}
            progress={progress}
          />
        ))}

        {/* Unified Studio Conclusion */}
        <motion.div
          style={{ opacity: conclusionOpacity, scale: conclusionScale }}
          className="pointer-events-none absolute bottom-8 md:bottom-12 max-w-2xl px-6 text-center select-none"
        >
          <div className="rounded-2xl border border-[#67E8F9]/30 bg-[#050508]/90 p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(103,232,249,0.2)]">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#67E8F9]">
              THE COMPLETE CREATIVE ECOSYSTEM
            </span>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-white md:text-3xl">
              Director + Developer + Editor
            </h3>
            <p className="mt-3 text-xs md:text-sm leading-relaxed text-white/80">
              A Director to sculpt the story. A Developer to engineer the world. An Editor to calibrate the rhythm. Together, we build immersive digital experiences that refuse to be ignored.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
