import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FaArrowRight, FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import { blogPosts, blogTopics } from '@/src/data/blogPosts';

export const metadata: Metadata = {
  title: 'Blog · Joy-Mart',
  description:
    'Style insights, behind-the-scenes stories, savings strategies, and care guides from the Joy-Mart team.',
};

export default function BlogIndexPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="bg-white">
      {/* Page header */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-6 md:px-10 py-14 md:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#088178]">
            The Joy-Mart Journal
          </span>
          <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900">
            Style, Stories &amp; Smart Shopping
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            Editorial picks, behind-the-scenes from our sourcing team, and practical guides to help
            you shop better.
          </p>
        </div>
      </section>

      {/* Featured hero */}
      <section className="px-6 md:px-10 pb-10">
        <Link
          href={`/blog/${featured.slug}`}
          className="group mx-auto block max-w-7xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow duration-500 hover:shadow-2xl"
        >
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex flex-col justify-center p-7 md:p-12">
              <span className="mb-3 inline-block w-fit rounded-full bg-[#088178]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#088178]">
                Featured · {featured.tag}
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 transition-colors group-hover:text-[#088178]">
                {featured.title}
              </h2>
              <p className="mt-4 text-gray-600">{featured.excerpt}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <FaRegCalendarAlt /> {featured.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FaRegClock /> {featured.readTime}
                </span>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-[#088178] transition-all group-hover:gap-3">
                Read the story <FaArrowRight />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Browse by topic */}
      <section className="px-6 md:px-10 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Browse by Topic</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {blogTopics.map((t) => (
              <span
                key={t.name}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#088178] hover:text-[#088178] transition-colors"
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* All posts */}
      <section className="px-6 md:px-10 pb-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl md:text-3xl font-extrabold text-gray-900">All Articles</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-7">
            {rest.map((p) => (
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
                <div className="flex-1 flex flex-col p-6">
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
    </div>
  );
}
