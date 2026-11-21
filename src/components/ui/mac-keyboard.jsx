"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Audio synthesis helpers
const audioAwake = () => true;
const useAutoplaySoundAllowed = () => true;
const getSoundsEnabled = () => true;
const DEFAULT_KEY_SOUND_SRC = "";
const useKeySound = () => ({ play: () => false, prime: () => {}, unlock: () => {} });

// ---- keyboard-layout ----
const k = (
  id,
  label,
  sub,
  code,
  char,
  width,
  kind = "normal",
  sound = "normal",
  groupGap = false
) => ({ id, label, sub, code, char, width, kind, sound, groupGap });

// Every row except fn sums to 15 flex-units so rows stay aligned.
const MAC_ROWS = [
  // ── Function row ─────────────────────────────────────────────
  [
    k("Escape", "esc", undefined, "Escape", "", 1.5, "modifier", "modifier"),
    k("F1",  "F1",  undefined, "F1",  "", 1, "fn", "modifier", true),
    k("F2",  "F2",  undefined, "F2",  "", 1, "fn", "modifier"),
    k("F3",  "F3",  undefined, "F3",  "", 1, "fn", "modifier"),
    k("F4",  "F4",  undefined, "F4",  "", 1, "fn", "modifier"),
    k("F5",  "F5",  undefined, "F5",  "", 1, "fn", "modifier", true),
    k("F6",  "F6",  undefined, "F6",  "", 1, "fn", "modifier"),
    k("F7",  "F7",  undefined, "F7",  "", 1, "fn", "modifier"),
    k("F8",  "F8",  undefined, "F8",  "", 1, "fn", "modifier"),
    k("F9",  "F9",  undefined, "F9",  "", 1, "fn", "modifier", true),
    k("F10", "F10", undefined, "F10", "", 1, "fn", "modifier"),
    k("F11", "F11", undefined, "F11", "", 1, "fn", "modifier"),
    k("F12", "F12", undefined, "F12", "", 1, "fn", "modifier"),
  ],

  // ── Number row (15u) ─────────────────────────────────────────
  [
    k("Backquote",   "`",  "~",  "Backquote",   "`",  1),
    k("Digit1",      "1",  "!",  "Digit1",      "1",  1),
    k("Digit2",      "2",  "@",  "Digit2",      "2",  1),
    k("Digit3",      "3",  "#",  "Digit3",      "3",  1),
    k("Digit4",      "4",  "$",  "Digit4",      "4",  1),
    k("Digit5",      "5",  "%",  "Digit5",      "5",  1),
    k("Digit6",      "6",  "^",  "Digit6",      "6",  1),
    k("Digit7",      "7",  "&",  "Digit7",      "7",  1),
    k("Digit8",      "8",  "*",  "Digit8",      "8",  1),
    k("Digit9",      "9",  "(",  "Digit9",      "9",  1),
    k("Digit0",      "0",  ")",  "Digit0",      "0",  1),
    k("Minus",       "-",  "_",  "Minus",       "-",  1),
    k("Equal",       "=",  "+",  "Equal",       "=",  1),
    k("Backspace",   "⌫",  undefined, "Backspace", "", 2, "delete", "delete"),
  ],

  // ── QWERTY row (15u) ─────────────────────────────────────────
  [
    k("Tab",          "⇥",  undefined, "Tab",          "\t", 1.5, "modifier", "modifier"),
    k("KeyQ",         "Q",  undefined, "KeyQ",         "q",  1),
    k("KeyW",         "W",  undefined, "KeyW",         "w",  1),
    k("KeyE",         "E",  undefined, "KeyE",         "e",  1),
    k("KeyR",         "R",  undefined, "KeyR",         "r",  1),
    k("KeyT",         "T",  undefined, "KeyT",         "t",  1),
    k("KeyY",         "Y",  undefined, "KeyY",         "y",  1),
    k("KeyU",         "U",  undefined, "KeyU",         "u",  1),
    k("KeyI",         "I",  undefined, "KeyI",         "i",  1),
    k("KeyO",         "O",  undefined, "KeyO",         "o",  1),
    k("KeyP",         "P",  undefined, "KeyP",         "p",  1),
    k("BracketLeft",  "[",  "{",  "BracketLeft",  "[",  1),
    k("BracketRight", "]",  "}",  "BracketRight", "]",  1),
    k("Backslash",    "\\", "|",  "Backslash",    "\\", 1.5, "modifier", "modifier"),
  ],

  // ── ASDF row (15u) ───────────────────────────────────────────
  [
    k("CapsLock", "caps",   undefined, "CapsLock", "",   1.75, "modifier", "modifier"),
    k("KeyA",     "A",      undefined, "KeyA",     "a",  1),
    k("KeyS",     "S",      undefined, "KeyS",     "s",  1),
    k("KeyD",     "D",      undefined, "KeyD",     "d",  1),
    k("KeyF",     "F",      undefined, "KeyF",     "f",  1),
    k("KeyG",     "G",      undefined, "KeyG",     "g",  1),
    k("KeyH",     "H",      undefined, "KeyH",     "h",  1),
    k("KeyJ",     "J",      undefined, "KeyJ",     "j",  1),
    k("KeyK",     "K",      undefined, "KeyK",     "k",  1),
    k("KeyL",     "L",      undefined, "KeyL",     "l",  1),
    k("Semicolon", ";",     ":",  "Semicolon",   ";",  1),
    k("Quote",    "'",      "\"", "Quote",       "'",  1),
    k("Enter",    "return", undefined, "Enter",    "\n", 2.25, "enter", "enter"),
  ],

  // ── ZXCV row (15u) ───────────────────────────────────────────
  [
    k("ShiftLeft",  "⇧", undefined, "ShiftLeft",  "",  2.25, "modifier", "modifier"),
    k("KeyZ",       "Z", undefined, "KeyZ",       "z", 1),
    k("KeyX",       "X", undefined, "KeyX",       "x", 1),
    k("KeyC",       "C", undefined, "KeyC",       "c", 1),
    k("KeyV",       "V", undefined, "KeyV",       "v", 1),
    k("KeyB",       "B", undefined, "KeyB",       "b", 1),
    k("KeyN",       "N", undefined, "KeyN",       "n", 1),
    k("KeyM",       "M", undefined, "KeyM",       "m", 1),
    k("Comma",      ",", "<",  "Comma",      ",", 1),
    k("Period",     ".", ">",  "Period",     ".", 1),
    k("Slash",      "/", "?",  "Slash",      "/", 1),
    k("ShiftRight", "⇧", undefined, "ShiftRight", "",  2.75, "modifier", "modifier"),
  ],

  // ── Bottom row (15u) ─────────────────────────────────────────
  [
    k("Fn",          "fn",      undefined, "Fn",          "", 1,    "modifier", "modifier"),
    k("ControlLeft", "control", undefined, "ControlLeft", "", 1.5,  "modifier", "modifier"),
    k("AltLeft",     "option",  undefined, "AltLeft",     "", 1.5,  "modifier", "modifier"),
    k("MetaLeft",    "⌘",       undefined, "MetaLeft",    "", 1.75, "modifier", "modifier"),
    k("Space",       "",        undefined, "Space",       " ", 5,   "space",    "space"),
    k("MetaRight",   "⌘",       undefined, "MetaRight",   "", 1.75, "modifier", "modifier"),
    k("AltRight",    "option",  undefined, "AltRight",    "", 1.5,  "modifier", "modifier"),
    k("ArrowLeft",   "←",       undefined, "ArrowLeft",   "", 1,    "nav",      "modifier"),
    k("ArrowRight",  "→",       undefined, "ArrowRight",  "", 1,    "nav",      "modifier"),
  ],
];

const COMPACT_ROWS = MAC_ROWS.slice(1);

const CODE_ALIASES = {
  OSLeft: "MetaLeft",
  OSRight: "MetaRight",
};

const NAMES = {
  Backspace: "Delete",
  Tab: "Tab",
  ShiftLeft: "Shift",
  ShiftRight: "Shift",
  MetaLeft: "Command",
  MetaRight: "Command",
  ArrowLeft: "Left arrow",
  ArrowRight: "Right arrow",
  Space: "Space",
  Enter: "Return",
  CapsLock: "Caps Lock",
  Escape: "Escape",
};

const PRESS = { type: "spring", stiffness: 700, damping: 26, mass: 0.5 };

export const KeyboardKey = React.memo(function KeyboardKey({
  keyDef,
  isActive,
  isFnRow = false,
  capClassName,
  activeClassName,
  keyClassName = "",
  still = false,
  onPress,
  register,
}) {
  const mod = keyDef.kind === "modifier" || keyDef.kind === "nav" || keyDef.kind === "enter" || keyDef.kind === "delete";
  const fn = isFnRow || keyDef.kind === "fn";
  const wordy = keyDef.label.length > 1 && !/^F\d+$/.test(keyDef.label);

  return (
    <motion.button
      type="button"
      ref={(el) => register(keyDef.code, el)}
      aria-label={NAMES[keyDef.code] ?? (keyDef.label || keyDef.id)}
      aria-pressed={isActive}
      onPointerDown={(e) => {
        if (e.button === 0 && e.isTrusted) onPress(keyDef, e.currentTarget);
      }}
      onClick={(e) => {
        if (e.detail === 0) onPress(keyDef, e.currentTarget);
      }}
      initial={false}
      animate={still ? undefined : isActive ? { y: 2, scaleY: 0.93, scaleX: 0.98 } : { y: 0, scaleY: 1, scaleX: 1 }}
      whileTap={still ? undefined : { y: 2, scaleY: 0.93, scaleX: 0.98 }}
      transition={PRESS}
      style={{ flex: keyDef.width, originY: 1 }}
      className={cn(
        `relative z-10 flex min-w-0 select-none rounded-[0.32em] outline-none transition-colors duration-75 focus-visible:ring-2 focus-visible:ring-cyan-400 ${
          fn ? "h-[max(16px,3.6cqw)]" : "h-[max(24px,5.6cqw)]"
        } ${capClassName}`,
        isActive && "ring-1 ring-cyan-400/80 shadow-[0_0_12px_rgba(103,232,249,0.5)]",
        keyClassName
      )}
    >
      {keyDef.kind !== "space" && (
        <span
          className={`pointer-events-none absolute inset-0 flex px-[0.45em] leading-none transition-colors duration-150 ${
            mod
              ? keyDef.code.endsWith("Right") || keyDef.kind === "enter" || keyDef.kind === "delete"
                ? "items-end justify-end pb-[0.45em]"
                : "items-end justify-start pb-[0.45em]"
              : "items-center justify-center"
          } ${fn || wordy ? "text-[max(7px,1.15cqw)] font-medium" : "text-[max(9px,1.9cqw)]"} ${
            isActive ? activeClassName : ""
          }`}
        >
          {keyDef.sub && !mod && !fn ? (
            <span className="flex flex-col items-center gap-[0.15em]">
              <span className="text-[0.72em] opacity-60">{keyDef.sub}</span>
              <span>{keyDef.label}</span>
            </span>
          ) : (
            keyDef.label
          )}
        </span>
      )}
    </motion.button>
  );
});

// Per-variant parameters tuned for each key type
const VARIANT = {
  normal:   { ckHz: 5400, ckQ: 4.2, ckDcy: 0.0042, ckGn: 0.50, tdHz: 400, tdQ: 1.1, tdDcy: 0.022, tdGn: 0.82, tdOff: 0.007, bodyHz: 280, bodyGn: 0.22 },
  space:    { ckHz: 2200, ckQ: 2.2, ckDcy: 0.010,  ckGn: 0.28, tdHz: 148, tdQ: 0.8, tdDcy: 0.048, tdGn: 1.05, tdOff: 0.012, bodyHz: 118, bodyGn: 0.30 },
  enter:    { ckHz: 3700, ckQ: 3.4, ckDcy: 0.006,  ckGn: 0.43, tdHz: 275, tdQ: 1.0, tdDcy: 0.032, tdGn: 0.92, tdOff: 0.009, bodyHz: 205, bodyGn: 0.26 },
  delete:   { ckHz: 6100, ckQ: 4.8, ckDcy: 0.0034, ckGn: 0.55, tdHz: 510, tdQ: 1.3, tdDcy: 0.017, tdGn: 0.73, tdOff: 0.005, bodyHz: 345, bodyGn: 0.18 },
  modifier: { ckHz: 3000, ckQ: 2.7, ckDcy: 0.005,  ckGn: 0.28, tdHz: 210, tdQ: 0.9, tdDcy: 0.019, tdGn: 0.60, tdOff: 0.007, bodyHz: 158, bodyGn: 0.15 },
};

const TYPE_MULT = {
  mechanical: { ckScale: 1.00, tdScale: 1.00, bodyScale: 1.00, ckQMult: 1.0 },
  soft:       { ckScale: 0.28, tdScale: 0.75, bodyScale: 0.60, ckQMult: 0.5 },
  clicky:     { ckScale: 1.55, tdScale: 0.85, bodyScale: 0.55, ckQMult: 1.9 },
};

function synthesise(ctx, variant, type, volume) {
  const now = ctx.currentTime;
  const sr  = ctx.sampleRate;
  const vol = Math.max(0, Math.min(1, volume));
  const p   = VARIANT[variant] || VARIANT.normal;
  const tm  = TYPE_MULT[type] || TYPE_MULT.mechanical;

  const jitter = () => 0.92 + Math.random() * 0.16;

  function noiseBurst(t, hz, q, decaySec, gain) {
    if (gain < 0.001) return;
    const dur = Math.max(decaySec * 6.5, 0.014);
    const len = Math.ceil(sr * dur);
    const buf = ctx.createBuffer(1, len, sr);
    const d   = buf.getChannelData(0);
    const tc  = decaySec * sr;
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / tc);
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp  = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = hz * jitter();
    bp.Q.value = q;
    const gn  = ctx.createGain();
    gn.gain.setValueAtTime(gain * vol, t);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp);
    bp.connect(gn);
    gn.connect(ctx.destination);
    src.start(t);
    src.stop(t + dur + 0.01);
  }

  // ── Layer 1: High-frequency click
  noiseBurst(now, p.ckHz, p.ckQ * tm.ckQMult, p.ckDcy, p.ckGn * tm.ckScale);

  // ── Layer 2: Low-frequency thud
  const t2 = now + p.tdOff;
  noiseBurst(t2, p.tdHz * jitter(), p.tdQ, p.tdDcy, p.tdGn * tm.tdScale);

  // ── Layer 3: Pitched resonance
  const bodyGain = p.bodyGn * tm.bodyScale * vol;
  if (bodyGain > 0.01) {
    const osc = ctx.createOscillator();
    const gn  = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(p.bodyHz * 1.35 * jitter(), t2);
    osc.frequency.exponentialRampToValueAtTime(p.bodyHz * 0.52, t2 + 0.065);
    gn.gain.setValueAtTime(bodyGain, t2);
    gn.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.085);
    osc.connect(gn);
    gn.connect(ctx.destination);
    osc.start(t2);
    osc.stop(t2 + 0.1);
  }
}

function useKeyboardSound(opts = { enabled: true, volume: 0.6, soundType: "mechanical" }) {
  const ctxRef  = React.useRef(null);
  const optsRef = React.useRef(opts);

  React.useEffect(() => {
    optsRef.current = opts;
  });

  const getCtx = React.useCallback(() => {
    if (!optsRef.current?.enabled || !getSoundsEnabled()) return null;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!ctxRef.current || ctxRef.current.state === "closed") {
        ctxRef.current = new AudioCtx();
      }
      if (ctxRef.current.state === "suspended") {
        void ctxRef.current.resume();
      }
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  const play = React.useCallback(
    (variant) => {
      const ctx = getCtx();
      if (!ctx) return;
      try {
        synthesise(ctx, variant, optsRef.current.soundType || "mechanical", optsRef.current.volume ?? 0.6);
      } catch {
        // Silently absorb
      }
    },
    [getCtx]
  );

  React.useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return { play };
}

const SKIN = {
  cyber: {
    body: "bg-[#080811]/95 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.12),inset_0_1px_1px_rgba(103,232,249,0.15)]",
    cap: "bg-gradient-to-b from-[#181926] to-[#0e0f18] text-slate-200 border border-white/[0.07] shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-cyan-400/40 hover:text-white transition-all",
    on: "text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(103,232,249,0.9)] border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    strip: "bg-[#0d0e17]/90 text-slate-100 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]",
    dim: "text-cyan-400/60",
    caret: "bg-cyan-400 shadow-[0_0_8px_#67E8F9]",
  },
  dark: {
    body: "bg-[#080811]/95 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.12),inset_0_1px_1px_rgba(103,232,249,0.15)]",
    cap: "bg-gradient-to-b from-[#181926] to-[#0e0f18] text-slate-200 border border-white/[0.07] shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-cyan-400/40 hover:text-white transition-all",
    on: "text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(103,232,249,0.9)] border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    strip: "bg-[#0d0e17]/90 text-slate-100 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]",
    dim: "text-cyan-400/60",
    caret: "bg-cyan-400 shadow-[0_0_8px_#67E8F9]",
  },
  light: {
    body: "bg-[linear-gradient(180deg,#ececef,#d9d9de)] shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_0_0_1px_rgba(0,0,0,.06),0_24px_44px_-28px_rgba(0,0,0,.45)]",
    cap: "bg-[linear-gradient(180deg,#ffffff,#f4f4f6)] text-[#1d1d1f] shadow-[0_1px_0_rgba(0,0,0,.18),0_1px_2px_rgba(0,0,0,.12),inset_0_-1px_0_rgba(0,0,0,.04)]",
    on: "text-[#0071e3]",
    strip: "bg-white text-[#1d1d1f] shadow-[0_0_0_1px_rgba(0,0,0,.05),0_10px_24px_-18px_rgba(0,0,0,.35)]",
    dim: "text-[#86868b]",
    caret: "bg-[#0071e3]",
  },
  auto: {
    body: "bg-[#080811]/95 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.12),inset_0_1px_1px_rgba(103,232,249,0.15)]",
    cap: "bg-gradient-to-b from-[#181926] to-[#0e0f18] text-slate-200 border border-white/[0.07] shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-cyan-400/40 hover:text-white transition-all",
    on: "text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(103,232,249,0.9)] border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    strip: "bg-[#0d0e17]/90 text-slate-100 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]",
    dim: "text-cyan-400/60",
    caret: "bg-cyan-400 shadow-[0_0_8px_#67E8F9]",
  },
};

const BY_CODE = new Map(MAC_ROWS.flat().map((k) => [k.code, k]));
const BY_CHAR = new Map(MAC_ROWS.flat().filter((k) => k.char && k.char.length === 1).map((k) => [k.char.toLowerCase(), k]));

const MAX_CHARS = 40;

const listening = new Map();
let lastUsed = null;
let nextId = 0;

function onScreen(el) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const h = window.innerHeight;
  if (r.bottom <= 0 || r.top >= h || r.width === 0) return null;
  return Math.abs((r.top + r.bottom) / 2 - h / 2);
}

function ownsKeys(id) {
  if (lastUsed !== null && listening.has(lastUsed) && onScreen(listening.get(lastUsed)()) !== null) {
    return lastUsed === id;
  }
  let best = null;
  let bestDist = Infinity;
  listening.forEach((get, k) => {
    const d = onScreen(get());
    if (d !== null && d < bestDist) {
      bestDist = d;
      best = k;
    }
  });
  return best === id;
}

export function MacKeyboard({
  layout = "mac",
  enableSound = true,
  soundSrc = DEFAULT_KEY_SOUND_SRC,
  volume = 0.6,
  soundType = "mechanical",
  activeKeys = [],
  listen = true,
  listenToInputs = true,
  showOutput = false,
  placeholder = "Start typing...",
  autoplay = false,
  autoplayText = "hello rock studio",
  accent = "#67E8F9",
  className = "",
  keyClassName = "",
  theme = "cyber",
  showFunctionRow = true,
  onKeyPress,
}) {
  const still = useReducedMotion() === true;
  const skin = SKIN[theme] ?? SKIN.cyber;
  const { play: synth } = useKeyboardSound({ enabled: enableSound, volume, soundType });
  const { play: playRecorded, prime: primeSound, unlock: unlockSound } = useKeySound({ enabled: enableSound, src: soundSrc, volume });
  const autoAllowed = useAutoplaySoundAllowed();
  const body = React.useRef(null);
  const timers = React.useRef(new Set());
  const els = React.useRef(new Map());
  const touched = React.useRef(false);
  const seq = React.useRef(0);
  const [id] = React.useState(() => ++nextId);
  const [ripples, setRipples] = React.useState([]);
  const [held, setHeld] = React.useState([]);
  const [text, setText] = React.useState("");
  const [sent, setSent] = React.useState(0);

  const rows = React.useMemo(() => {
    const base = layout === "compact" ? COMPACT_ROWS : MAC_ROWS;
    return showFunctionRow || layout === "compact" ? base : base.slice(1);
  }, [layout, showFunctionRow]);

  const register = React.useCallback((code, el) => {
    if (el) els.current.set(code, el);
    else els.current.delete(code);
  }, []);

  /** Light ring from the key centre, sound, and text update */
  const strike = React.useCallback(
    (key, sound = true) => {
      const el = els.current.get(key.code);
      const host = body.current;
      if (el && host && !still) {
        const a = el.getBoundingClientRect();
        const b = host.getBoundingClientRect();
        const rid = ++seq.current;
        setRipples((r) => [
          ...r.slice(-5),
          { id: rid, x: Math.round(a.left - b.left + a.width / 2), y: Math.round(a.top - b.top + a.height / 2) },
        ]);
      }
      if (sound === "auto" ? autoAllowed && !document.hidden && audioAwake() : sound) {
        if (!playRecorded(key.code)) synth(key.sound);
      }
      if (key.code === "Enter") {
        setText("");
        setSent((n) => n + 1);
        return;
      }
      setText((t) => {
        if (key.code === "Backspace") return t.slice(0, -1);
        if (key.char && key.char !== "\t" && key.char !== "\n") return (t + key.char).slice(-MAX_CHARS);
        return t;
      });
    },
    [playRecorded, synth, still, autoAllowed]
  );

  const tap = React.useCallback((key) => {
    setHeld((h) => [...h, key.code]);
    const t = window.setTimeout(() => {
      timers.current.delete(t);
      setHeld((h) => h.filter((c, i) => c !== key.code || i !== h.indexOf(key.code)));
    }, 130);
    timers.current.add(t);
  }, []);

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const takeOver = React.useCallback(() => {
    lastUsed = id;
    if (touched.current) return;
    touched.current = true;
    if (autoplay) setText("");
  }, [id, autoplay]);

  const onPress = React.useCallback(
    (key) => {
      takeOver();
      tap(key);
      strike(key, true);
      onKeyPress?.(key);
    },
    [takeOver, tap, strike, onKeyPress]
  );

  React.useEffect(() => {
    if (listen) primeSound();
  }, [listen, primeSound]);

  React.useEffect(() => {
    if (!listen) return;
    listening.set(id, () => body.current);

    const down = (e) => {
      const t = e.target;
      const isInput = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if (!listenToInputs && isInput) return;
      if (e.metaKey || e.ctrlKey) return;
      
      const code = CODE_ALIASES[e.code] ?? e.code;
      let key = BY_CODE.get(code);

      // Fallback for character keys (e.g., when typing in non-standard layout)
      if (!key && e.key && e.key.length === 1) {
        key = BY_CHAR.get(e.key.toLowerCase());
      }

      if (!key || !ownsKeys(id)) return;
      takeOver();

      // Only preventDefault if the user is NOT actively typing in an input or textarea
      if (!isInput && (code === "Space" || code === "Backspace" || code === "Tab" || code === "Quote" || code === "Slash")) {
        e.preventDefault();
      }

      if (!e.repeat) strike(key, true);
      setHeld((h) => (h.includes(key.code) ? h : [...h, key.code]));
    };

    const up = (e) => {
      const code = CODE_ALIASES[e.code] ?? e.code;
      let key = BY_CODE.get(code);
      if (!key && e.key && e.key.length === 1) {
        key = BY_CHAR.get(e.key.toLowerCase());
      }
      const targetCode = key ? key.code : code;
      setHeld((h) => h.filter((c) => c !== targetCode));
    };

    const blur = () => setHeld([]);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);

    return () => {
      listening.delete(id);
      if (lastUsed === id) lastUsed = null;
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [listen, listenToInputs, strike, id, takeOver]);

  // Demo autoplay
  React.useEffect(() => {
    if (!autoplay || !autoplayText) return;
    const keys = Array.from(autoplayText.toLowerCase())
      .map((c) => BY_CHAR.get(c))
      .filter(Boolean);
    const enter = BY_CODE.get("Enter");
    if (enter) keys.push(enter);
    let i = 0;
    let t = 0;
    const step = () => {
      if (touched.current) return;
      const k = keys[i % keys.length];
      i++;
      tap(k);
      const at = (i - 1) % keys.length;
      const beat = at === 0 || k.code === "Space" || k.code === "Enter" || keys[at - 1]?.code === "Space";
      strike(k, beat ? "auto" : false);
      const pause = k.code === "Enter" ? 1700 : k.char === " " ? 210 : 120 + ((i * 37) % 90);
      t = window.setTimeout(step, pause);
    };
    t = window.setTimeout(step, 700);
    return () => window.clearTimeout(t);
  }, [autoplay, autoplayText, tap, strike]);

  const active = React.useMemo(() => {
    const s = new Set([...activeKeys, ...held]);
    if (s.has("OSLeft")) s.add("MetaLeft");
    if (s.has("OSRight")) s.add("MetaRight");
    return s;
  }, [activeKeys, held]);

  const chars = Array.from(text);

  return (
    <div className="mx-auto flex w-full max-w-[840px] flex-col items-center gap-4 [container-type:inline-size]">
      {showOutput && (
        <div
          className={cn(
            "relative flex h-11 w-full max-w-[420px] items-center overflow-hidden rounded-full px-5 text-[15px] tracking-[-0.01em]",
            skin.strip
          )}
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={sent}
              className="flex min-w-0 items-center whitespace-pre"
              exit={still ? { opacity: 0 } : { y: -26, opacity: 0, scale: 0.96, transition: { type: "spring", stiffness: 300, damping: 24 } }}
            >
              {chars.length === 0 ? (
                <span className={skin.dim}>{placeholder}</span>
              ) : (
                chars.map((c, i) => (
                  <motion.span
                    key={i}
                    initial={still ? false : { y: 8, opacity: 0, scale: 0.7 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 700, damping: 22 }}
                    className="inline-block text-cyan-300 font-mono"
                  >
                    {c}
                  </motion.span>
                ))
              )}
              <motion.span
                aria-hidden="true"
                className={cn("ml-0.5 inline-block h-5 w-[2px] rounded-full", skin.caret)}
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity }}
              />
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      <div
        ref={body}
        role="group"
        aria-label="Mac keyboard"
        onPointerEnter={() => {
          primeSound();
          if (listen) lastUsed = id;
        }}
        onFocus={primeSound}
        onPointerUp={unlockSound}
        className={cn(
          "relative w-full select-none overflow-hidden rounded-[min(22px,3cqw)] p-[min(14px,1.8cqw)]",
          skin.body,
          className
        )}
      >
        {/* Backlight: rings drawn under the caps, so the light shows through the gaps */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              className="absolute h-[90px] w-[90px] rounded-full"
              style={{
                left: r.x - 45,
                top: r.y - 45,
                background: `radial-gradient(circle, transparent 35%, ${accent} 52%, transparent 72%)`,
              }}
              initial={{ scale: 0.2, opacity: 0.95 }}
              animate={{ scale: 9.5, opacity: 0 }}
              transition={{ scale: { type: "spring", stiffness: 40, damping: 16 }, opacity: { duration: 1.1, ease: "easeOut" } }}
              onAnimationComplete={() => setRipples((list) => list.filter((x) => x.id !== r.id))}
            />
          ))}
          {ripples.length > 0 && (
            <motion.span
              key={`glow-${ripples[ripples.length - 1].id}`}
              className="absolute h-[70px] w-[70px] rounded-full blur-md"
              style={{
                left: ripples[ripples.length - 1].x - 35,
                top: ripples[ripples.length - 1].y - 35,
                background: accent,
              }}
              initial={{ opacity: 0.85, scale: 0.6 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </div>

        <div className="relative flex flex-col gap-[max(3px,0.65cqw)]">
          {rows.map((row, ri) => {
            const fnRow = layout === "mac" && showFunctionRow && ri === 0;
            return (
              <div key={ri} className="relative flex gap-[max(3px,0.65cqw)]">
                {row.map((k) => (
                  <React.Fragment key={k.id}>
                    {k.groupGap && fnRow && <span className="w-[max(3px,0.8cqw)] shrink-0" />}
                    <KeyboardKey
                      keyDef={k}
                      isActive={active.has(k.code)}
                      isFnRow={fnRow}
                      capClassName={skin.cap}
                      activeClassName={skin.on}
                      keyClassName={keyClassName}
                      still={still}
                      onPress={onPress}
                      register={register}
                    />
                  </React.Fragment>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MacKeyboard;
