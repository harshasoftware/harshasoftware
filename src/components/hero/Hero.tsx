import { heroPhotos } from '@/data/heroPhotos';
import { HeroCard } from './HeroCard';
import { HeroCarousel } from './HeroCarousel';

export function Hero() {
  return (
    <section className="bg-white" aria-label="Introduction">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <HeroCard />
        <HeroCarousel photos={heroPhotos} />
      </div>
    </section>
  );
}
