import { site } from '@/data/site';

const pill =
  'inline-flex items-center justify-center rounded-lg px-5 py-3 text-[14px] font-bold transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2';

export function HeroCard() {
  return (
    <div className="flex h-full flex-col justify-center px-6 py-14 md:px-12 xl:px-16 xl:py-20">
      <h1 className="font-display text-[38px] leading-none tracking-[-2.1px] text-black">
        {site.name} <span aria-hidden="true">👨🏾‍💻</span>
      </h1>
      <p className="mt-6 max-w-[420px] font-tag text-[31px] font-bold leading-[1.15] tracking-[-2.1px] text-black xl:text-[38px]">
        {site.tagline}
      </p>

      <h2 className="mt-12 text-[42px] font-bold leading-none tracking-[-2px] text-black md:text-[50px]">Get in touch</h2>

      <div className="mt-8 flex flex-col gap-4">
        <a
          href={site.links.schedule}
          target="_blank"
          rel="noreferrer"
          className={`${pill} w-full max-w-[320px] border-2 border-sky bg-white text-[18px] text-sky hover:bg-sky/5 focus-visible:outline-sky`}
        >
          Schedule a Call
        </a>
        <div className="flex flex-wrap gap-3">
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className={`${pill} bg-pill text-white focus-visible:outline-pill`}>
            LinkedIn
          </a>
          <a href={site.links.github} target="_blank" rel="noreferrer" className={`${pill} bg-pill text-white focus-visible:outline-pill`}>
            Github
          </a>
        </div>
        {/* Save Contact (vCard at /harsha.vcf) is hidden for now at the owner's request. */}
      </div>
    </div>
  );
}
