/**
 * الگوریتم تولید اعداد شبه‌تصادفی پایدار (Deterministic PRNG - Mulberry32).
 * با یک عدد سید (Seed) ثابت همیشه دنباله عددی یکسانی تولید می‌کند تا
 * حروف در هیدریشن ری‌اکت و ری‌رندرها دچار پرش نشوند.
 * 
 * @param {number} seed - عدد پایه تولید تصادفی
 * @returns {() => number} تابع تولید عدد بین ۰ و ۱
 */
export function mulberry32(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * تولید مختصات، زوایا و سرعت‌های شناوری پایدار برای حروف پراکنده سکشن Hero.
 * 
 * @param {number} count - تعداد حروف کلمه مورد نظر
 * @param {number} [seed=7] - سید اولیه برای اطمینان از یکپارچگی رندر
 * @returns {Array<{x: number, y: number, rotate: number, scale: number, end: number, floatSpeed: number, floatPhase: number}>}
 */
export function createLetterSeeds(count, seed = 7) {
  const rand = mulberry32(seed);
  const sign = () => (rand() < 0.5 ? -1 : 1);

  return Array.from({ length: count }, () => ({
    // فاصله افقی اولیه از محل استقرار بر حسب کسری از عرض استیج
    x: sign() * (0.12 + rand() * 0.33),
    // فاصله عمودی اولیه از محل استقرار بر حسب کسری از ارتفاع استیج
    y: sign() * (0.12 + rand() * 0.3),
    // زاویه چرخش اولیه به درجه
    rotate: sign() * (70 + rand() * 200),
    // مقیاس اولیه بزرگی/کوچکی حرف
    scale: 0.55 + rand() * 1.1,
    // نقطه پایان پراکندگی در اسکرول که در آن حرف سر جای خود می‌نشیند
    end: 0.45 + rand() * 0.3,
    // سرعت نوسان شناوری در فضا
    floatSpeed: 0.5 + rand() * 0.7,
    // زاویه فاز اولیه نوسان سینوسی
    floatPhase: rand() * Math.PI * 2,
  }));
}
