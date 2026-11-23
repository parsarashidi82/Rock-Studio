/**
 * @file constants.js
 * @description Centralized design tokens, brand identities, theme colors,
 * animation easings, and contact/social metadata for Rock Studio.
 */

/**
 * Primary Brand Colors (Obsidian Cyber & Cyan Electric Theme)
 */
export const THEME = {
  // Electric Cyan accent
  CYAN: "#67E8F9",
  CYAN_RGB: "103, 232, 249",

  // Deep Obsidian Cyber backgrounds
  BG_OBSIDIAN: "#050508",
  BG_STAGE: "#080812",
  BG_CARD: "#0b0b14",

  // Typography
  FONT_SANS: "Inter, system-ui, -apple-system, sans-serif",
  FONT_MONO: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

/**
 * Standard Framer Motion Easings
 */
export const EASINGS = {
  // Smooth cubic bezier ease-out (smooth natural deceleration)
  SMOOTH: [0.22, 1, 0.36, 1],
  // Exponential fast entrance / deceleration
  EXPO_OUT: [0.16, 1, 0.3, 1],
};

/**
 * Studio Social Links
 */
export const SOCIAL_LINKS = {
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
 * Standard Responsive Breakpoints (in pixels)
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
};
