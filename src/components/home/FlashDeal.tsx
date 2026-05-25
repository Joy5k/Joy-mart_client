'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBolt, FaArrowRight } from 'react-icons/fa';

function nextMidnight() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

export default function FlashDeal() {
  const [endsAt] = useState<number>(() => nextMidnight());
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, endsAt - now);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff / 60_000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const units = [
    { label: 'Hours',   v: hours },
    { label: 'Minutes', v: minutes },
    { label: 'Seconds', v: seconds },
  ];

  return (
    <section className="px-6 md:px-10 py-16 md:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#055b55] via-[#088178] to-[#0aa291] max-w-7xl mx-auto">
        {/* Decorative blurred orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid lg:grid-cols-2 gap-10 items-center p-8 md:p-14">
          {/* Left content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
              <FaBolt className="text-yellow-300" /> Flash Deal of the Day
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight text-white">
              Up to 70% Off —<br /> But Only for Today.
            </h2>
            <p className="mt-4 max-w-md text-base md:text-lg text-white/85">
              Stack the season&apos;s biggest discounts before the timer runs out. Free shipping on orders over $50.
            </p>

            <div className="mt-6 flex gap-3 md:gap-4">
              {units.map((t) => (
                <div
                  key={t.label}
                  className="min-w-[78px] rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center backdrop-blur-sm"
                >
                  <div className="text-3xl md:text-4xl font-extrabold tabular-nums text-white">
                    {String(t.v).padStart(2, '0')}
                  </div>
                  <div className="mt-1 text-[10px] md:text-xs uppercase tracking-wider text-white/70">
                    {t.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#088178] shadow-lg transition hover:bg-gray-100"
            >
              Grab the Deal
              <FaArrowRight />
            </Link>
          </div>

          {/* Right product visual */}
          <div className="relative h-64 md:h-96">
            <div className="absolute inset-0 m-auto h-56 w-56 md:h-80 md:w-80 rounded-full bg-white/15 blur-2xl" />
            <Image
              src="/img/products/n3.jpg"
              alt="Flash deal featured product"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 1024px) 80vw, 40vw"
            />
            <div className="absolute top-2 right-2 md:top-6 md:right-6 rotate-6 rounded-full bg-yellow-400 px-4 py-2 text-sm font-extrabold text-gray-900 shadow-xl">
              -70%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
