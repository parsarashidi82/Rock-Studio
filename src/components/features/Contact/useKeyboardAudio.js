import { useEffect, useRef, useState, useCallback } from "react";
import { VAR_MAP } from "./keyboardData";

/**
 * هوک اختصاصی سنتز صدای کیبورد مکانیکی با استفاده از Web Audio API مرورگر.
 * بدون نیاز به دانلود فایل‌های صوتی سنگین، با ترکیب نویز فیلترشده (Bandpass)
 * و رزونانس فرکانس پایین سینوسی، صدای واقعی ضربه سوییچ مکانیکی را تولید می‌کند.
 * 
 * @returns {{
 *   soundOn: boolean,
 *   setSoundOn: React.Dispatch<React.SetStateAction<boolean>>,
 *   playKeySound: (soundType?: string) => void,
 *   closeAudio: () => void
 * }}
 */
export function useKeyboardAudio() {
  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(soundOn);
  const acRef = useRef(null);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  // تولید پالس نویز سفید فیلترشده با رمپ نمایی گین
  const burst = useCallback((t, hz, q, dec, g, vol) => {
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
  }, []);

  // پخش صدای سوییچ متناسب با نوع کلید
  const playKeySound = useCallback((v = "normal") => {
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

      // ایجاد نوسان سینوسی فرکانس پایین برای شبیه‌سازی صدای ته‌نشینی کلید (Bottom-out Thud)
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
      // چشم‌پوشی از خطاهای محدودیت تعامل اولیه مرورگر
    }
  }, [burst]);

  // بستن منبع صدا در زمان خروج از صفحه
  const closeAudio = useCallback(() => {
    acRef.current?.close().catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      closeAudio();
    };
  }, [closeAudio]);

  return { soundOn, setSoundOn, playKeySound, closeAudio };
}
