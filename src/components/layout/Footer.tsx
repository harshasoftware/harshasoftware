import { site } from '@/data/site';
import { CalendarIcon, GitHubIcon, LinkedInIcon } from '@/components/icons/Brand';

const iconLinks = [
  { href: site.links.footerLinkedin, label: 'LinkedIn', Icon: LinkedInIcon },
  { href: site.links.footerCalendar, label: 'Schedule a call', Icon: CalendarIcon },
  { href: site.links.github, label: 'GitHub', Icon: GitHubIcon },
];

export function Footer() {
  return (
    <footer className="bg-black px-6 py-20 text-center">
      <ul className="mb-14 flex items-center justify-center gap-8">
        {iconLinks.map(({ href, label, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="block rounded-md text-[#7d7d7d] transition-colors hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Icon width={40} height={40} />
            </a>
          </li>
        ))}
      </ul>
      <p className="font-grotesk text-[16px] text-footer">{site.copyright}</p>
    </footer>
  );
}
