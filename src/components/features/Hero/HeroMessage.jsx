import { motion, useTransform } from "framer-motion";

// range = [شروع ورود، پایان ورود، شروع خروج، پایان خروج]
// روی پیشرفت کل اسکرول Hero (۰ تا ۱)
const MESSAGES = [
  {
    step: "01",
    total: "05",
    prefix: "It all starts with an ",
    highlight: "idea",
    range: [0.06, 0.09, 0.17, 0.2],
  },
  {
    step: "02",
    total: "05",
    prefix: "Even we were once just an ",
    highlight: "idea",
    range: [0.21, 0.24, 0.32, 0.35],
  },
  {
    step: "03",
    total: "05",
    prefix: "Three minds, ",
    highlight: "one vision",
    range: [0.36, 0.39, 0.47, 0.5],
  },
  {
    step: "04",
    total: "05",
    prefix: "This is ",
    highlight: "Rok Studio",
    range: [0.52, 0.55, 0.66, 0.7],
  },
  {
    step: "05",
    total: "05",
    prefix: "Our story starts here. ",
    highlight: "Yours could too.",
    range: [0.72, 0.75, 0.88, 0.92],
  },
];

function Message({ step, total, prefix, highlight, range, progress }) {
  const [a, b, c, d] = range;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [14, 0, 0, -14]);
  const scale = useTransform(progress, [a, b, c, d], [0.94, 1, 1, 0.96]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center select-none"
    >
      <div className="relative flex items-center gap-2.5 sm:gap-3.5 rounded-full border border-[#67E8F9]/30 bg-[#050508]/85 px-4 py-2 sm:px-5 sm:py-2.5 backdrop-blur-xl shadow-[0_0_35px_rgba(103,232,249,0.22),0_12px_40px_rgba(0,0,0,0.85)] before:absolute before:inset-x-6 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#67E8F9]/70 before:to-transparent">
        {/* نشانگر راداری زنده */}
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#67E8F9] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#67E8F9] shadow-[0_0_8px_#67E8F9]" />
        </span>

        {/* شماره فصل / استپ استوری */}
        <span className="font-mono text-[11px] font-semibold tracking-widest text-[#67E8F9]">
          {step} <span className="text-white/30">/</span> {total}
        </span>

        <span className="h-3.5 w-px bg-white/20" />

        {/* متن استوری با کنتراست بالا و هایلایت درخشان */}
        <p className="whitespace-nowrap font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-white/90">
          <span>{prefix}</span>
          <span className="font-bold text-[#67E8F9] drop-shadow-[0_0_12px_rgba(103,232,249,0.65)]">
            {highlight}
          </span>
        </p>
      </div>
    </motion.div>
  );
}

export default function HeroMessage({ progress }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {MESSAGES.map((m) => (
        <Message key={m.step} {...m} progress={progress} />
      ))}
    </div>
  );
}
