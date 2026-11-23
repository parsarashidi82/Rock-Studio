import ProjectHeader from "./ProjectHeader";
import ProjectHero from "./ProjectHero";
import ProjectMedia from "./ProjectMedia";
import ProjectServices from "./ProjectServices";

/**
 * کامپوننت کل نمای صفحه کیس‌استادی پروژه (Project View Layout).
 * ترکیب‌کننده هدر ناوبری، هیرو و بنتو گرید، شوکیس مدیا، خدمات و کارت پروژه بعدی.
 * 
 * @param {Object} props
 * @param {import("@/data/projects").Project} props.project - اطلاعات کامل پروژه
 * @param {import("@/data/projects").Project} [props.nextProject] - پروژه بعدی جهت نمایش در انتهای صفحه
 * @param {(targetProject: any) => void} [props.onNextClick] - کال‌بک هدایت به پروژه بعدی
 */
export default function ProjectView({ project, nextProject, onNextClick }) {
  if (!project) return null;

  return (
    <div className="relative min-h-screen bg-[#050508] text-white selection:bg-[#67E8F9] selection:text-[#050508]">
      {/* هاله گرادیان فیروزه‌ای پس‌زمینه */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(103,232,249,0.12),transparent_70%)]" />

      {/* هدر ناوبری اختصاصی پروژه */}
      <ProjectHeader externalUrl={project.externalUrl} />

      {/* کانتینر اصلی محتوای کیس‌استادی */}
      <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-28 sm:pt-12 md:px-12 md:pt-16">
        <ProjectHero project={project} />
        <ProjectMedia project={project} />
        <ProjectServices
          project={project}
          nextProject={nextProject}
          onNextClick={onNextClick}
        />
      </main>
    </div>
  );
}
