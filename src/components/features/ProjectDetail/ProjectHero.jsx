/**
 * کامپوننت معرفی و هیرو کیس‌استادی پروژه (Project Hero).
 * نمایش عنوان پروژه، دسته‌بندی، پاراگراف مانیفست و شبکه متادیتای بنتو (کلاینت، سال، حوزه تخصصی و خروجی).
 * 
 * @param {Object} props
 * @param {import("@/data/projects").Project} props.project - اطلاعات کامل پروژه
 */
export default function ProjectHero({ project }) {
  return (
    <>
      {/* تیتر و دسته‌بندی پروژه */}
      <div className="max-w-4xl">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#67E8F9]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#67E8F9] sm:text-xs sm:tracking-[0.3em]">
            {project.category} · Case Study
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:mt-4 sm:text-4xl md:text-7xl">
          {project.title}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-white/70 sm:mt-6 sm:text-lg md:text-xl">
          {project.description}
        </p>
      </div>

      {/* شبکه متادیتای بنتو (Bento Metadata Grid) */}
      <div className="mt-8 grid grid-cols-2 gap-3 border-y border-white/10 py-6 sm:mt-12 sm:gap-4 sm:py-8 md:grid-cols-4 md:gap-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            Client
          </p>
          <p className="mt-2 text-base font-medium text-white md:text-lg">
            {project.client || "Studio Project"}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            Year
          </p>
          <p className="mt-2 text-base font-medium text-white md:text-lg">
            {project.year || "2024"}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            Discipline
          </p>
          <p className="mt-2 text-base font-medium text-white md:text-lg">
            {project.category}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            Output
          </p>
          {project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex items-center gap-1 text-base font-medium text-[#67E8F9] hover:underline md:text-lg"
            >
              <span>See Website</span>
            </a>
          ) : project.video ? (
            <p className="mt-2 text-base font-medium text-[#67E8F9] md:text-lg">
              Full 4K Video
            </p>
          ) : (
            <p className="mt-2 text-base font-medium text-white md:text-lg">
              Visual Identity
            </p>
          )}
        </div>
      </div>
    </>
  );
}
