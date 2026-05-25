'use client';

import { useEffect, useRef, useState } from 'react';
import { FaUsers, FaShoppingBag, FaTruck, FaSmile } from 'react-icons/fa';
import type { IconType } from 'react-icons';

type Stat = {
  icon: IconType;
  value: number;
  suffix: string;
  label: string;
};

const stats: Stat[] = [
  { icon: FaUsers,       value: 50000, suffix: '+', label: 'Happy Customers'   },
  { icon: FaShoppingBag, value: 10000, suffix: '+', label: 'Products Sold'     },
  { icon: FaTruck,       value:   120, suffix: '+', label: 'Cities Served'     },
  { icon: FaSmile,       value:    98, suffix: '%', label: 'Satisfaction Rate' },
];

function useCountUp(target: number, start: boolean, duration = 1800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return v;
}

function StatCard({ icon: Icon, value, suffix, label, visible }: Stat & { visible: boolean }) {
  const v = useCountUp(value, visible);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm transition-shadow duration-500 hover:shadow-xl">
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#088178]/5 transition-colors group-hover:bg-[#088178]/10" />
      <div className="relative">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#088178]/10 text-[#088178]">
          <Icon className="text-2xl" />
        </div>
        <div className="mt-4 text-3xl md:text-4xl font-extrabold tabular-nums text-gray-900">
          {v.toLocaleString()}
          {suffix}
        </div>
        <p className="mt-1 text-sm md:text-base text-gray-600">{label}</p>
      </div>
    </div>
  );
}

export default function TrustedStats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="px-6 md:px-10 py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-sm font-semibold tracking-widest text-[#088178] uppercase">By the Numbers</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">Trusted by Shoppers Worldwide</h2>
          <p className="mt-3 max-w-xl mx-auto text-gray-600">
            A growing community choosing Joy-Mart for quality, value, and a delightful shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
