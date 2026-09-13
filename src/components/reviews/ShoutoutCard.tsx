import type { Shoutout } from '@/data/testimonials';

export function ShoutoutCard({ shoutout }: { shoutout: Shoutout }) {
  const text = shoutout.quoted ? `“${shoutout.text}”` : shoutout.text;
  return (
    <article className="flex h-full w-[80vw] max-w-[380px] items-center rounded-2xl border border-neutral-200 bg-neutral-50 p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:w-[380px]">
      <p className="text-[22px] font-medium leading-[1.5] tracking-[-0.7px] text-body">
        <span aria-hidden="true" className="mr-2">
          💬
        </span>
        {text}
      </p>
    </article>
  );
}
