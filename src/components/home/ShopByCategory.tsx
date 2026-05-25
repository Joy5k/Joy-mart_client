'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Fashion',      count: 240, image: '/img/banner/b1.jpg',  href: '/shop?category=fashion' },
  { name: 'Electronics',  count: 180, image: '/img/banner/b2.jpg',  href: '/shop?category=electronics' },
  { name: 'Footwear',     count: 120, image: '/img/banner/b4.jpg',  href: '/shop?category=footwear' },
  { name: 'Home & Living', count: 90, image: '/img/banner/b7.jpg',  href: '/shop?category=home' },
  { name: 'Accessories',  count: 160, image: '/img/banner/b10.jpg', href: '/shop?category=accessories' },
  { name: 'Beauty',       count:  75, image: '/img/banner/b16.jpg', href: '/shop?category=beauty' },
];

export default function ShopByCategory() {
  return (
    <section className="px-6 md:px-10 py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-sm font-semibold tracking-widest text-[#088178] uppercase">Explore Joy-Mart</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">Shop by Category</h2>
          <p className="mt-3 max-w-xl mx-auto text-gray-600">
            Handpicked collections curated to match every style, mood, and moment.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={c.href}
                className="group relative block aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-shadow duration-500"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="text-xs font-medium text-white/80">{c.count}+ products</span>
                  <h3 className="mt-1 text-xl md:text-2xl font-bold text-white">{c.name}</h3>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-white opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Shop now
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
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
