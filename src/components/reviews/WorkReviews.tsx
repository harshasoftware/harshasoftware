import { marqueeItems, type MarqueeItem } from '@/data/testimonials';
import { InfiniteMovingCards } from '@/components/ui/InfiniteMovingCards';
import { Reveal } from '@/components/ui/Reveal';
import { ReviewCard } from './ReviewCard';
import { ShoutoutCard } from './ShoutoutCard';

const keyOf = (item: MarqueeItem) => (item.kind === 'review' ? item.review.id : item.shoutout.id);

export function WorkReviews() {
  return (
    <section className="bg-white pb-16 pt-20" aria-labelledby="work-reviews-title">
      <Reveal>
        <h2 id="work-reviews-title" className="text-center text-[42px] font-bold leading-none tracking-[-2.1px] text-ink md:text-[50px]">
          Work Reviews
        </h2>
      </Reveal>
      <div className="mt-10">
        <InfiniteMovingCards
          items={marqueeItems}
          getKey={keyOf}
          renderItem={(item) => (item.kind === 'review' ? <ReviewCard review={item.review} /> : <ShoutoutCard shoutout={item.shoutout} />)}
          speed="slow"
          label="Work reviews"
        />
      </div>
    </section>
  );
}
