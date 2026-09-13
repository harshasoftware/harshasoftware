import type { Project } from '@/data/projects';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import { LiveTile } from './LiveTile';

export function ProjectSection({ project }: { project: Project }) {
  const { theme } = project;
  const headingId = `project-${project.id}-title`;

  if (project.layout === 'overlay') {
    return (
      <section className={cn('relative min-h-[646px] overflow-hidden', theme.bg, theme.fg)} aria-labelledby={headingId}>
        <LiveTile visual={project.id} poster={project.poster} bgClass={theme.bg} label={`${project.title} live preview`} />
        <h3
          id={headingId}
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center font-bold tracking-[-0.5px]',
            theme.titleFont === 'grotesk' ? 'font-grotesk text-[22px]' : 'text-[22px]',
          )}
        >
          {project.title}
        </h3>
      </section>
    );
  }

  return (
    <section className={cn('flex min-h-[646px] flex-col', theme.bg, theme.fg)} aria-labelledby={headingId}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pb-8 pt-14 md:px-10 xl:px-16">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h3
            id={headingId}
            className={cn(
              'font-bold leading-[1.1] tracking-[-2px]',
              theme.titleFont === 'grotesk' ? 'font-grotesk text-[40px] md:text-[48px]' : 'text-[42px] md:text-[50px]',
            )}
          >
            {project.title}
          </h3>
          {project.subtitle && (
            <p className={cn('mt-3 text-[20px] font-medium leading-[1.4] tracking-[-0.5px] md:text-[24px]', theme.muted)}>{project.subtitle}</p>
          )}
          {project.description && (
            <p className={cn('mt-4 text-[18px] font-medium leading-[1.5] tracking-[-0.4px] md:text-[22px]', theme.muted)}>{project.description}</p>
          )}
          {project.cta && (
            <a
              href={project.cta.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'mt-6 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-[14px] font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
                theme.cta ?? 'bg-chip text-body',
              )}
            >
              {project.cta.label}
            </a>
          )}
        </Reveal>

        <div className="relative mt-10 h-[400px] shrink-0 md:h-[440px]">
          <LiveTile visual={project.id} poster={project.poster} bgClass={theme.bg} label={`${project.title} live preview`} />
        </div>
      </div>
    </section>
  );
}
