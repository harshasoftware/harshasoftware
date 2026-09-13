import type { Shoutout } from '@/data/testimonials';

const card =
  'flex h-auto w-[80vw] max-w-[380px] items-center rounded-2xl border border-neutral-200 bg-neutral-50 p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 motion-safe:hover:-translate-y-1 hover:border-neutral-300 hover:bg-white hover:shadow-[0_18px_40px_rgba(0,0,0,0.10)] md:w-[380px]';

export function ShoutoutCard({ shoutout }: { shoutout: Shoutout }) {
  const text = shoutout.quoted ? `“${shoutout.text}”` : shoutout.text;
  return (
    <article className={card}>
      <p className="text-[21px] font-medium leading-[1.5] tracking-[-0.6px] text-body">
        <span aria-hidden="true" className="mr-2">
          💬
        </span>
        {text}
      </p>
    </article>
  );
}
