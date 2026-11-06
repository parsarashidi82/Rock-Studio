import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import teamImg from "@/assets/team.jpg";
import nimaImg from "@/assets/nima.jpg";
import parsaImg from "@/assets/parsa.jpg";
import samanImg from "@/assets/saman.jpg";

const FOUNDERS = [
  {
    id: "nima",
    name: "Nima",
    role: "Director & Creative Lead",
    tagline: "The Vision & Cinematic Soul",
    image: nimaImg,
    align: "left", // Portrait on the left, bio on the right
    quote:
      "Every project starts as an emotion. My obsession is uncovering that emotion, crafting its narrative heartbeat, and directing every visual nuance so audiences don't just watch — they feel it.",
    skills: ["Film Directing", "Visual Storytelling", "Cinematography", "Creative Direction"],
    range: [0.15, 0.21, 0.38, 0.43],
  },
  {
    id: "parsa",
    name: "Parsa",
    role: "Developer & Code Architect",
    tagline: "The Logic & Digital Engine",
    image: parsaImg,
    align: "left", // Portrait on the left, bio on the right
    quote:
      "Code is the canvas where design impossibilities become fluid, living interactions. Clean engineering, reactive physics, and ultra-smooth performance turn digital spaces into unforgettable experiences.",
    skills: ["Creative Engineering", "Full-Stack Dev", "UI Physics & Motion", "Performance Architecture"],
    range: [0.42, 0.48, 0.65, 0.70],
  },
  {
    id: "saman",
    name: "Saman",
    role: "Editor & Motion Artist",
    tagline: "The Rhythm & Kinetic Flow",
    image: samanImg,
    align: "right", // Portrait on the right, bio on the left
    quote:
      "Motion without rhythm is just visual noise. In the edit suite, I shape the tempo, sculpt the soundscapes, and calibrate every cut to release pure kinetic energy.",
    skills: ["Video Editing", "Motion Graphics", "Sound Architecture", "Pacing & Tempo"],
    range: [0.69, 0.75, 0.90, 0.95],
  },
];

// کامپوننت نمایش تکی هر فرد (فقط خود فرد با داستانش؛ بقیه کاملاً هاید هستند)
function FounderStage({ founder, progress }) {
  const [inStart, inEnd, outStart, outEnd] = founder.range;

  const opacity = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [40, 0, 0, -40]
  );
  const scale = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [0.94, 1, 1, 0.95]
  );

  const isRightAlign = founder.align === "right";

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 md:px-8 z-20"
    >
      <div
        className={`pointer-events-auto flex w-full max-w-5xl flex-col items-center gap-8 md:gap-14 ${
          isRightAlign ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        {/* پرتره اختصاصی و تمیز شخص با هاله نئونی */}
        <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] shrink-0">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[#67E8F9]/40 bg-[#080812] p-1.5 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(103,232,249,0.25)]">
            <img
              src={founder.image}
              alt={founder.name}
              className="h-full w-full rounded-xl md:rounded-2xl object-cover select-none"
            />
            {/* برچسب نام روی پرتره */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent p-4 pt-8 text-center">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#67E8F9]">
                {founder.name}
              </span>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/70">
                {founder.role}
              </p>
            </div>
            {/* گوشه‌های HUD */}
            <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[#67E8F9]" />
            <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-[#67E8F9]" />
            <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#67E8F9]" />
            <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#67E8F9]" />
          </div>
        </div>

        {/* کارت بیوگرافی و داستان فرد */}
        <div className="relative w-full flex-1 overflow-hidden rounded-2xl border border-[#67E8F9]/30 bg-[#050508]/90 p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(103,232,249,0.15)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#67E8F9]/80 before:to-transparent">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#67E8F9] shadow-[0_0_10px_#67E8F9]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#67E8F9]">
                {founder.role.split("&")[0].trim()}
              </span>
            </div>
            <span className="font-mono text-[11px] text-white/40">ROK STUDIO</span>
          </div>

          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              {founder.name}
            </h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[#67E8F9]">
              {founder.role}
            </p>
          </div>

          <blockquote className="mt-5 border-l-2 border-[#67E8F9]/50 pl-4 text-xs sm:text-sm leading-relaxed text-white/80 italic">
            &ldquo;{founder.quote}&rdquo;
          </blockquote>

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
      </div>
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

  // مرحله ۰: معرفی اولیه عکس گروهی
  const introOpacity = useTransform(progress, [0, 0.08, 0.14], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.14], [0, -30]);

  // تصویر تیمی اولیه فقط در ابتدا ظاهر می‌شود و حین روایت افراد محو می‌شود
  const teamPhotoOpacity = useTransform(
    progress,
    [0, 0.08, 0.13],
    [1, 1, 0]
  );
  const teamPhotoScale = useTransform(
    progress,
    [0, 0.13],
    [1, 0.95]
  );

  // مرحله پایانی: اتحاد دوباره کل تیم در انتهای اسکرول
  const finaleOpacity = useTransform(progress, [0.93, 0.97, 1], [0, 1, 1]);
  const finaleY = useTransform(progress, [0.93, 0.98], [40, 0]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-20 h-[460vh] bg-transparent"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4 md:px-8">
        {/* هاله نور پس‌زمینه */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,232,249,0.08),transparent_60%)]" />

        {/* تیتر بالای بخش در آغاز اسکرول */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="pointer-events-none absolute top-14 md:top-20 text-center select-none z-10"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Three Minds. One Vision.
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-white/50">
            Scroll to explore each founder&apos;s story
          </p>
        </motion.div>

        {/* عکس تیمی اولیه در آغاز اسکرول (با ورود به داستان محو می‌شود) */}
        <motion.div
          style={{ opacity: teamPhotoOpacity, scale: teamPhotoScale }}
          className="pointer-events-none relative w-full max-w-4xl aspect-[16/9] rounded-2xl md:rounded-3xl p-1.5 md:p-2.5 border border-white/15 bg-[#050508]/80 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10"
        >
          <div className="relative h-full w-full overflow-hidden rounded-xl md:rounded-2xl bg-[#080812]">
            <img
              src={teamImg}
              alt="Rok Studio Founders"
              className="h-full w-full object-cover select-none"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,8,0.6)_100%)]" />
            <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[#67E8F9]/60" />
            <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-[#67E8F9]/60" />
            <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#67E8F9]/60" />
            <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#67E8F9]/60" />
          </div>
        </motion.div>

        {/* بخش روایت مستقل هر فرد: فقط شخص فعال با عکس اختصاصی ظاهر می‌شود؛ بقیه کاملاً هاید هستند */}
        {FOUNDERS.map((founder) => (
          <FounderStage
            key={founder.id}
            founder={founder}
            progress={progress}
          />
        ))}

        {/* مرحله نهایی اتحاد ۳ نفره در انتهای اسکرول */}
        <motion.div
          style={{ opacity: finaleOpacity, y: finaleY }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 z-30 select-none"
        >
          <div className="pointer-events-auto relative flex w-full max-w-4xl flex-col items-center gap-6 rounded-2xl md:rounded-3xl border border-[#67E8F9]/40 bg-[#050508]/95 p-6 md:p-10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(103,232,249,0.2)]">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-[#080812]">
              <img
                src={teamImg}
                alt="Rok Studio - Complete Team"
                className="h-full w-full object-cover select-none"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,8,0.5)_100%)]" />
            </div>

            <div className="text-center max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#67E8F9]">
                THE COMPLETE CREATIVE ECOSYSTEM
              </span>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-4xl">
                Director + Developer + Editor
              </h3>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-white/80">
                A Director to sculpt the story. A Developer to engineer the world. An Editor to calibrate the rhythm. Together, we build immersive digital experiences that refuse to be ignored.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
