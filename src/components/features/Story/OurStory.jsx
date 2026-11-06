import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import teamImg from "@/assets/team.jpg";

// اطلاعات سه هم‌بنیان‌گذار استودیو
const FOUNDERS = [
  {
    id: "nima",
    step: "01",
    name: "Nima",
    persianName: "نیما",
    role: "Director & Creative Lead",
    persianRole: "کارگردان و مدیر خلاقیت",
    tagline: "The Vision & Cinematic Soul",
    quote:
      "هر اثر قبل از هر چیز یک احساس است. وظیفه من کشف آن حس، خلق روایتی زنده و کارگردانی تمام جزئیات بصری است تا مخاطب فقط پروژه را نبیند، بلکه آن را زندگی کند.",
    skills: ["Directing", "Visual Storytelling", "Cinematography", "Creative Vision"],
    // موقعیت در تصویر مرجع ۱۰۲۴ در ۵۷۶
    bounds: {
      left: "2%",
      top: "8%",
      width: "40%",
      height: "88%",
    },
    // مختصات قرارگیری عکس پس‌زمینه درون برش (Crop alignment)
    imgOffset: {
      left: "-5%",
      top: "-9%",
      width: "250%",
    },
    // بازه زمانی اسکرول (شروع جدایی، ثبات، شروع بازگشت، پایان بازگشت)
    range: [0.15, 0.23, 0.35, 0.42],
    // جهت خروج به گوشه صفحه
    target: { x: "-24vw", y: "-4vh", scale: 1.18 },
    mobileTarget: { x: "0vw", y: "-18vh", scale: 0.95 },
  },
  {
    id: "parsa",
    step: "02",
    name: "Parsa",
    persianName: "پارسا",
    role: "Developer & Code Architect",
    persianRole: "برنامه‌نویس و معمار کد",
    tagline: "The Logic & Digital Engine",
    quote:
      "کد همان بومی است که در آن غیرممکن‌های طراحی به تعاملات زنده، روان و بی‌نقص تبدیل می‌شوند. مهندسی تمیز و فیزیک واکنشی، قلب تپنده تجربه‌های دیجیتال ماست.",
    skills: ["Creative Engineering", "Full-Stack Dev", "UI Physics & Motion", "WebGL & Performance"],
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
    mobileTarget: { x: "0vw", y: "-18vh", scale: 0.95 },
  },
  {
    id: "saman",
    step: "03",
    name: "Saman",
    persianName: "سامان",
    role: "Editor & Motion Artist",
    persianRole: "ادیتور و تدوین‌گر خلاق",
    tagline: "The Rhythm & Kinetic Flow",
    quote:
      "تصویر بدون ریتم، فقط یک برش ساده است. در میز تدوین، ضرب‌آهنگ، صداگذاری دقیق و تایمینگ بی‌رحمانه فریم‌ها را کنار هم می‌نشانم تا انرژی محض در ذهن مخاطب منفجر شود.",
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
    mobileTarget: { x: "0vw", y: "-18vh", scale: 0.95 },
  },
];

// کارت اطلاعات و داستان هر شخص
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
        {/* نشانگر ردیف و تگ سایبری */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#67E8F9] shadow-[0_0_10px_#67E8F9]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#67E8F9]">
              {founder.step} // {founder.role.split("&")[0].trim()}
            </span>
          </div>
          <span className="font-mono text-[11px] text-white/40">ROK TRIO</span>
        </div>

        {/* نام و عنوان */}
        <div className="mt-4">
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {founder.name}
            </h3>
            <span className="text-lg font-semibold text-[#67E8F9]/80">
              ({founder.persianName})
            </span>
          </div>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-white/70">
            {founder.role} · <span className="text-[#67E8F9]">{founder.persianRole}</span>
          </p>
        </div>

        {/* متن داستان و فلسفه کار */}
        <blockquote className="mt-5 border-l-2 border-[#67E8F9]/50 pl-4 text-xs sm:text-sm leading-relaxed text-white/80" dir="rtl">
          &ldquo;{founder.quote}&rdquo;
        </blockquote>

        {/* برچسب‌های مهارت‌ها */}
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

// لایه جداشونده پرتره هر شخص
function DetachablePortrait({ founder, progress }) {
  const [inStart, inEnd, outStart, outEnd] = founder.range;

  // محاسبه حرکت به سمت گوشه با پیشرفت اسکرول
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
      className="absolute overflow-hidden rounded-xl cursor-pointer will-change-transform"
    >
      {/* فریم پرتره با استایل نوری */}
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
        {/* تصویر دقیق همپوشان که همگام با عکس زیرین است */}
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

        {/* لایه برچسب نام در حالت شناور */}
        <motion.div
          style={{ opacity: shadowOpacity }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050508] via-[#050508]/70 to-transparent p-3 pt-6 text-center"
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#67E8F9]">
            {founder.step} // {founder.name}
          </span>
          <p className="font-mono text-[9px] uppercase tracking-wider text-white/70">
            {founder.persianRole}
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

  // افکت‌های محو شدن تصویر اصلی حین نمایش تکی هر فرد
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

  // تیتر مقدمه (در آغاز اسکرول)
  const introOpacity = useTransform(progress, [0, 0.08, 0.14], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.14], [0, -25]);

  // پیام پایانی اتحاد تیم (در انتهای اسکرول)
  const conclusionOpacity = useTransform(progress, [0.93, 0.97, 1], [0, 1, 1]);
  const conclusionScale = useTransform(progress, [0.93, 0.98], [0.94, 1]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-20 h-[460vh] bg-transparent"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4 md:px-8">
        {/* هاله نور پس‌زمینه */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,232,249,0.08),transparent_60%)]" />

        {/* تیتر بالای بخش: معرفی داستان استودیو */}
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
            Scroll to reveal each founder&apos;s story
          </p>
        </motion.div>

        {/* فریم اصلی عکس تیم با نسبت ابعاد ۱۶ به ۹ */}
        <div className="relative w-full max-w-4xl aspect-[16/9] rounded-2xl md:rounded-3xl p-1.5 md:p-2.5 border border-white/15 bg-[#050508]/80 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
          {/* محفظه داخلی تصویر */}
          <div className="relative h-full w-full overflow-hidden rounded-xl md:rounded-2xl bg-[#080812]">
            {/* تصویر زمینه گروهی */}
            <motion.img
              src={teamImg}
              alt="Rok Studio Founders - Nima, Parsa, Saman"
              style={{
                opacity: basePhotoDim,
                filter: basePhotoBlur,
              }}
              className="h-full w-full object-cover transition-all duration-300 select-none"
            />

            {/* گرید سایبری روی تصویر */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,8,0.7)_100%)]" />

            {/* نشانگر گوشه‌های فنی HUD */}
            <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[#67E8F9]/60" />
            <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-[#67E8F9]/60" />
            <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#67E8F9]/60" />
            <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#67E8F9]/60" />

            {/* سه لایه پرتره جداشونده برای هر شخص */}
            {FOUNDERS.map((founder) => (
              <DetachablePortrait
                key={founder.id}
                founder={founder}
                progress={progress}
              />
            ))}
          </div>
        </div>

        {/* کارت‌های داستانی هر شخص که به تناسب اسکرول ظاهر می‌شوند */}
        {FOUNDERS.map((founder) => (
          <StoryBioCard
            key={founder.id}
            founder={founder}
            progress={progress}
          />
        ))}

        {/* بیانیه پایانی اتحاد ۳ نفره در انتهای اسکرول */}
        <motion.div
          style={{ opacity: conclusionOpacity, scale: conclusionScale }}
          className="pointer-events-none absolute bottom-8 md:bottom-12 max-w-2xl px-6 text-center select-none"
        >
          <div className="rounded-2xl border border-[#67E8F9]/30 bg-[#050508]/90 p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(103,232,249,0.2)]">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#67E8F9]">
              THE COMPLETE ECOSYSTEM
            </span>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-white md:text-3xl">
              Director + Developer + Editor
            </h3>
            <p className="mt-3 text-xs md:text-sm leading-relaxed text-white/80" dir="rtl">
              یک کارگردان برای خلق روح و تصویر داستان، یک برنامه‌نویس برای مهندسی و جان‌بخشی به جهان دیجیتال، و یک ادیتور برای خلق ریتم و هیجان فریم‌ها. این ترکیب، راک استودیو است.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
