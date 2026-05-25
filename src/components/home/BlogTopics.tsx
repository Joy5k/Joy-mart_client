'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { blogTopics, blogPosts } from '@/src/data/blogPosts';

export default function BlogTopics() {
  // Count posts per topic so each card can show a real article count.
  const counts = blogPosts.reduce<Record<string, number>>((acc, p) => {
    acc[p.topic] = (acc[p.topic] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="px-6 md:px-10 py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#088178]">
            Explore the Journal
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">
            Browse by Topic
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-gray-600">
            Whether you&apos;re after style direction, savings strategies, or care tips — start here.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {blogTopics.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link
                href="/blog"
                className="group relative block overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-[#088178]/85 group-hover:via-[#088178]/40" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
                    {counts[t.name] ?? 0} articles
                  </span>
                  <h3 className="mt-1 text-xl md:text-2xl font-bold text-white">{t.name}</h3>
                  <p className="mt-1 text-sm text-white/85">{t.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-white opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    Browse topic <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
