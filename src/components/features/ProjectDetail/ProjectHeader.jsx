import { Link } from "react-router-dom";

/**
 * Top navigation bar for Project Detail view.
 * Features back navigation to works section, studio badge, and direct call-to-action.
 */
export default function ProjectHeader({ externalUrl }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050508]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 md:px-12">
        <Link
          to="/#work"
          className="group flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/70 transition-colors hover:text-[#67E8F9] sm:text-xs sm:tracking-[0.25em]"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          <span>Back to Works</span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-white sm:text-lg"
        >
          ROK
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#67E8F9]" />
        </Link>

        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white transition-colors duration-300 hover:border-[#67E8F9] hover:bg-[#67E8F9] hover:text-[#050508] sm:px-4 sm:py-1.5 sm:text-xs"
          >
            <span>Visit Live</span>
          </a>
        ) : (
          <Link
            to="/#contact"
            className="rounded-full border border-white/20 px-3.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white transition-colors duration-300 hover:border-[#67E8F9] hover:bg-[#67E8F9] hover:text-[#050508] sm:px-5 sm:py-1.5 sm:text-xs"
          >
            Let&apos;s Talk
          </Link>
        )}
      </div>
    </header>
  );
}
