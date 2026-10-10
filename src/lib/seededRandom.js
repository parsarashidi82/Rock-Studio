// PRNG کوچک و قطعی: با seed ثابت همیشه همان اعداد را می‌دهد
export function mulberry32(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// برای هر حرف یک «سرنوشت» ثابت می‌سازد
export function createLetterSeeds(count, seed = 7) {
  const rand = mulberry32(seed);
  const sign = () => (rand() < 0.5 ? -1 : 1);

  return Array.from({ length: count }, () => ({
    // فاصله‌ی شروع، به‌صورت کسری از عرض/ارتفاع استیج
    x: sign() * (0.12 + rand() * 0.33),
    y: sign() * (0.12 + rand() * 0.3),
    rotate: sign() * (70 + rand() * 200),
    scale: 0.55 + rand() * 1.1,
    // هر حرف در یک نقطه‌ی متفاوت از اسکرول به مقصد می‌رسد
    end: 0.45 + rand() * 0.3,
    // شناوری آرام
    floatSpeed: 0.5 + rand() * 0.7,
    floatPhase: rand() * Math.PI * 2,
  }));
}