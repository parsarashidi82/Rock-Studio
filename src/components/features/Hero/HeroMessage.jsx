import { motion, useTransform } from "framer-motion";

// range = [شروع ورود، پایان ورود، شروع خروج، پایان خروج]
// روی پیشرفت کل اسکرول Hero (۰ تا ۱)
const MESSAGES = [
  { text: "It all starts with an idea", range: [0.06, 0.09, 0.17, 0.2] },
  { text: "Even we were once just an idea", range: [0.21, 0.24, 0.32, 0.35] },
  { text: "Three minds, one vision", range: [0.36, 0.39, 0.47, 0.5] },
  { text: "This is Rok Studio", range: [0.52, 0.55, 0.66, 0.7] },
  {
    text: "Our story starts here. Yours could too.",
    range: [0.72, 0.75, 0.88, 0.92],
  },
];

function Message({ text, range, progress }) {
  const [a, b, c, d] = range;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [8, 0, 0, -8]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center whitespace-nowrap font-mono text-[16px] uppercase tracking-[0.3em] text-white/40"
    >
      {text}
    </motion.div>
  );
}

export default function HeroMessage({ progress }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {MESSAGES.map((m) => (
        <Message key={m.text} {...m} progress={progress} />
      ))}
    </div>
  );
}
