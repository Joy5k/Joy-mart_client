'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import { blogPosts } from '@/src/data/blogPosts';

export default function EditorialPick() {
  // Pull the 3rd–5th posts so this section feels distinct from BlogPreview (which uses 1–3).
  const [main, ...sidePosts] = blogPosts.slice(2, 5);

  return (
    <section className="px-6 md:px-10 py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-[#088178]">
              Editor&apos;s Picks
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">
              The Stories We&apos;re Reading
            </h2>
            <p className="mt-3 max-w-xl text-gray-600">
              Handpicked features from the Joy-Mart Journal — the ones we keep coming back to.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-semibold text-[#088178] transition-all hover:gap-3"
          >
            Explore the Journal <FaArrowRight />
          </Link>
        </div>

        <div className="grid gap-5 md:gap-7 lg:grid-cols-5">
          {/* Large featured editorial */}
          <Link
            href={`/blog/${main.slug}`}
            className="group relative col-span-1 block overflow-hidden rounded-3xl shadow-sm transition-shadow duration-500 hover:shadow-2xl lg:col-span-3"
          >
            <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[460px]">
              <Image
                src={main.image}
                alt={main.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                <span className="mb-3 inline-block w-fit rounded-full bg-[#088178] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                  Featured · {main.tag}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-white max-w-2xl">
                  {main.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm md:text-base text-white/85 line-clamp-2">
                  {main.excerpt}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-white/40">
                      <Image
                        src={main.author.avatar}
                        alt={main.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-white">{main.author.name}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5">
                    <FaRegCalendarAlt /> {main.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FaRegClock /> {main.readTime}
                  </span>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white opacity-90 transition-all group-hover:gap-3 group-hover:opacity-100">
                  Read the story <FaArrowRight />
                </span>
              </div>
            </div>
          </Link>

          {/* Two stacked picks */}
          <div className="flex flex-col gap-5 md:gap-7 lg:col-span-2">
            {sidePosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-1 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-square w-32 flex-shrink-0 overflow-hidden sm:w-40 md:w-44">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="200px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-4 md:p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#088178]">
                    {p.tag}
                  </span>
                  <h4 className="mt-1.5 line-clamp-2 text-base md:text-lg font-bold text-gray-900 transition-colors group-hover:text-[#088178]">
                    {p.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <FaRegClock className="text-[10px]" /> {p.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
