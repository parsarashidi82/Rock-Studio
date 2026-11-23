import { useEffect, useState } from "react";

/**
 * هوک محاسبه و اندازه‌گیری دقیق هندسی حروف روی Canvas (Text Layout Engine).
 * 
 * این هوک مختصات دقیق پیکسلی، بیس‌لاین، و موقعیت هر کاراکتر از کلمه "Rok Studio" را بر اساس
 * ابعاد صفحه اندازه‌گیری می‌کند تا حروف شناور دقیقا روی پیکسل‌های هم‌نام در کامپوننت TechText بنشینند.
 * 
 * @param {React.RefObject} ref - ارجاع DOM به استیج والد
 * @param {Object} options - تنظیمات تایپوگرافی
 * @param {string} options.text - متن مورد نظر جهت چینش
 * @param {number} options.fontWeight - وزن فونت
 * @param {number} options.fontSize - اندازه پایه فونت به پیکسل
 * @param {number} options.letterSpacing - فاصله افقی بین حروف
 * @returns {Object|null} مشخصات چیدمان شامل عرض، ارتفاع، سایز نهایی و آرایه حروف با مختصات x
 */
export function useTextLayout(
  ref,
  { text, fontWeight, fontSize, letterSpacing },
) {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return undefined;

    const getFamily = () =>
      getComputedStyle(el).fontFamily || "sans-serif";

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const family = getFamily();

      const setFont = (size) => {
        ctx.font = `${fontWeight} ${size}px ${family}`;
        ctx.letterSpacing = `${letterSpacing * size}px`;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
      };

      // مقیاس‌بندی هوشمند متن برای جا شدن کامل در استیج (مشابه الگوریتم TechText)
      setFont(fontSize);
      let m = ctx.measureText(text);
      const fit = Math.min(
        1,
        (w * 0.9) /
          Math.max(m.actualBoundingBoxLeft + m.actualBoundingBoxRight, 1),
        (h * 0.66) /
          Math.max(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, 1),
      );
      const size = fontSize * fit;

      setFont(size);
      m = ctx.measureText(text);
      const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const inkH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const x0 = (w - inkW) / 2 + m.actualBoundingBoxLeft;
      const baseline = (h - inkH) / 2 + m.actualBoundingBoxAscent;

      // محاسبه بیس‌لاین داخلی کاراکترها در باکس با لاین‌هایت ۱
      const fA = m.fontBoundingBoxAscent ?? size * 0.8;
      const fD = m.fontBoundingBoxDescent ?? size * 0.2;
      const baselineInBox = (size - (fA + fD)) / 2 + fA;

      // محاسبه مختصات افقی x برای هر کاراکتر غیرخالی
      const glyphs = [];
      let prefix = "";
      Array.from(text).forEach((char, index) => {
        prefix += char;
        const own = ctx.measureText(char);
        const x = x0 + ctx.measureText(prefix).width - own.width;
        if (char.trim()) glyphs.push({ char, index, x });
      });

      setLayout({
        width: w,
        height: h,
        size,
        top: baseline - baselineInBox,
        glyphs,
      });
    };

    measure();
    // رصد تغییر اندازه صفحه برای بروزرسانی مختصات
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    document.fonts
      ?.load(`${fontWeight} 64px ${getFamily()}`, text)
      .then(measure, measure);

    return () => ro.disconnect();
  }, [ref, text, fontWeight, fontSize, letterSpacing]);

  return layout;
}
