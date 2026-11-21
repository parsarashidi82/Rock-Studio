import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import teamImg from "@/assets/team.webp";
import nimaImg from "@/assets/nima.webp";
import parsaImg from "@/assets/parsa.webp";
import samanImg from "@/assets/saman.webp";

// اطلاعات سه هم‌بنیان‌گذار با موقعیت دقیق روی عکس اصلی
const FOUNDERS = [
  {
    id: "nima",
    name: "Nima",
    role: "Director & Creative Lead",
    tagline: "The Vision & Cinematic Soul",
    image: nimaImg,
    quote:
      "Every project starts as an emotion. My obsession is uncovering that emotion, crafting its narrative heartbeat, and directing every visual nuance so audiences don't just watch — they feel it.",
    skills: ["Film Directing", "Visual Storytelling", "Cinematography", "Creative Direction"],
    // موقعیت دقیق نیما (سمت راست عکس در کلاه بافتنی)
    box: {
      left: "60%",
      top: "2%",
      width: "39%",
      height: "94%",
    },
    range: [0.14, 0.20, 0.36, 0.41],
  },
  {
    id: "parsa",
    name: "Parsa",
    role: "Developer & Code Architect",
    tagline: "The Logic & Digital Engine",
    image: parsaImg,
    quote:
      "Code is the canvas where design impossibilities become fluid, living interactions. Clean engineering, reactive physics, and ultra-smooth performance turn digital spaces into unforgettable experiences.",
    skills: ["Creative Engineering", "Full-Stack Dev", "UI Physics & Motion", "Performance Architecture"],
    // موقعیت دقیق پارسا در وسط
    box: {
      left: "37%",
      top: "16%",
      width: "26%",
      height: "78%",
    },
    range: [0.44, 0.50, 0.66, 0.71],
  },
  {
    id: "saman",
    name: "Saman",
    role: "Editor & Motion Artist",
    tagline: "The Rhythm & Kinetic Flow",
    image: samanImg,
    quote:
      "Motion without rhythm is just visual noise. In the edit suite, I shape the tempo, sculpt the soundscapes, and calibrate every cut to release pure kinetic energy.",
    skills: ["Video Editing", "Motion Graphics", "Sound Architecture", "Pacing & Tempo"],
    // موقعیت دقیق سامان (سمت چپ عکس با کلاه لبه‌دار)
    box: {
      left: "1%",
      top: "4%",
      width: "38%",
      height: "92%",
    },
    range: [0.74, 0.80, 0.91, 0.96],
  },
];

// کادر فوکوس و هایلایت نوری روی شخص فعال در عکس
function FounderSpotlight({ founder, progress }) {
  const [inStart, inEnd, outStart, outEnd] = founder.range;

  const opacity = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [0.98, 1.04, 1.04, 0.98]
  );

  return (
    <motion.div
      style={{
        left: founder.box.left,
        top: founder.box.top,
        width: founder.box.width,
        height: founder.box.height,
        opacity,
        scale,
      }}
      className="pointer-events-none absolute z-20 overflow-hidden rounded-2xl will-change-transform"
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-[#67E8F9] bg-[#080812] shadow-[0_0_35px_rgba(103,232,249,0.55),0_15px_40px_rgba(0,0,0,0.95)]">
        {/* عکس پرتره فوکوس شده و کاملاً شفاف و روشن شخص */}
        <img
          src={founder.image}
          alt={founder.name}
          className="h-full w-full object-cover select-none"
        />

        {/* برچسب نام و نقش شخص زیر کادر فوکوس */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050508] via-[#050508]/85 to-transparent p-3 pt-6 text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#67E8F9]">
            {founder.name}
          </span>
          <p className="font-mono text-[9px] uppercase tracking-wider text-white/70">
            {founder.role.split("&")[0].trim()}
          </p>
        </div>

        {/* نشانگر گوشه‌های فنی HUD */}
        <div className="absolute left-2 top-2 h-2.5 w-2.5 border-l-2 border-t-2 border-[#67E8F9]" />
        <div className="absolute right-2 top-2 h-2.5 w-2.5 border-r-2 border-t-2 border-[#67E8F9]" />
        <div className="absolute bottom-2 left-2 h-2.5 w-2.5 border-b-2 border-l-2 border-[#67E8F9]" />
        <div className="absolute bottom-2 right-2 h-2.5 w-2.5 border-b-2 border-r-2 border-[#67E8F9]" />
      </div>
    </motion.div>
  );
}

// کارت داستان شخص فعال
function FounderStoryCard({ founder, progress }) {
  const [inStart, inEnd, outStart, outEnd] = founder.range;

  const opacity = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [30, 0, 0, -30]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-0 flex flex-col justify-center"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#67E8F9]/30 bg-[#050508]/90 p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(103,232,249,0.15)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#67E8F9]/80 before:to-transparent">
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

  // تیره شدن عکس اصلی ۳ نفره حین فوکوس روی هر شخص تا ۲ نفر دیگر تاریک و تیره شوند
  const basePhotoDim = useTransform(
    progress,
    [
      0, 0.11, 0.14,
      0.36, 0.41, 0.44,
      0.66, 0.71, 0.74,
      0.91, 0.96, 1.0,
    ],
    [
      1, 1, 0.22,
      0.22, 0.4, 0.22,
      0.22, 0.4, 0.22,
      0.22, 1, 1,
    ]
  );

  // لایه تاریک‌کننده روی عکس برای ایجاد حس تاریکی روی سایر افراد
  const darkOverlayOpacity = useTransform(
    progress,
    [
      0, 0.11, 0.14,
      0.36, 0.41, 0.44,
      0.66, 0.71, 0.74,
      0.91, 0.96, 1.0,
    ],
    [
      0, 0, 0.78,
      0.78, 0.55, 0.78,
      0.78, 0.55, 0.78,
      0.78, 0, 0,
    ]
  );

  // پیام مقدمه (در آغاز اسکرول)
  const introOpacity = useTransform(progress, [0, 0.08, 0.13], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.13], [0, -25]);

  // هاله نور پس‌زمینه (دایره آبی/سایان): از اول نیست و با کمی اسکرول نرم وارد می‌شود
  const bgGlowOpacity = useTransform(
    progress,
    [0.04, 0.18, 0.94, 0.99],
    [0, 1, 1, 0]
  );
  const bgGlowScale = useTransform(progress, [0.04, 0.22], [0.85, 1]);

  // پیام پایانی اتحاد تیم (در انتهای اسکرول)
  const finaleOpacity = useTransform(
    progress,
    [0.93, 0.96, 0.985, 0.998],
    [0, 1, 1, 0]
  );
  const finaleY = useTransform(
    progress,
    [0.93, 0.96, 0.985, 0.998],
    [20, 0, 0, -10]
  );

  // حل شدن نرم و سینمایی کل سکشن برای پیوستگی بدون مرز با Selected Work
  const exitOpacity = useTransform(progress, [0.965, 0.998], [1, 0]);
  const exitScale = useTransform(progress, [0.965, 0.998], [1, 0.96]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-20 h-[440vh] bg-transparent"
    >
      <motion.div
        style={{ opacity: exitOpacity, scale: exitScale }}
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4 md:px-8"
      >
        {/* هاله نور پس‌زمینه (دایره سایان که با اسکرول نرم پدیدار می‌شود) */}
        <motion.div
          style={{ opacity: bgGlowOpacity, scale: bgGlowScale }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,232,249,0.10),transparent_60%)] will-change-transform"
        />

        {/* ساختار گرید دو ستونه: سمت چپ عکس ۳ نفره با فوکوس پویا، سمت راست کارت داستان */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-12">
          {/* ستون عکس ۳ نفره با کادر فوکوس اختصاصی */}
          <div className="relative w-full lg:w-[56%] shrink-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/15 bg-[#050508]/80 p-1.5 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
              <div className="relative h-full w-full overflow-hidden rounded-xl md:rounded-2xl bg-[#080812]">
                {/* عکس اصلی ۳ نفره در ماشین */}
                <motion.img
                  src={teamImg}
                  alt="Rok Studio - Nima, Parsa, Saman"
                  style={{ opacity: basePhotoDim }}
                  className="h-full w-full object-cover transition-opacity duration-300 select-none"
                />

                {/* لایه تیره که روی افراد کناری می‌افتد و آنها را تیره می‌کند */}
                <motion.div
                  style={{ opacity: darkOverlayOpacity }}
                  className="pointer-events-none absolute inset-0 bg-[#050508]/80 backdrop-blur-[1.5px] transition-opacity duration-300"
                />

                {/* گوشه‌های HUD عکس اصلی */}
                <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[#67E8F9]/60" />
                <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-[#67E8F9]/60" />
                <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#67E8F9]/60" />
                <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#67E8F9]/60" />

                {/* کادرهای فوکوس نوری روی هر یک از ۳ نفر (فقط شخص فعال روشن است، بقیه زیر لایه تیره هستند) */}
                {FOUNDERS.map((founder) => (
                  <FounderSpotlight
                    key={founder.id}
                    founder={founder}
                    progress={progress}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ستون متنی و کارت داستان در سمت راست */}
          <div className="relative min-h-[300px] sm:min-h-[320px] md:min-h-[360px] w-full flex-1">
            {/* وضعیت اولیه: معرفی تیم */}
            <motion.div
              style={{ opacity: introOpacity, y: introY }}
              className="pointer-events-none absolute inset-0 flex flex-col justify-center text-left select-none"
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#67E8F9]">
                OUR STORY
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-5xl">
                Three Minds. One Vision.
              </h2>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-white/50">
                Scroll to explore each founder&apos;s story
              </p>
            </motion.div>

            {/* کارت‌های داستانی مستقل هر فرد که به تناسب اسکرول پدیدار می‌شوند */}
            {FOUNDERS.map((founder) => (
              <FounderStoryCard
                key={founder.id}
                founder={founder}
                progress={progress}
              />
            ))}

            {/* وضعیت پایانی: بیانیه اتحاد ۳ نفره */}
            <motion.div
              style={{ opacity: finaleOpacity, y: finaleY }}
              className="pointer-events-none absolute inset-0 flex flex-col justify-center text-left select-none"
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#67E8F9]/40 bg-[#050508]/95 p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(103,232,249,0.2)]">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#67E8F9]">
                  THE COMPLETE CREATIVE ECOSYSTEM
                </span>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Director + Developer + Editor
                </h3>
                <p className="mt-3 text-xs md:text-sm leading-relaxed text-white/80">
                  A Director to sculpt the story. A Developer to engineer the world. An Editor to calibrate the rhythm. Together, we build immersive digital experiences that refuse to be ignored.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
