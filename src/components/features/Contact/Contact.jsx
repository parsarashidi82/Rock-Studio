import { useEffect, useRef, useState } from "react";

const clamp = (v) => Math.min(1, Math.max(0, v));
const win = (p, a, b) => clamp((p - a) / (b - a));

const bez = (x1, y1, x2, y2) => (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  let a = t;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  for (let i = 0; i < 8; i++) {
    const x = ((ax * a + bx) * a + cx) * a - t;
    const d = (3 * ax * a + 2 * bx) * a + cx;
    if (Math.abs(x) < 1e-5) break;
    a -= x / d;
  }
  return ((ay * a + by) * a + cy) * a;
};

const ease = bez(0.22, 1, 0.36, 1);

/* ---------- Keyboard Layout Data ---------- */
const K = (code, label, sub, ch, w, kind = "n", snd = "normal") => ({
  code,
  label,
  sub,
  ch,
  w,
  kind,
  snd,
});
const L = (c) => K("Key" + c.toUpperCase(), c.toUpperCase(), "", c, 1);
const nums = "`~,1!,2@,3#,4$,5%,6^,7&,8*,9(,0),-_,=+".split(",");
const numCodes = [
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

const ROWS = [
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

const BY_CODE = {};
const BY_CHAR = {};
ROWS.forEach((row) => {
  row.forEach((k) => {
    BY_CODE[k.code] = k;
    if (k.ch && k.ch.length === 1) BY_CHAR[k.ch] = k;
  });
});

/* ---------- Audio Synthesis Parameters ---------- */
const VAR_MAP = {
  normal: [5400, 4.2, 0.0042, 0.5, 400, 1.1, 0.022, 0.82, 0.007, 280, 0.22],
  space: [2200, 2.2, 0.01, 0.28, 148, 0.8, 0.048, 1.05, 0.012, 118, 0.3],
  enter: [3700, 3.4, 0.006, 0.43, 275, 1, 0.032, 0.92, 0.009, 205, 0.26],
  delete: [6100, 4.8, 0.0034, 0.55, 510, 1.3, 0.017, 0.73, 0.005, 345, 0.18],
  modifier: [3000, 2.7, 0.005, 0.28, 210, 0.9, 0.019, 0.6, 0.007, 158, 0.15],
};

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
  const acRef = useRef(null);

  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(soundOn);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  const focusedFieldRef = useRef(null);
  const shiftRef = useRef(false);
  const capsRef = useRef(false);

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

    /* ---------- Audio Synthesizer Functions ---------- */
    const burst = (t, hz, q, dec, g, vol) => {
      const ac = acRef.current;
      if (!ac || g < 0.001) return;
      const sr = ac.sampleRate;
      const dur = Math.max(dec * 6.5, 0.014);
      const len = Math.ceil(sr * dur);
      const buf = ac.createBuffer(1, len, sr);
      const d = buf.getChannelData(0);
      const tc = dec * sr;
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / tc);
      }
      const s = ac.createBufferSource();
      s.buffer = buf;
      const f = ac.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = hz * (0.92 + Math.random() * 0.16);
      f.Q.value = q;
      const gn = ac.createGain();
      gn.gain.setValueAtTime(g * vol, t);
      gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f);
      f.connect(gn);
      gn.connect(ac.destination);
      s.start(t);
      s.stop(t + dur + 0.01);
    };

    const clickSound = (v) => {
      if (!soundOnRef.current) return;
      try {
        if (!acRef.current) {
          const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) acRef.current = new AudioContextClass();
        }
        const ac = acRef.current;
        if (!ac) return;
        if (ac.state === "suspended") ac.resume();

        const p = VAR_MAP[v] || VAR_MAP.normal;
        const n = ac.currentTime;
        const vol = 0.35;
        burst(n, p[0], p[1], p[2], p[3], vol);
        burst(n + p[8], p[4], p[5], p[6], p[7], vol);

        const o = ac.createOscillator();
        const g = ac.createGain();
        const t2 = n + p[8];
        o.type = "sine";
        o.frequency.setValueAtTime(p[9] * 1.35, t2);
        o.frequency.exponentialRampToValueAtTime(p[9] * 0.52, t2 + 0.065);
        g.gain.setValueAtTime(p[10] * vol, t2);
        g.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.085);
        o.connect(g);
        g.connect(ac.destination);
        o.start(t2);
        o.stop(t2 + 0.1);
      } catch {
        // absorb
      }
    };

    /* ---------- Press & Ripple Effects ---------- */
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
        { duration: 1100, easing: "cubic-bezier(.2,.8,.2,1)" },
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
        { duration: 600, easing: "ease-out" },
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
        130,
      );
      ripple(el);
      clickSound(k.snd);
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
      acRef.current?.close().catch(() => {});
    };
  }, []);

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
            <div>
              <div className="r" data-r="0,.12">
                <p className="eyebrow">Contact</p>
                <h2>
                  Tell us what
                  <br />
                  you’re building.
                </h2>
              </div>

              <form id="f" ref={formRef} noValidate>
                <div className="r" data-r=".08,.22">
                  <label className="fld">
                    <span>Your name</span>
                    <input name="name" dir="auto" autoComplete="name" />
                  </label>
                </div>
                <div className="r" data-r=".15,.29">
                  <label className="fld">
                    <span>Phone number</span>
                    <input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      dir="auto"
                      autoComplete="tel"
                    />
                  </label>
                </div>
                <div className="r" data-r=".22,.36">
                  <label className="fld">
                    <span>Message</span>
                    <textarea name="message" rows={3} dir="auto" />
                  </label>
                </div>
                <div className="r row" data-r=".32,.44">
                  <button className="send" type="submit">
                    Send message
                  </button>
                  <p id="st" ref={stRef} aria-live="polite" />
                </div>
              </form>

              <div className="r soc" data-r=".5,.64">
                <a
                  href="https://t.me/rokstudio"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span>Telegram</span>
                  <b>@rokstudio</b>
                </a>
                <a
                  href="https://instagram.com/rokstudio"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span>Instagram</span>
                  <b>@rokstudio</b>
                </a>
              </div>
            </div>

            <div className="kbw" ref={kbwRef} id="kbw">
              <div id="kb" ref={kbRef} aria-hidden="true">
                <div className="rip" ref={ripRef} id="rip" />
                <div className="rows" id="rows">
                  {ROWS.map((row, ri) => (
                    <div className="krow" key={ri}>
                      {row.map((k) => (
                        <div key={k.code} style={{ display: "contents" }}>
                          {k.gap && <span className="gap" />}
                          <button
                            type="button"
                            tabIndex={-1}
                            data-code={k.code}
                            ref={(el) => {
                              if (el) elsRef.current[k.code] = el;
                            }}
                            aria-label={k.label || k.code}
                            className={`key ${k.kind === "fn" ? "fn" : ""} ${k.kind === "mod" ? "mod" : ""} ${
                              /Right$|^Enter$|^Backspace$/.test(k.code)
                                ? "right"
                                : ""
                            }`}
                            style={{ "--w": k.w }}
                          >
                            {k.code !== "Space" &&
                              (k.sub && k.kind === "n" ? (
                                <span className="l s">
                                  <i>{k.sub}</i>
                                  <span>{k.label}</span>
                                </span>
                              ) : (
                                <span className="l">{k.label}</span>
                              ))}
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="cap">
                <span>Type in the fields, or tap the keys</span>
                <button
                  id="snd"
                  type="button"
                  onClick={() => setSoundOn((prev) => !prev)}
                >
                  Sound {soundOn ? "on" : "off"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
