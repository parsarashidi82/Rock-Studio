import { Link } from "react-router-dom";

/**
 * ProjectServices component displaying:
 * 1. Services Provided checklist
 * 2. Technologies & tags pill badges
 * 3. Inquiry callout card
 * 4. Next Case Study teaser card
 */
export default function ProjectServices({ project, nextProject, onNextClick }) {
  return (
    <>
      {/* Services, Tags & Inquiry Section */}
      <div className="mt-20 grid grid-cols-1 gap-12 border-t border-white/10 pt-16 md:grid-cols-3">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#67E8F9]">
            Services Provided
          </h2>
          <ul className="mt-4 space-y-2">
            {project.services?.map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 text-base text-white/80"
              >
                <span className="h-1 w-1 rounded-full bg-[#67E8F9]" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#67E8F9]">
            Technologies & Tags
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags?.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#67E8F9]">
            Project Inquiry
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Inspired by this work? We design and engineer world-class motion,
            web, and visual experiences tailored for ambitious brands.
          </p>
          <Link
            to="/#contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#67E8F9] bg-[#67E8F9] px-5 py-2 font-mono text-xs uppercase tracking-wider text-[#050508] transition-all hover:bg-transparent hover:text-white"
          >
            Start A Project →
          </Link>
        </div>
      </div>

      {/* Next Case Study Teaser Card */}
      {nextProject && (
        <section className="mt-28 border-t border-white/10 pt-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            Next Case Study
          </p>

          <div
            role="button"
            tabIndex={0}
            onClick={() => onNextClick && onNextClick(nextProject)}
            className="group mt-6 block cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-500 hover:border-[#67E8F9]/50 hover:bg-white/[0.04] md:p-12"
          >
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#67E8F9]">
                  {nextProject.category}
                </span>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white transition-colors group-hover:text-[#67E8F9] md:text-5xl">
                  {nextProject.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm text-white/60 md:text-base">
                  {nextProject.description}
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-white/80 group-hover:text-[#67E8F9]">
                <span>View Project</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
