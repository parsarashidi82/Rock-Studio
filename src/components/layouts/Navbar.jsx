import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

const HERO_ID = "top"; // id سکشن Hero
const OPEN_AT = 0.8; // هدر در ۸۰٪ اسکرول Hero باز می‌شود

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const EASE = [0.22, 1, 0.36, 1];

const bar = {
  hide: { y: "-100%", transition: { duration: 0.4, ease: EASE } },
  show: {
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE,
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const rise = {
  hide: { y: "115%" },
  show: { y: 0, transition: { duration: 0.7, ease: EASE } },
};

const line = {
  hide: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.1, ease: EASE } },
};

// متن با افکت رول موقع هاور
function RollLink({ href, label, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative block h-[1.3em] overflow-hidden text-sm leading-[1.3em] tracking-wide text-white/80"
    >
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden
        className="absolute left-0 top-full block text-[#67E8F9] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full"
      >
        {label}
      </span>
    </a>
  );
}

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  const check = (y) => {
    const hero = document.getElementById(HERO_ID);
    // مسافت اسکرول Hero = ارتفاعش منهای یک صفحه
    const range = hero
      ? hero.offsetHeight - window.innerHeight
      : window.innerHeight * 2;
    setVisible(y > range * OPEN_AT);
  };

  useMotionValueEvent(scrollY, "change", check);

  // اگر صفحه وسط اسکرول رفرش شد، وضعیت درست از همان اول تنظیم شود
  useEffect(() => {
    check(window.scrollY);
  }, []);

  // وقتی هدر جمع شد منوی موبایل هم بسته شود
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  return (
    <>
      <motion.header
        variants={bar}
        initial="hide"
        animate={visible ? "show" : "hide"}
        style={{ pointerEvents: visible ? "auto" : "none" }}
        className="fixed inset-x-0 top-0 z-50 bg-[#050508]/60 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 md:px-10">
          {/* لوگو */}
          <div className="overflow-hidden">
            <motion.a
              variants={rise}
              href="#top"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
            >
              ROK
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#67E8F9]" />
            </motion.a>
          </div>

          {/* لینک‌های دسکتاپ */}
          <nav className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <div key={l.label} className="overflow-hidden">
                <motion.div variants={rise}>
                  <RollLink href={l.href} label={l.label} />
                </motion.div>
              </div>
            ))}
          </nav>

          {/* دکمه‌ی CTA */}
          <div className="hidden overflow-hidden md:block">
            <motion.a
              variants={rise}
              href="#contact"
              className="block rounded-full border border-white/20 px-5 py-2 text-sm text-white transition-colors duration-300 hover:border-[#67E8F9] hover:bg-[#67E8F9] hover:text-[#050508]"
            >
              Let&apos;s talk
            </motion.a>
          </div>

          {/* دکمه‌ی منوی موبایل */}
          <div className="overflow-hidden md:hidden">
            <motion.button
              variants={rise}
              onClick={() => setOpen((o) => !o)}
              className="block font-mono text-xs uppercase tracking-[0.25em] text-white"
            >
              {open ? "Close" : "Menu"}
            </motion.button>
          </div>
        </div>

        {/* خط پایین هدر که کشیده می‌شود */}
        <motion.div
          variants={line}
          style={{ originX: 0 }}
          className="h-px w-full bg-gradient-to-r from-[#67E8F9]/60 via-white/15 to-transparent"
        />
      </motion.header>

      {/* منوی تمام‌صفحه‌ی موبایل */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-3 bg-[#050508] px-6 md:hidden"
          >
            {LINKS.map((l, i) => (
              <div key={l.label} className="overflow-hidden">
                <motion.a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "115%" }}
                  transition={{
                    duration: 0.7,
                    ease: EASE,
                    delay: 0.15 + i * 0.07,
                  }}
                  className="block text-5xl font-semibold tracking-tight text-white"
                >
                  {l.label}
                </motion.a>
              </div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
