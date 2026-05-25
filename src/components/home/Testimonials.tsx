'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

type Review = {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
};

const testimonials: Review[] = [
  {
    name: 'Sarah Akter', role: 'Verified Buyer', avatar: '/img/people/1.png', rating: 5,
    text: "Joy-Mart's quality blew me away — the dress fit perfectly and arrived two days early. I've already placed two more orders!",
  },
  {
    name: 'Rakib Hossain', role: 'Verified Buyer', avatar: '/img/people/2.png', rating: 5,
    text: 'Smooth checkout, lightning-fast delivery in Dhaka, and the price was unbeatable. Customer support actually responded within minutes.',
  },
  {
    name: 'Nadia Rahman', role: 'Verified Buyer', avatar: '/img/people/3.png', rating: 4,
    text: 'Love the curated collections. The flash deals are real deals — I saved over 60% on my last order. Will keep coming back.',
  },
  {
    name: 'Imran Karim', role: 'Verified Buyer', avatar: '/img/people/1.png', rating: 5,
    text: 'Best shopping experience I have had online. The packaging was premium and the product matched the photos exactly.',
  },
  {
    name: 'Tasnim Jahan', role: 'Verified Buyer', avatar: '/img/people/2.png', rating: 5,
    text: 'Their AI assistant helped me pick the right size in seconds. So convenient. The new arrivals are always on trend.',
  },
  {
    name: 'Mehedi Hasan', role: 'Verified Buyer', avatar: '/img/people/3.png', rating: 5,
    text: "Returned an item once — process was painless and refund came in 24 hours. That's why I trust Joy-Mart.",
  },
];

const PAGE_SIZE = 3;

export default function Testimonials() {
  const pages = Math.ceil(testimonials.length / PAGE_SIZE);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPage((p) => (p + 1) % pages), 6000);
    return () => clearInterval(t);
  }, [pages]);

  const shown = testimonials.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="px-6 md:px-10 py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-sm font-semibold tracking-widest text-[#088178] uppercase">Loved by Customers</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">What Shoppers Say</h2>
          <p className="mt-3 max-w-xl mx-auto text-gray-600">
            Real reviews from real shoppers — see why Joy-Mart is their go-to destination.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {shown.map((t, i) => (
            <div
              key={`${page}-${i}`}
              className="testimonial-card relative rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <FaQuoteLeft className="absolute top-5 right-5 text-3xl text-[#088178]/15" />
              <div className="mb-3 flex items-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, k) => (
                  <FaStar key={k} className={k < t.rating ? '' : 'text-gray-200'} />
                ))}
              </div>
              <p className="leading-relaxed text-gray-700">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-5">
                <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-[#088178]/20">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={
                'h-2 rounded-full transition-all duration-300 ' +
                (i === page ? 'w-8 bg-[#088178]' : 'w-2 bg-gray-300 hover:bg-gray-400')
              }
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .testimonial-card {
          animation: testimonial-fade-in 0.6s ease-out both;
        }
        @keyframes testimonial-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
