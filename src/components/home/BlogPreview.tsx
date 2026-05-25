'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaRegCalendarAlt, FaRegClock, FaArrowRight } from 'react-icons/fa';
import { blogPosts } from '@/src/data/blogPosts';

export default function BlogPreview() {
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="px-6 md:px-10 py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-sm font-semibold tracking-widest text-[#088178] uppercase">From the Journal</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">Style Insights &amp; Stories</h2>
            <p className="mt-3 max-w-xl text-gray-600">
              Inspiration, guides, and behind-the-scenes from the Joy-Mart team.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-semibold text-[#088178] transition-all hover:gap-3"
          >
            View all articles <FaArrowRight />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-7">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#088178] backdrop-blur-sm">
                  {p.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <FaRegCalendarAlt /> {p.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FaRegClock /> {p.readTime}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-lg md:text-xl font-bold text-gray-900 transition-colors group-hover:text-[#088178]">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">{p.excerpt}</p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#088178] transition-all group-hover:gap-3">
                  Read more <FaArrowRight className="text-xs" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
