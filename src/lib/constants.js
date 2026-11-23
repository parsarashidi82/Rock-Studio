/**
 * توکن‌های متمرکز طراحی و هویت بصری استودیو راک
 * شامل پالت رنگی رسمی، فونت‌ها، منحنی‌های شتاب انیمیشن، شبکه‌های اجتماعی و بریک‌پوینت‌ها.
 */

/**
 * رنگ‌ها و تم اصلی برند (مشکی ابسیدین و فیروزه‌ای الکتریک)
 */
export const THEME = {
  // رنگ فیروزه‌ای شاخص استودیو راک
  CYAN: "#67E8F9",
  CYAN_RGB: "103, 232, 249",

  // پس‌زمینه‌های مشکی مات سایبرپانک
  BG_OBSIDIAN: "#050508",
  BG_STAGE: "#080812",
  BG_CARD: "#0b0b14",

  // قلم‌های استاندارد
  FONT_SANS: "Inter, system-ui, -apple-system, sans-serif",
  FONT_MONO: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

/**
 * منحنی‌های استاندارد انیمیشن فریمز موشن (Easing Curves)
 */
export const EASINGS = {
  // منحنی سینماتیک برای توقف بسیار نرم و ارگانیک
  SMOOTH: [0.22, 1, 0.36, 1],
  // منحنی اکسپوننشیال برای ورود پرشتاب و استقرار بدون پرش
  EXPO_OUT: [0.16, 1, 0.3, 1],
};

/**
 * راه‌های ارتباطی و شبکه‌های اجتماعی استودیو
 */
export const SOCIAL_LINKS = {
  telegram: "https://t.me/rokstudio",
  instagram: "https://instagram.com/rokstudio",
  TELEGRAM: {
    LABEL: "Telegram",
    HANDLE: "@rokstudio",
    URL: "https://t.me/rokstudio",
  },
  INSTAGRAM: {
    LABEL: "Instagram",
    HANDLE: "@rokstudio",
    URL: "https://instagram.com/rokstudio",
  },
  EMAIL: "hello@rokstudio.com",
};

/**
 * نقاط عطف ریسپانسیو و ابعاد نمایشگرها (بر حسب پیکسل)
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
};
