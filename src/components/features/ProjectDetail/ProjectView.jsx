import ProjectHeader from "./ProjectHeader";
import ProjectHero from "./ProjectHero";
import ProjectMedia from "./ProjectMedia";
import ProjectServices from "./ProjectServices";

/**
 * ProjectView component presenting the full rich layout of a project case study.
 * Assembles Header, Hero, Bento metadata, media player, services, and next-project card.
 */
export default function ProjectView({ project, nextProject, onNextClick }) {
  if (!project) return null;

  return (
    <div className="relative min-h-screen bg-[#050508] text-white selection:bg-[#67E8F9] selection:text-[#050508]">
      {/* Background radial cyan glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(103,232,249,0.12),transparent_70%)]" />

      {/* Project navigation header */}
      <ProjectHeader externalUrl={project.externalUrl} />

      {/* Main Case Study Container */}
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
