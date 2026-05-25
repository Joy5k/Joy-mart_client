import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  FaArrowLeft,
  FaArrowRight,
  FaRegCalendarAlt,
  FaRegClock,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaLink,
} from 'react-icons/fa';
import { blogPosts, getPostBySlug, getRelatedPosts } from '@/src/data/blogPosts';
import sanitizeHTML from '@/src/utils/htmlSanitizer';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Article not found · Joy-Mart' };
  return {
    title: `${post.title} · Joy-Mart`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  return (
    <article className="bg-white">
      {/* Hero */}
      <header className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col justify-end px-6 pb-10 md:px-10 md:pb-14">
          <Link
            href="/blog"
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <FaArrowLeft className="text-xs" /> Back to blog
          </Link>
          <span className="mb-3 inline-block w-fit rounded-full bg-[#088178] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            {post.tag}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/40">
                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
              </div>
              <div>
                <div className="font-semibold text-white">{post.author.name}</div>
                {post.author.role && (
                  <div className="text-xs text-white/70">{post.author.role}</div>
                )}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5">
              <FaRegCalendarAlt /> {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaRegClock /> {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-6 md:px-10 py-12 md:py-16">
        <div
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
        />

        {/* Share */}
        <div className="mt-12 flex items-center gap-3 border-t border-gray-100 pt-6">
          <span className="text-sm font-semibold text-gray-700">Share:</span>
          <Link
            href="#"
            aria-label="Share on Facebook"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-[#088178] hover:text-white"
          >
            <FaFacebook />
          </Link>
          <Link
            href="#"
            aria-label="Share on Twitter"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-[#088178] hover:text-white"
          >
            <FaTwitter />
          </Link>
          <Link
            href="#"
            aria-label="Share on LinkedIn"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-[#088178] hover:text-white"
          >
            <FaLinkedin />
          </Link>
          <Link
            href="#"
            aria-label="Copy link"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-[#088178] hover:text-white"
          >
            <FaLink />
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-white px-6 md:px-10 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-widest text-[#088178]">
                  Keep reading
                </span>
                <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900">
                  Related Articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-semibold text-[#088178] transition-all hover:gap-3"
              >
                All articles <FaArrowRight />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3 md:gap-7">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#088178] backdrop-blur-sm">
                      {r.tag}
                    </span>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <FaRegCalendarAlt /> {r.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <FaRegClock /> {r.readTime}
                      </span>
                    </div>
                    <h3 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#088178]">
                      {r.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{r.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
