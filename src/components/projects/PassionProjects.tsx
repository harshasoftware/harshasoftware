import { projects } from '@/data/projects';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectSection } from './ProjectSection';

export function PassionProjects() {
  return (
    <div aria-labelledby="passion-projects-title">
      <div className="bg-white px-6 pb-14 pt-10">
        <Reveal>
          <h2 id="passion-projects-title" className="text-center text-[42px] font-bold leading-none tracking-[-2.1px] text-ink md:text-[50px]">
            Passion Projects
          </h2>
        </Reveal>
      </div>
      {projects.map((project) => (
        <ProjectSection key={project.id} project={project} />
      ))}
    </div>
  );
}
