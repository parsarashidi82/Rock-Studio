import { motion, useTransform, cubicBezier } from "framer-motion";

const easeOut = cubicBezier(0.22, 1, 0.36, 1);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

export default function ScatterLetter({
  glyph,
  seed,
  layout,
  progress,
  time,
  fontWeight,
}) {
  // k: از 1 (پراکنده) تا 0 (جای نهایی)
  const k = (p) => 1 - easeOut(clamp01(p / seed.end));
  const t = (ms) => (ms / 1000) * seed.floatSpeed + seed.floatPhase;

  const x = useTransform([progress, time], ([p, ms]) => {
    const kk = k(p);
    return seed.x * layout.width * kk + Math.sin(t(ms)) * 14 * kk;
  });
  const y = useTransform([progress, time], ([p, ms]) => {
    const kk = k(p);
    return seed.y * layout.height * kk + Math.cos(t(ms) * 0.9) * 14 * kk;
  });
  const rotate = useTransform([progress, time], ([p, ms]) => {
    const kk = k(p);
    return seed.rotate * kk + Math.sin(t(ms) * 0.7) * 6 * kk;
  });
  const scale = useTransform(progress, (p) => 1 + (seed.scale - 1) * k(p));

  return (
    <motion.span
      aria-hidden
      className="absolute whitespace-pre text-white will-change-transform"
      style={{
        left: glyph.x,
        top: layout.top,
        fontSize: layout.size,
        fontWeight,
        lineHeight: 1,
        letterSpacing: 0,
        x,
        y,
        rotate,
        scale,
      }}
    >
      {glyph.char}
    </motion.span>
  );
}