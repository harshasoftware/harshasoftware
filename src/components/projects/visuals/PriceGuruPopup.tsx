import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import type { LiveVisualProps } from './types';
import { img } from '@/lib/images';
import { cn } from '@/lib/cn';

interface Deal {
  id: string;
  store: string;
  product: string;
  listed: number;
  best: number;
  stores: number;
}

const DEALS: Deal[] = [
  { id: 'd1', store: 'amazon.com', product: 'Sony WH-1000XM5 Headphones', listed: 399, best: 328, stores: 12 },
  { id: 'd2', store: 'bestbuy.com', product: 'Dyson V15 Detect Vacuum', listed: 749, best: 599, stores: 9 },
  { id: 'd3', store: 'target.com', product: 'Lego Icons Orchid 10311', listed: 49.99, best: 39.99, stores: 14 },
];

const money = (n: number) => `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`;

function PriceGuruPopup({ active }: LiveVisualProps) {
  const [i, setI] = useState(0);
  const [scan, setScan] = useState(0);
  const deal = DEALS[i];

  // Scanning progress + deal rotation; both stop when the tile is offscreen.
  useEffect(() => {
    if (!active) return;
    const tick = window.setInterval(() => setScan((s) => (s >= 100 ? 0 : s + 4)), 120);
    const rotate = window.setInterval(() => {
      setI((n) => (n + 1) % DEALS.length);
      setScan(0);
    }, 4200);
    return () => {
      window.clearInterval(tick);
      window.clearInterval(rotate);
    };
  }, [active]);

  const saved = deal.listed - deal.best;
  const pct = Math.round((saved / deal.listed) * 100);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
      <div className="relative flex w-full max-w-[860px] items-center justify-center gap-6 px-4 md:gap-14">
        {/* mascot */}
        <motion.img
          src={img('projects/priceguru-avatar.webp', { w: 480 })}
          alt=""
          width={240}
          height={240}
          className="hidden w-[180px] drop-shadow-[0_24px_30px_rgba(0,0,0,0.25)] md:block md:w-[240px]"
          animate={active ? { y: [-8, 8, -8] } : { y: 0 }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* extension popup */}
        <motion.div
          className="w-[340px] overflow-hidden rounded-2xl bg-white text-body shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/10"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
            <img src={img('projects/priceguru-avatar.webp', { w: 160 })} alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold leading-tight">Price Guru</p>
              <p className="truncate text-[11px] text-neutral-500">on {deal.store}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
              <span className={cn('size-1.5 rounded-full bg-emerald-500', active && 'motion-safe:animate-pulse')} />
              IPFS
            </span>
          </div>

          <div className="px-4 py-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <p className="text-[13px] font-semibold leading-snug">{deal.product}</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] text-neutral-500 line-through">{money(deal.listed)}</p>
                    <p className="text-[28px] font-bold leading-none tracking-tight text-emerald-600">{money(deal.best)}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-[12px] font-bold text-amber-800">
                    <Tag className="size-3.5" /> Save {pct}%
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="size-3.5 text-amber-500" />
                  Scanning {deal.stores} stores…
                </span>
                <span>{Math.min(scan, 100)}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" animate={{ width: `${scan}%` }} transition={{ ease: 'linear', duration: 0.12 }} />
              </div>
            </div>

            <ul className="mt-4 space-y-1.5 text-[11px] text-neutral-600">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-600" /> Price history pinned to IPFS
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-emerald-600" /> No tracking, verified on-chain
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default memo(PriceGuruPopup);
