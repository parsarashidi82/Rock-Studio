import { useState, useRef } from "react";
import MacKeyboard from "@/components/ui/mac-keyboard";
import { GlowCard } from "@/components/ui/spotlight-card";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
  });

  const [focusedField, setFocusedField] = useState("name");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInputRef = useRef(null);
  const contactInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVirtualKeyPress = (keyDef) => {
    const activeTarget = focusedField || "message";

    if (keyDef.code === "Backspace") {
      setFormData((prev) => ({
        ...prev,
        [activeTarget]: prev[activeTarget].slice(0, -1),
      }));
      return;
    }

    if (keyDef.code === "Enter") {
      if (activeTarget === "name") {
        setFocusedField("contact");
        contactInputRef.current?.focus();
      } else if (activeTarget === "contact") {
        setFocusedField("message");
        messageInputRef.current?.focus();
      } else {
        setFormData((prev) => ({
          ...prev,
          message: prev.message + "\n",
        }));
      }
      return;
    }

    if (keyDef.char) {
      setFormData((prev) => ({
        ...prev,
        [activeTarget]: prev[activeTarget] + keyDef.char,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name && !formData.contact && !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", contact: "", message: "" });
        setSubmitted(false);
      }, 5000);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="relative z-20 w-full bg-[#050508] text-white overflow-hidden isolate"
    >
      {/* Background Decorative Ambient Gradients */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-20 right-10 h-[350px] w-[350px] rounded-full bg-cyan-600/5 blur-[120px]"
        aria-hidden="true"
      />

      {/* Cyber Grid Texture Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#67E8F9 1px, transparent 1px), linear-gradient(90deg, #67E8F9 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* ======================================================== */}
      {/* SCREEN 1: UNIFIED FORM + KEYBOARD (FITS IN ONE VIEWPORT) */}
      {/* ======================================================== */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-12 sm:px-6 md:px-8 md:py-16">
        {/* Compact Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-1 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#67E8F9] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#67E8F9]" />
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#67E8F9]">
              Contact Transmission // Open Frequency
            </span>
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Let&apos;s Create Something{" "}
            <span className="bg-gradient-to-r from-white via-cyan-200 to-[#67E8F9] bg-clip-text text-transparent">
              Legendary
            </span>
            .
          </h2>

          <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-400">
            Type into the fields or use the terminal keyboard below to send your transmission.
          </p>
        </div>

        {/* Compact Cyber Console Container (Form + Keyboard Together) with Spotlight Glow */}
        <GlowCard
          customSize
          glowColor="cyan"
          radius={24}
          border={1.5}
          spotlightSize={450}
          className="flex flex-col gap-5 p-5 sm:p-7 md:p-8"
        >
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            {/* Row 1: Name and Contact Info */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {/* Field 1: Name */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="field-name"
                    className="font-mono text-[11px] font-semibold tracking-wider text-slate-300"
                  >
                    01 // FULL NAME OR STUDIO
                  </label>
                  {focusedField === "name" && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#67E8F9]">
                      Active
                    </span>
                  )}
                </div>
                <input
                  id="field-name"
                  ref={nameInputRef}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  placeholder="e.g. Alex Vance or Nexus Labs"
                  autoComplete="off"
                  className={`w-full rounded-xl border bg-[#05060a]/90 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 ${
                    focusedField === "name"
                      ? "border-cyan-400/80 shadow-[0_0_15px_rgba(103,232,249,0.18)]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                />
              </div>

              {/* Field 2: Contact Info */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="field-contact"
                    className="font-mono text-[11px] font-semibold tracking-wider text-slate-300"
                  >
                    02 // CONTACT INFO (PHONE / EMAIL)
                  </label>
                  {focusedField === "contact" && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#67E8F9]">
                      Active
                    </span>
                  )}
                </div>
                <input
                  id="field-contact"
                  ref={contactInputRef}
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("contact")}
                  placeholder="e.g. +98 912 ... or hello@company.com"
                  autoComplete="off"
                  className={`w-full rounded-xl border bg-[#05060a]/90 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 ${
                    focusedField === "contact"
                      ? "border-cyan-400/80 shadow-[0_0_15px_rgba(103,232,249,0.18)]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                />
              </div>
            </div>

            {/* Row 2: Message + Transmit Button */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4">
              {/* Field 3: Message (8-9 cols) */}
              <div className="flex flex-col gap-1.5 sm:col-span-8 lg:col-span-9">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="field-message"
                    className="font-mono text-[11px] font-semibold tracking-wider text-slate-300"
                  >
                    03 // PROJECT DETAILS &amp; VISION
                  </label>
                  {focusedField === "message" && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#67E8F9]">
                      Active
                    </span>
                  )}
                </div>
                <textarea
                  id="field-message"
                  ref={messageInputRef}
                  name="message"
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  placeholder="Tell us about your project goals, scope, and timeline..."
                  className={`w-full resize-none rounded-xl border bg-[#05060a]/90 px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 ${
                    focusedField === "message"
                      ? "border-cyan-400/80 shadow-[0_0_15px_rgba(103,232,249,0.18)]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                />
              </div>

              {/* Submit Button (3-4 cols) */}
              <div className="flex flex-col justify-end sm:col-span-4 lg:col-span-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex h-[42px] sm:h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 via-cyan-400/30 to-cyan-500/20 px-4 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-400/30 hover:shadow-[0_0_35px_rgba(103,232,249,0.4)] active:scale-[0.99] disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isSubmitting ? (
                      <>
                        <svg className="h-3.5 w-3.5 animate-spin text-cyan-300" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        SENDING...
                      </>
                    ) : submitted ? (
                      <>
                        <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        RECEIVED
                      </>
                    ) : (
                      <>
                        TRANSMIT
                        <svg
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </span>
                  <span
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </form>

          {/* Connected Virtual Keyboard (Right Underneath the Form on the Same Screen) */}
          <div className="relative mt-1 border-t border-cyan-500/15 pt-4">
            <div className="mb-2.5 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-[10px] font-medium tracking-wider text-cyan-300/80">
                  MECHANICAL TERMINAL // REAL-TIME ACTUATION
                </span>
              </div>
              <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-widest text-slate-500">
                Audio &amp; Ripple Synced
              </span>
            </div>

            <MacKeyboard
              theme="cyber"
              accent="#67E8F9"
              listen={true}
              listenToInputs={true}
              showOutput={false}
              showFunctionRow={true}
              enableSound={true}
              volume={0.65}
              soundType="mechanical"
              onKeyPress={handleVirtualKeyPress}
            />
          </div>
        </GlowCard>
      </div>

      {/* ======================================================== */}
      {/* SCREEN 2 / SECTION: CONNECT ON SOCIALS (TELEGRAM & INSTA) */}
      {/* ======================================================== */}
      <div className="relative mx-auto max-w-4xl px-4 pb-28 pt-8 sm:px-6 md:px-8">
        <GlowCard
          customSize
          glowColor="cyan"
          radius={24}
          border={1.5}
          spotlightSize={420}
          className="p-8 sm:p-10"
        >
          <div className="flex flex-col items-center text-center">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#67E8F9]">
              DIRECT CHANNELS // FAST RESPONSE
            </span>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Connect on Socials
            </h3>
            <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-400">
              Prefer instant communication? Reach out directly through our verified studio channels:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Telegram Card */}
            <a
              href="https://t.me/rokstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-[#05060b] p-5 transition-all duration-300 hover:border-cyan-400/60 hover:bg-[#0b101f] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-colors group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                  </svg>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Telegram Direct
                  </span>
                  <p className="text-base font-semibold text-white group-hover:text-[#67E8F9] transition-colors">
                    @rokstudio
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all group-hover:border-cyan-400/50 group-hover:text-[#67E8F9] group-hover:translate-x-0.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href="https://instagram.com/rok.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-[#05060b] p-5 transition-all duration-300 hover:border-pink-500/50 hover:bg-[#140817] hover:shadow-[0_0_25px_rgba(236,72,153,0.18)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-colors group-hover:bg-pink-500/20 group-hover:text-pink-300">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Instagram Direct
                  </span>
                  <p className="text-base font-semibold text-white group-hover:text-pink-400 transition-colors">
                    @rok.studio
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all group-hover:border-pink-500/50 group-hover:text-pink-400 group-hover:translate-x-0.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </a>
          </div>
        </GlowCard>
      </div>
    </section>
  );
}
