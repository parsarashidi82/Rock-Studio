import nimaImg from "@/assets/nima.webp";
import parsaImg from "@/assets/parsa.webp";
import samanImg from "@/assets/saman.webp";

/**
 * @typedef {Object} FounderBox
 * @property {string} left - موقعیت درصدی از لبه چپ عکس
 * @property {string} top - موقعیت درصدی از لبه بالای عکس
 * @property {string} width - عرض درصدی کادر فوکوس
 * @property {string} height - ارتفاع درصدی کادر فوکوس
 */

/**
 * @typedef {Object} Founder
 * @property {string} id - شناسه یکتا
 * @property {string} name - نام نمایشی بنیان‌گذار
 * @property {string} role - نقش تخصصی و مسئولیت استودیو
 * @property {string} tagline - شعار شخصی یا هویت روایی
 * @property {string} image - تصویر پرتره باکیفیت و فوکوس‌شده
 * @property {string} quote - مانیفست یا نقل‌قول شخصی
 * @property {string[]} skills - مهارت‌ها و تخصص‌های کلیدی
 * @property {FounderBox} box - مختصات کادر اسپات‌لایت نئونی روی عکس اصلی تیم
 * @property {number[]} range - نقاط عطف ورود و خروج اسکرول [شروع ورود، تکمیل ورود، شروع خروج، پایان خروج]
 */

/**
 * اطلاعات متمرکز هم‌بنیان‌گذاران استودیو رُک و زمان‌بندی اسپات‌لایت در اسکرول
 * @type {Founder[]}
 */
export const FOUNDERS = [
  {
    id: "nima",
    name: "Nima",
    role: "Director & Creative Lead",
    tagline: "The Vision & Cinematic Soul",
    image: nimaImg,
    quote:
      "Every project starts as an emotion. My obsession is uncovering that emotion, crafting its narrative heartbeat, and directing every visual nuance so audiences don't just watch — they feel it.",
    skills: ["Film Directing", "Visual Storytelling", "Cinematography", "Creative Direction"],
    // موقعیت دقیق نیما (سمت راست عکس با کلاه بافتنی)
    box: {
      left: "60%",
      top: "2%",
      width: "39%",
      height: "94%",
    },
    range: [0.14, 0.2, 0.36, 0.41],
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
    // موقعیت دقیق پارسا (وسط عکس)
    box: {
      left: "37%",
      top: "16%",
      width: "26%",
      height: "78%",
    },
    range: [0.44, 0.5, 0.66, 0.71],
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
    range: [0.74, 0.8, 0.91, 0.96],
  },
];
