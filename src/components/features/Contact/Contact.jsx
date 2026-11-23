import { useEffect, useRef } from "react";
import { BY_CODE, BY_CHAR } from "./keyboardData";
import { useKeyboardAudio } from "./useKeyboardAudio";
import ContactKeyboard from "./ContactKeyboard";
import ContactForm from "./ContactForm";

const clamp = (v) => Math.min(1, Math.max(0, v));
const win = (p, a, b) => clamp((p - a) / (b - a));

/**
 * محاسبات ریاضی منحنی نرم بزیر کوبیک (0.22, 1, 0.36, 1) با تقریب نیوتن-رافسون
 */
const ease = (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  let a = t;
  const cx = 3 * 0.22;
  const bx = 3 * (0.36 - 0.22) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * 1;
  const by = 3 * (1 - 1) - cy;
  const ay = 1 - cy - by;
  for (let i = 0; i < 8; i++) {
    const x = ((ax * a + bx) * a + cx) * a - t;
    const d = (3 * ax * a + 2 * bx) * a + cx;
    if (Math.abs(x) < 1e-5) break;
    a -= x / d;
  }
  return ((ay * a + by) * a + cy) * a;
};

/**
 * ارکستراتور اصلی سکشن تماس استودیو رُک (Contact Section).
 * 
 * تلفیق ۴ ویژگی پیشرفته:
 * ۱. تا شدن و چرخش سه‌بعدی پرسپکتیو کیبورد مکانیکی با اسکرول کاربر.
 * ۲. سینت‌سایزر آکوستیک سوییچ‌های مکانیکی با Web Audio API.
 * ۳. تایپ تعاملی مجازی روی کیبورد به اینپوت‌های فعال فرم.
 * ۴. دریافت پیام، فیلتر شماره تماس و ایجاد ریپل‌های نوری هم‌مرکز.
 */
export default function Contact() {
  const secRef = useRef(null);
  const glowRef = useRef(null);
  const kbwRef = useRef(null);
  const kbRef = useRef(null);
  const ripRef = useRef(null);
  const formRef = useRef(null);
  const stRef = useRef(null);

  const elsRef = useRef({});
  const timersRef = useRef({});
  const focusedFieldRef = useRef(null);
  const shiftRef = useRef(false);
  const capsRef = useRef(false);

  const { soundOn, setSoundOn, playKeySound } = useKeyboardAudio();

  useEffect(() => {
    const sec = secRef.current;
    const glow = glowRef.current;
    const kbw = kbwRef.current;
    const kb = kbRef.current;
    const rip = ripRef.current;
    const form = formRef.current;
    const st = stRef.current;
    if (!sec || !glow || !kbw || !kb || !rip || !form || !st) return;

    const F = {
      name: form.querySelector("[name=name]"),
      phone: form.querySelector("[name=phone]"),
      message: form.querySelector("[name=message]"),
    };
    const order = ["name", "phone", "message"];

    const handleFocus = (n) => {
      focusedFieldRef.current = n;
    };

    order.forEach((n) => {
      if (F[n]) {
        F[n].addEventListener("focus", () => handleFocus(n));
      }
    });

    const handlePhoneInput = () => {
      if (F.phone) {
        F.phone.value = F.phone.value.replace(/[^0-9+\-() ۰-۹]/g, "");
      }
    };
    F.phone?.addEventListener("input", handlePhoneInput);

    /* ---------- Press & Ripple Key Lighting ---------- */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ripple = (el) => {
      if (still || !kb || !rip) return;
      const a = el.getBoundingClientRect();
      const b = kb.getBoundingClientRect();
      const x = a.left - b.left + a.width / 2;
      const y = a.top - b.top + a.height / 2;

      const r = document.createElement("span");
      Object.assign(r.style, {
        width: "80px",
        height: "80px",
        left: x - 40 + "px",
        top: y - 40 + "px",
        background:
          "radial-gradient(circle, transparent 38%, #67E8F9 52%, transparent 70%)",
      });
      rip.append(r);
      const a1 = r.animate(
        [
          { transform: "scale(.2)", opacity: 0.95 },
          { transform: "scale(9)", opacity: 0 },
        ],
        { duration: 1100, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
      a1.onfinish = () => r.remove();

      const g = document.createElement("span");
      Object.assign(g.style, {
        width: "60px",
        height: "60px",
        left: x - 30 + "px",
        top: y - 30 + "px",
        background: "#67E8F9",
        filter: "blur(8px)",
      });
      rip.append(g);
      const a2 = g.animate(
        [
          { transform: "scale(.6)", opacity: 0.8 },
          { transform: "scale(1.4)", opacity: 0 },
        ],
        { duration: 600, easing: "ease-out" }
      );
      a2.onfinish = () => g.remove();
    };

    const press = (x) => {
      const alias = { OSLeft: "MetaLeft", OSRight: "MetaRight" };
      const k = BY_CODE[alias[x] || x] || BY_CHAR[String(x).toLowerCase()];
      if (!k) return;
      const el = elsRef.current[k.code];
      if (!el) return;
      el.classList.add("on");
      clearTimeout(timersRef.current[k.code]);
      timersRef.current[k.code] = setTimeout(
        () => el.classList.remove("on"),
        130
      );
      ripple(el);
      playKeySound(k.snd);
    };

    const handleFormKeydown = (e) => {
      if (e.metaKey || e.ctrlKey) return;
      press(e.code || e.key);
    };
    form.addEventListener("keydown", handleFormKeydown);

    /* ---------- Virtual Keyboard Click Typing ---------- */
    const applyKey = (k) => {
      if (k.code === "ShiftLeft" || k.code === "ShiftRight") {
        shiftRef.current = true;
        return;
      }
      if (k.code === "CapsLock") {
        capsRef.current = !capsRef.current;
        return;
      }
      if (!focusedFieldRef.current) {
        focusedFieldRef.current = "name";
        F.name?.focus();
      }
      const f = focusedFieldRef.current;
      const el = F[f];
      if (!el) return;

      if (k.code === "Tab" || (k.code === "Enter" && f !== "message")) {
        const nx = order[order.indexOf(f) + 1];
        if (nx && F[nx]) F[nx].focus();
        return;
      }
      if (k.code === "Backspace") {
        el.value = el.value.slice(0, -1);
        return;
      }
      let ch = k.code === "Enter" ? "\n" : k.ch;
      if (!ch || ch === "\t") return;

      const up = shiftRef.current !== capsRef.current;
      if (/^[a-z]$/.test(ch) && up) ch = ch.toUpperCase();
      else if (shiftRef.current && k.sub) ch = k.sub;

      shiftRef.current = false;
      if (f === "phone" && !/^[0-9+\-() ]$/.test(ch)) return;
      el.value += ch;
    };

    const handleKbMousedown = (e) => e.preventDefault();
    const handleKbPointerdown = (e) => {
      const b = e.target.closest(".key");
      if (!b || e.button !== 0) return;
      const k = BY_CODE[b.dataset.code];
      if (k) {
        press(k.code);
        applyKey(k);
      }
    };
    kb.addEventListener("mousedown", handleKbMousedown);
    kb.addEventListener("pointerdown", handleKbPointerdown);

    /* ---------- Form Submit ---------- */
    const handleFormSubmit = (e) => {
      e.preventDefault();
      if (
        !F.name?.value.trim() ||
        !F.phone?.value.trim() ||
        !F.message?.value.trim()
      ) {
        st.className = "err";
        st.textContent = "Please fill in all three fields.";
        return;
      }
      const b = form.querySelector(".send");
      if (b) {
        b.disabled = true;
        b.textContent = "Sending…";
      }
      st.textContent = "";

      setTimeout(() => {
        order.forEach((n) => {
          if (F[n]) F[n].value = "";
        });
        if (b) {
          b.disabled = false;
          b.textContent = "Send message";
        }
        st.className = "";
        st.textContent = "Sent. We’ll get back to you soon.";
      }, 900);
    };
    form.addEventListener("submit", handleFormSubmit);

    const clearError = () => {
      if (st.className === "err") {
        st.className = "";
        st.textContent = "";
      }
    };
    order.forEach((n) => F[n]?.addEventListener("input", clearError));

    /* ---------- Smooth Scroll Progress Animation ---------- */
    const rs = [...sec.querySelectorAll(".r")].map((e) => ({
      e,
      a: +e.dataset.r.split(",")[0],
      b: +e.dataset.r.split(",")[1],
    }));

    const applyScroll = (p) => {
      rs.forEach(({ e, a, b }) => {
        const o = win(p, a, b);
        const s = e.style;
        s.opacity = o;
        s.transform = "translateY(" + 28 * (1 - ease(o)) + "px)";
        s.filter = "blur(" + 8 * (1 - o) + "px)";
        s.pointerEvents = o > 0.5 ? "auto" : "none";
      });

      glow.style.opacity = win(p, 0.2, 0.6);

      const e1 = ease(win(p, 0.25, 0.55));
      kbw.style.opacity = win(p, 0.25, 0.45);
      kbw.style.transform =
        "perspective(1200px) translateY(" +
        140 * (1 - e1) +
        "px) rotateX(" +
        28 * (1 - e1) +
        "deg) scale(" +
        (0.9 + 0.1 * e1) +
        ")";
      kbw.style.pointerEvents = p > 0.4 ? "auto" : "none";
    };

    let sp = 0;
    let last = performance.now();
    let rafId = null;

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const r = sec.getBoundingClientRect();
      const t = clamp(-r.top / (r.height - window.innerHeight));
      sp += (t - sp) * (1 - Math.exp(-dt / 0.1));
      applyScroll(sp);
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      order.forEach((n) => {
        F[n]?.removeEventListener("focus", () => handleFocus(n));
        F[n]?.removeEventListener("input", clearError);
      });
      F.phone?.removeEventListener("input", handlePhoneInput);
      form.removeEventListener("keydown", handleFormKeydown);
      form.removeEventListener("submit", handleFormSubmit);
      kb.removeEventListener("mousedown", handleKbMousedown);
      kb.removeEventListener("pointerdown", handleKbPointerdown);
    };
  }, [playKeySound]);

  return (
    <>
      <style>{`
        #contact {
          position: relative;
          height: 260vh;
          background: transparent;
          color: #fff;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
        }
        #contact .mono,
        #contact .eyebrow,
        #contact .fld span,
        #contact .cap,
        #contact .soc span {
          font: 10px ui-monospace, SFMono-Regular, Menlo, monospace;
          letter-spacing: .3em;
          text-transform: uppercase;
        }
        #contact .stage {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        #contact .glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(circle at 70% 55%, rgba(103, 232, 249, 0.10), transparent 45%);
        }
        #contact .wrap {
          position: relative;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 40px);
          display: grid;
          gap: 28px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          #contact .wrap {
            grid-template-columns: 1fr 1.05fr;
            gap: 64px;
            align-items: center;
          }
        }
        #contact .r {
          opacity: 0;
          will-change: transform, opacity, filter;
        }
        #contact .eyebrow {
          margin: 0;
          font-size: 11px;
          color: #67E8F9;
        }
        #contact h2 {
          margin: 8px 0 0;
          font-size: clamp(1.85rem, 5vw, 3.75rem);
          font-weight: 600;
          letter-spacing: -.03em;
          line-height: 1.05;
        }
        #contact form {
          margin-top: 20px;
          display: grid;
          gap: 20px;
        }
        @media (min-width: 600px) {
          #contact form {
            margin-top: 32px;
            gap: 28px;
          }
        }
        #contact .fld {
          display: block;
        }
        #contact .fld span {
          color: rgba(255, 255, 255, 0.4);
          transition: color .2s;
        }
        #contact .fld:focus-within span {
          color: #67E8F9;
        }
        #contact .fld input,
        #contact .fld textarea {
          display: block;
          width: 100%;
          margin-top: 6px;
          border: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          background: transparent;
          color: #fff;
          font: inherit;
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          padding: 0 0 8px;
          outline: 0;
          resize: none;
          transition: border-color .2s;
        }
        @media (min-width: 600px) {
          #contact .fld input,
          #contact .fld textarea {
            margin-top: 8px;
            padding: 0 0 12px;
          }
        }
        #contact .fld input:focus,
        #contact .fld textarea:focus {
          border-color: #67E8F9;
        }
        #contact .row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
        }
        #contact .send {
          font: inherit;
          font-size: 14px;
          color: #fff;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          padding: 10px 24px;
          cursor: pointer;
          transition: all .3s;
        }
        @media (min-width: 600px) {
          #contact .send {
            padding: 12px 28px;
          }
        }
        #contact .send:hover {
          background: #67E8F9;
          border-color: #67E8F9;
          color: #050508;
        }
        #contact .send:disabled {
          opacity: .5;
        }
        #contact #st {
          margin: 0;
          font-size: 14px;
          color: #67E8F9;
        }
        #contact #st.err {
          color: rgba(252, 165, 165, 0.85);
        }
        #contact .soc {
          margin-top: 24px;
          display: flex;
          gap: 24px;
        }
        @media (min-width: 600px) {
          #contact .soc {
            margin-top: 40px;
            gap: 40px;
          }
        }
        #contact .soc a {
          color: #fff;
          text-decoration: none;
        }
        #contact .soc span {
          display: block;
          color: rgba(255, 255, 255, 0.4);
        }
        #contact .soc b {
          display: block;
          margin-top: 4px;
          font-weight: 400;
          font-size: 16px;
          transition: color .2s;
        }
        @media (min-width: 600px) {
          #contact .soc b {
            font-size: 18px;
          }
        }
        #contact .soc a:hover b {
          color: #67E8F9;
        }
        #contact .kbw {
          display: none;
          container-type: inline-size;
          opacity: 0;
          will-change: transform, opacity;
        }
        @media (min-width: 900px) {
          #contact .kbw {
            display: block;
          }
        }
        #contact #kb {
          position: relative;
          margin: 0 auto;
          max-width: 780px;
          overflow: hidden;
          user-select: none;
          border-radius: min(22px, 3cqw);
          padding: min(14px, 1.8cqw);
          background: linear-gradient(180deg, #101018, #08080c);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 0 0 1px rgba(255, 255, 255, 0.06), 0 30px 60px -30px rgba(0, 0, 0, 0.9), 0 0 80px -40px rgba(103, 232, 249, 0.35);
        }
        #contact .rip {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        #contact .rip span {
          position: absolute;
          border-radius: 50%;
        }
        #contact .rows {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: max(3px, 0.65cqw);
        }
        #contact .krow {
          display: flex;
          gap: max(3px, 0.65cqw);
        }
        #contact .gap {
          width: max(3px, 0.8cqw);
          flex: none;
        }
        #contact .key {
          position: relative;
          z-index: 1;
          flex: var(--w);
          min-width: 0;
          height: max(24px, 5.6cqw);
          border: 0;
          padding: 0;
          border-radius: .32em;
          font: inherit;
          font-size: max(9px, 1.9cqw);
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          background: linear-gradient(180deg, #1b1b24, #121218);
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06);
          transform-origin: 50% 100%;
          transition: transform .14s cubic-bezier(.3, 1.5, .5, 1), box-shadow .15s;
        }
        #contact .key.fn {
          height: max(16px, 3.6cqw);
          font-size: max(7px, 1.15cqw);
          font-weight: 500;
        }
        #contact .key .l {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 .45em;
          line-height: 1;
          transition: color .15s;
        }
        #contact .key .l.s {
          flex-direction: column;
          gap: .15em;
        }
        #contact .key .l i {
          font-style: normal;
          font-size: .72em;
          opacity: .6;
        }
        #contact .key.mod .l {
          align-items: flex-end;
          justify-content: flex-start;
          padding-bottom: .45em;
          font-size: max(7px, 1.15cqw);
          font-weight: 500;
        }
        #contact .key.mod.right .l {
          justify-content: flex-end;
        }
        #contact .key.on {
          transform: translateY(1.5px) scale(.985, .94);
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(103, 232, 249, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }
        #contact .key.on .l {
          color: #67E8F9;
        }
        #contact .cap {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: rgba(255, 255, 255, 0.4);
        }
        #contact .cap button {
          font: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
          color: inherit;
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
        }
        #contact .cap button:hover {
          color: #67E8F9;
        }
        @media (prefers-reduced-motion: reduce) {
          #contact .key {
            transition: none;
          }
        }
      `}</style>

      <section id="contact" ref={secRef}>
        <div className="stage">
          <div className="glow" ref={glowRef} />
          <div className="wrap">
            <ContactForm formRef={formRef} stRef={stRef} />
            <ContactKeyboard
              kbwRef={kbwRef}
              kbRef={kbRef}
              ripRef={ripRef}
              elsRef={elsRef}
              soundOn={soundOn}
              onToggleSound={() => setSoundOn((prev) => !prev)}
            />
          </div>
        </div>
      </section>
    </>
  );
}
