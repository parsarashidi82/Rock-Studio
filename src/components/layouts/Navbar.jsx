import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

const HERO_ID = "top"; // id سکشن Hero
const OPEN_AT = 0.2; // هدر در ۲۰٪ اسکرول Hero باز می‌شود

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

  const check = useCallback((y) => {
    const hero = document.getElementById(HERO_ID);
    // مسافت اسکرول Hero = ارتفاعش منهای یک صفحه
    const range = hero
      ? hero.offsetHeight - window.innerHeight
      : window.innerHeight * 2;
    const isVisible = y > range * OPEN_AT;
    setVisible(isVisible);
    if (!isVisible) {
      setOpen(false);
    }
  }, []);

  // هدایت هوشمند به بهترین وضعیت اسکرول هر سکشن (به‌ویژه Selected Work که بعد از اتمام انیمیشن ورود و لود کامل قفل می‌شود)
  const handleNavClick = (e, href) => {
    e.preventDefault();
    setOpen(false);

    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const getElementGlobalTop = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY;
    };

    if (href === "#work") {
      const el = document.getElementById("work");
      if (el) {
        const top = getElementGlobalTop(el);
        const scrollDistance = el.offsetHeight - window.innerHeight;
        // اسکرول دقیق به نقطه‌ای که کامپوننت Work کاملاً لود شده، ستون‌ها قفل شده و با شفافیت 100% و بدون بلور آماده تعامل است
        const target = top + Math.max(0, scrollDistance) * 0.26;
        window.scrollTo({ top: target, behavior: "smooth" });
      }
      return;
    }

    if (href === "#about") {
      const el = document.getElementById("about");
      if (el) {
        const top = getElementGlobalTop(el);
        window.scrollTo({ top, behavior: "smooth" });
      }
      return;
    }

    if (href === "#services" || href === "#statement") {
      const el =
        document.getElementById("statement") ||
        document.getElementById("services");
      if (el) {
        const top = getElementGlobalTop(el);
        const scrollDistance = el.offsetHeight - window.innerHeight;
        const target = top + Math.max(0, scrollDistance) * 0.72;
        window.scrollTo({ top: target, behavior: "smooth" });
      }
      return;
    }

    if (href === "#contact") {
      const el = document.getElementById("contact");
      if (el) {
        const top = getElementGlobalTop(el);
        const scrollDistance = el.offsetHeight - window.innerHeight;
        // اسکرول دقیق به نقطه‌ای که فرم، کیبورد ۳بعدی تعاملی، شبکه‌های اجتماعی و هاله نوری ۱۰۰٪ لود و مستقر شده‌اند
        const target = top + Math.max(0, scrollDistance) * 0.66;
        window.scrollTo({ top: target, behavior: "smooth" });
      }
      return;
    }

    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  useMotionValueEvent(scrollY, "change", check);

  // اگر صفحه وسط اسکرول رفرش شد، وضعیت درست پس از رندر اولیه تنظیم شود
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      check(window.scrollY);
    });
    return () => cancelAnimationFrame(frameId);
  }, [check]);

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
              onClick={(e) => handleNavClick(e, "#top")}
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
                  <RollLink
                    href={l.href}
                    label={l.label}
                    onClick={(e) => handleNavClick(e, l.href)}
                  />
                </motion.div>
              </div>
            ))}
          </nav>

          {/* دکمه‌ی CTA */}
          <div className="hidden overflow-hidden md:block">
            <motion.a
              variants={rise}
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
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

        {/* خط نئونی پایین هدر */}
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
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-5 bg-[#050508]/98 px-8 backdrop-blur-2xl md:hidden"
          >
            {LINKS.map((l, i) => (
              <div key={l.label} className="overflow-hidden">
                <motion.a
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "115%" }}
                  transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: 0.12 + i * 0.06,
                  }}
                  className="block text-4xl font-semibold tracking-tight text-white transition-colors duration-200 hover:text-[#67E8F9]"
                >
                  {l.label}
                </motion.a>
              </div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-6 flex items-center justify-between border-t border-white/10 pt-6"
            >
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
                ROK STUDIO
              </span>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="rounded-full border border-[#67E8F9]/50 bg-[#67E8F9]/10 px-5 py-2 font-mono text-xs uppercase tracking-wider text-[#67E8F9]"
              >
                Let&apos;s talk
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
