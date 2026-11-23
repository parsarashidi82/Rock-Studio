/**
 * پیکربندی ماتریس چیدمان کیبورد مکانیکی و پارامترهای فیزیک صدا.
 * چیدمان استاندارد ۷۵٪ مکینتاش (ANSI) همراه با پروفایل‌های آکوستیک سوییچ‌ها.
 */

// تابع کمکی ساخت مشخصات هر کلید
export const K = (code, label, sub, ch, w, kind = "n", snd = "normal") => ({
  code,   // کد رویداد کیبورد e.code
  label,  // متن اصلی روی کلید
  sub,    // کاراکتر ثانویه (Shift)
  ch,     // کاراکتر خروجی هنگام تایپ
  w,      // عرض کلید بر حسب ضریب استاندارد
  kind,   // نوع کلید (عادی n، مدیفایر mod، فانکشن fn)
  snd,    // پروفایل صوتی سوییچ (normal, space, enter, delete, modifier)
});

// تابع کمکی ساخت کلیدهای الفبا
export const L = (c) => K("Key" + c.toUpperCase(), c.toUpperCase(), "", c, 1);

// ردیف اعداد و کاراکترهای خاص
export const nums = "`~,1!,2@,3#,4$,5%,6^,7&,8*,9(,0),-_,=+".split(",");

export const numCodes = [
  "Backquote",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Digit0",
  "Minus",
  "Equal",
];

// ماتریس کامل ردیف‌های کیبورد مکینتاش
export const ROWS = [
  [
    K("Escape", "esc", "", "", 1.5, "mod", "modifier"),
    ...Array.from({ length: 12 }, (_, i) => ({
      ...K("F" + (i + 1), "F" + (i + 1), "", "", 1, "fn", "modifier"),
      gap: i % 4 === 0,
    })),
  ],
  [
    ...nums.map((n, i) => K(numCodes[i], n[0], n[1], n[0], 1)),
    K("Backspace", "⌫", "", "", 2, "mod", "delete"),
  ],
  [
    K("Tab", "⇥", "", "\t", 1.5, "mod", "modifier"),
    ..."qwertyuiop".split("").map(L),
    K("BracketLeft", "[", "{", "[", 1),
    K("BracketRight", "]", "}", "]", 1),
    K("Backslash", "\\", "|", "\\", 1.5, "mod", "modifier"),
  ],
  [
    K("CapsLock", "caps", "", "", 1.75, "mod", "modifier"),
    ..."asdfghjkl".split("").map(L),
    K("Semicolon", ";", ":", ";", 1),
    K("Quote", "'", '"', "'", 1),
    K("Enter", "return", "", "\n", 2.25, "mod", "enter"),
  ],
  [
    K("ShiftLeft", "⇧", "", "", 2.25, "mod", "modifier"),
    ..."zxcvbnm".split("").map(L),
    K("Comma", ",", "<", ",", 1),
    K("Period", ".", ">", ".", 1),
    K("Slash", "/", "?", "/", 1),
    K("ShiftRight", "⇧", "", "", 2.75, "mod", "modifier"),
  ],
  [
    K("Fn", "fn", "", "", 1, "mod", "modifier"),
    K("ControlLeft", "control", "", "", 1.5, "mod", "modifier"),
    K("AltLeft", "option", "", "", 1.5, "mod", "modifier"),
    K("MetaLeft", "⌘", "", "", 1.75, "mod", "modifier"),
    K("Space", "", "", " ", 5, "n", "space"),
    K("MetaRight", "⌘", "", "", 1.75, "mod", "modifier"),
    K("AltRight", "option", "", "", 1.5, "mod", "modifier"),
    K("ArrowLeft", "←", "", "", 1, "mod", "modifier"),
    K("ArrowRight", "→", "", "", 1, "mod", "modifier"),
  ],
];

// دیکشنری‌های سریع جستجوی کلید بر اساس کد رویداد یا کاراکتر
export const BY_CODE = {};
export const BY_CHAR = {};

ROWS.forEach((row) => {
  row.forEach((k) => {
    BY_CODE[k.code] = k;
    if (k.ch && k.ch.length === 1) BY_CHAR[k.ch] = k;
  });
});

/**
 * پارامترهای سنتز آکوستیک سوییچ‌ها در Web Audio API:
 * [فرکانس اول, ضریب Q اول, زمان محو اول, گین اول, فرکانس دوم, ضریب Q دوم, زمان محو دوم, گین دوم, تاخیر دوم, فرکانس موج سینوسی, گین سینوسی]
 */
export const VAR_MAP = {
  normal: [5400, 4.2, 0.0042, 0.5, 400, 1.1, 0.022, 0.82, 0.007, 280, 0.22],
  space: [2200, 2.2, 0.01, 0.28, 148, 0.8, 0.048, 1.05, 0.012, 118, 0.3],
  enter: [3700, 3.4, 0.006, 0.43, 275, 1, 0.032, 0.92, 0.009, 205, 0.26],
  delete: [6100, 4.8, 0.0034, 0.55, 510, 1.3, 0.017, 0.73, 0.005, 345, 0.18],
  modifier: [3000, 2.7, 0.005, 0.28, 210, 0.9, 0.019, 0.6, 0.007, 158, 0.15],
};
