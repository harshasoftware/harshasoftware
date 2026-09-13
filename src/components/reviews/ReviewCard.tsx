import type { Review } from '@/data/testimonials';
import { img } from '@/lib/images';

const card =
  'flex h-auto w-[86vw] max-w-[440px] flex-col justify-center rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition duration-300 motion-safe:hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.10)] md:w-[440px]';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className={card}>
      <header className="flex items-center gap-4">
        <img
          src={img(review.avatar, { w: 160 })}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="size-14 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <h3 className="text-[19px] font-bold leading-tight tracking-[-0.6px] text-body">{review.name}</h3>
          <p className="text-[15px] leading-snug text-body/75">{review.title}</p>
        </div>
      </header>
      <blockquote className="mt-4 whitespace-pre-line text-[15px] font-medium leading-[1.6] text-quote">{review.quote}</blockquote>
    </article>
  );
}
