import { useEffect, useState } from "react";

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

      // همان fit که TechText انجام می‌دهد
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

      // با line-height: 1 باید baseline درون باکس span را بدانیم
      const fA = m.fontBoundingBoxAscent ?? size * 0.8;
      const fD = m.fontBoundingBoxDescent ?? size * 0.2;
      const baselineInBox = (size - (fA + fD)) / 2 + fA;

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