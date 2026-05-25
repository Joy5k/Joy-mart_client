export type BlogAuthor = {
  name: string;
  avatar: string;
  role?: string;
};

export type BlogTopic =
  | 'Style Guide'
  | 'Inside Joy-Mart'
  | 'Savings'
  | 'Trends'
  | 'Sustainability'
  | 'Care Guide';

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  topic: BlogTopic;
  tag: string;
  featured?: boolean;
  author: BlogAuthor;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'wardrobe-essentials-every-season',
    title: '7 Wardrobe Essentials for Every Season',
    excerpt:
      'Build a timeless capsule wardrobe with pieces that work all year round — without breaking the bank.',
    image: '/img/blog/b1.jpg',
    date: 'May 18, 2026',
    readTime: '5 min read',
    topic: 'Style Guide',
    tag: 'Style Guide',
    featured: true,
    author: {
      name: 'Sarah Akter',
      role: 'Senior Editor',
      avatar: '/img/people/1.png',
    },
    content: `
      <p class="mb-5 text-lg leading-relaxed">A great wardrobe is built on a foundation of pieces that work hard — across seasons, occasions, and moods. Forget trend-chasing for a moment and invest in the items that will quietly make every outfit better.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">1. The Perfect White Tee</h2>
      <p class="mb-5 leading-relaxed">Look for a medium-weight cotton with a clean neckline. It should hold its shape after 30+ washes. This is the single most-worn piece in any wardrobe — make it count.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">2. Slim-Fit Dark Denim</h2>
      <p class="mb-5 leading-relaxed">Dark indigo or black wash dresses up and down effortlessly. Pair with a blazer for dinner, sneakers for the weekend.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">3. A Tailored Blazer</h2>
      <p class="mb-5 leading-relaxed">Navy or charcoal in a year-round wool. The shoulders are the most important fit point — everything else can be tailored.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">4. White Leather Sneakers</h2>
      <p class="mb-5 leading-relaxed">Clean, minimal, leather. They look polished with chinos and easy with shorts. Replace when they start to grey — they always do.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">5. A Trench Coat</h2>
      <p class="mb-5 leading-relaxed">The single most versatile outerwear piece ever made. Layer over knits in autumn, throw over a dress in spring.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">6. A Crewneck Knit</h2>
      <p class="mb-5 leading-relaxed">Merino wool gives you warmth without bulk. Wear under a blazer for office days, on its own for weekends.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">7. Classic Leather Belt</h2>
      <p class="mb-5 leading-relaxed">One brown, one black, both real leather. Match to your shoes and you're set for a decade.</p>

      <blockquote class="border-l-4 border-[#088178] pl-5 italic text-gray-600 my-8">
        Style isn't about owning more — it's about owning the right things. Build your foundation and the rest becomes easy.
      </blockquote>
    `,
  },
  {
    slug: 'behind-the-scenes-sourcing-quality',
    title: 'Behind the Scenes: How We Source Quality',
    excerpt:
      'From fabric to factory — how Joy-Mart ensures every product meets the bar before reaching your doorstep.',
    image: '/img/blog/b3.jpg',
    date: 'May 12, 2026',
    readTime: '4 min read',
    topic: 'Inside Joy-Mart',
    tag: 'Inside Joy-Mart',
    featured: true,
    author: {
      name: 'Rakib Hossain',
      role: 'Head of Sourcing',
      avatar: '/img/people/2.png',
    },
    content: `
      <p class="mb-5 text-lg leading-relaxed">Every product at Joy-Mart goes through a four-stage vetting process before it's listed. Here's a look inside the process.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Stage 1 — Material Audit</h2>
      <p class="mb-5 leading-relaxed">We start with the raw material: fabric GSM, fibre composition, dye certification. If the foundation isn't right, nothing built on it will be.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Stage 2 — Factory Visit</h2>
      <p class="mb-5 leading-relaxed">Our sourcing team visits every new factory in person. We check stitching density, working conditions, and quality-control checkpoints on the line.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Stage 3 — Wash &amp; Wear Testing</h2>
      <p class="mb-5 leading-relaxed">Sample products are washed 30+ times and worn for a month. Anything that pills, shrinks, or fades visibly is sent back for revision.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Stage 4 — Real Customer Pilot</h2>
      <p class="mb-5 leading-relaxed">Before a full launch, we ship to a small pilot group and collect honest feedback. Only products with 4.5+ stars from pilots get the full Joy-Mart listing.</p>

      <p class="mb-5 leading-relaxed">It's not the fastest way to build a catalogue — but it's how we make sure that what you order actually arrives looking like the photo.</p>
    `,
  },
  {
    slug: '10-smart-shopping-tips-2026',
    title: '10 Smart Shopping Tips to Save in 2026',
    excerpt:
      'Maximize coupons, flash sales, and bundles. Our top strategies for the savviest online shoppers.',
    image: '/img/blog/b5.jpg',
    date: 'May 4, 2026',
    readTime: '6 min read',
    topic: 'Savings',
    tag: 'Savings',
    featured: true,
    author: {
      name: 'Nadia Rahman',
      role: 'Deals Editor',
      avatar: '/img/people/3.png',
    },
    content: `
      <p class="mb-5 text-lg leading-relaxed">Smart shopping isn't about chasing the lowest price — it's about getting the most value per dollar. Here are ten habits that consistently save us money.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">1. Use a Wishlist as a Cooling-Off Period</h2>
      <p class="mb-5 leading-relaxed">Add the item, wait 48 hours. Half the time you'll realise you don't actually need it. The other half, you'll find a coupon waiting.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">2. Stack Flash Deals With Newsletter Codes</h2>
      <p class="mb-5 leading-relaxed">Signing up for the Joy-Mart newsletter usually gets you a 10% welcome code — which often stacks on flash deals.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">3. Shop the Bundle, Not the Item</h2>
      <p class="mb-5 leading-relaxed">A bundle of 3 essentials at 25% off beats one item at 30% off, every time.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">4. Check Free-Shipping Thresholds</h2>
      <p class="mb-5 leading-relaxed">If shipping is $7 and free over $50, adding a $15 item often costs less than paying shipping on a smaller order.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">5. Use AI Assistant for Size Help</h2>
      <p class="mb-5 leading-relaxed">Returns are expensive in time and emissions. Ask our AI assistant for size guidance before ordering — you'll get it right the first time.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">6. Watch the End-of-Season Drop</h2>
      <p class="mb-5 leading-relaxed">The final 10 days of any season have the deepest discounts. If you don't need it today, wait.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">7. Buy Out of Season</h2>
      <p class="mb-5 leading-relaxed">Winter coats in March. Swimwear in October. Your patience is the discount.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">8. Read the Reviews</h2>
      <p class="mb-5 leading-relaxed">Filter to 3-star reviews — they're the most honest. They'll tell you exactly who an item works for and who it doesn't.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">9. Track Price History</h2>
      <p class="mb-5 leading-relaxed">If "50% off" was the price two weeks ago and is again next month, it isn't really a sale.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">10. Bookmark the Joy-Mart Outlet</h2>
      <p class="mb-5 leading-relaxed">Returned-but-unworn items, sample-sale stock, and last-of-line pieces — often at 60%+ off the original.</p>
    `,
  },
  {
    slug: 'spring-color-palette-2026',
    title: 'The Spring 2026 Color Palette — Decoded',
    excerpt:
      'From sage to coral — the six shades defining the season and how to wear them without trying too hard.',
    image: '/img/blog/b2.jpg',
    date: 'April 26, 2026',
    readTime: '5 min read',
    topic: 'Trends',
    tag: 'Trends',
    author: {
      name: 'Tasnim Jahan',
      role: 'Trend Writer',
      avatar: '/img/people/2.png',
    },
    content: `
      <p class="mb-5 text-lg leading-relaxed">Spring 2026 leans soft and grounded — earthy neutrals with a single splash of brightness. Here's what's resonating and how to wear it.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Sage Green</h2>
      <p class="mb-5 leading-relaxed">A wearable green that flatters most skin tones. Try a sage button-down with white linen pants — instant springtime.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Buttercream</h2>
      <p class="mb-5 leading-relaxed">Softer than ivory, warmer than off-white. Works beautifully against denim or as a head-to-toe monochrome statement.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Coral Pop</h2>
      <p class="mb-5 leading-relaxed">The single accent color of the season. Use it on accessories — a bag, a belt, sneakers — to lift any neutral outfit.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Stone</h2>
      <p class="mb-5 leading-relaxed">A grown-up beige with grey undertones. Replace any black piece in your wardrobe with stone for an instantly fresher feel.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Soft Cobalt</h2>
      <p class="mb-5 leading-relaxed">Less moody than navy, more dignified than royal. Works in tailoring and knitwear alike.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Terracotta</h2>
      <p class="mb-5 leading-relaxed">The brick-meets-clay warm neutral. Pairs perfectly with sage and stone for a full-look palette.</p>
    `,
  },
  {
    slug: 'sustainable-fabrics-guide',
    title: "A Beginner's Guide to Sustainable Fabrics",
    excerpt:
      'Organic cotton, Tencel, recycled poly — what they actually mean, and how to spot greenwashing in the label.',
    image: '/img/blog/b4.jpg',
    date: 'April 14, 2026',
    readTime: '7 min read',
    topic: 'Sustainability',
    tag: 'Sustainability',
    author: {
      name: 'Imran Karim',
      role: 'Sustainability Lead',
      avatar: '/img/people/1.png',
    },
    content: `
      <p class="mb-5 text-lg leading-relaxed">"Sustainable" gets thrown around a lot. Here's a practical primer on what to look for on the label — and what to ignore.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Organic Cotton</h2>
      <p class="mb-5 leading-relaxed">Grown without synthetic pesticides. Look for GOTS or OCS certification on the label — those are the credible standards. Without certification, "organic" can mean almost anything.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Tencel (Lyocell)</h2>
      <p class="mb-5 leading-relaxed">A wood-pulp fibre made in a closed-loop process — 99% of the solvents are reused. Drapes beautifully, breathes well, biodegrades when its life is done.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Recycled Polyester</h2>
      <p class="mb-5 leading-relaxed">Made from discarded PET bottles or fabric scraps. Saves energy vs virgin poly but still sheds microplastics — wash in a Guppyfriend bag.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Linen</h2>
      <p class="mb-5 leading-relaxed">Flax is naturally low-input — needs little water, no pesticides, biodegrades quickly. It wrinkles, but that's part of the charm.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">What to Skip</h2>
      <ul class="list-disc pl-6 mb-6 space-y-2 leading-relaxed">
        <li>"Conscious" or "eco" without specifics — usually marketing.</li>
        <li>Blends where the recycled portion is under 30%.</li>
        <li>Anything that doesn't tell you the fibre composition at all.</li>
      </ul>
    `,
  },
  {
    slug: 'sneaker-care-101',
    title: 'Sneaker Care 101 — Make Them Last 3 Years',
    excerpt:
      'Five small habits that triple the life of your favourite pair. Yes, including how to actually wash them.',
    image: '/img/blog/b6.jpg',
    date: 'April 2, 2026',
    readTime: '4 min read',
    topic: 'Care Guide',
    tag: 'Care Guide',
    author: {
      name: 'Mehedi Hasan',
      role: 'Product Specialist',
      avatar: '/img/people/3.png',
    },
    content: `
      <p class="mb-5 text-lg leading-relaxed">Sneakers don't have to be disposable. With a few simple habits, a $90 pair will outlast three pairs of throwaways.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">1. Rotate Two Pairs</h2>
      <p class="mb-5 leading-relaxed">Foam soles need 24 hours to fully decompress between wears. A single pair worn daily compresses permanently within a year. Two pairs alternating last nearly three times as long.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">2. Use a Brush, Not a Washing Machine</h2>
      <p class="mb-5 leading-relaxed">A $4 suede brush + warm water + a drop of mild soap handles 90% of cleaning. The washing machine destroys glue lines and warps soles.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">3. Spray Once, Save for a Year</h2>
      <p class="mb-5 leading-relaxed">A waterproof spray on the first wear prevents stains from setting. Reapply every six months. Total cost: under $10.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">4. Stuff Them With Paper Overnight</h2>
      <p class="mb-5 leading-relaxed">Paper draws moisture and helps the shoe hold its shape. Crumple, don't roll. Replace with cedar shoe trees if you want to go pro.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">5. Never Air-Dry in Sun</h2>
      <p class="mb-5 leading-relaxed">Direct sun yellows midsoles and dries out leather. Air-dry in the shade — slow but kind.</p>
    `,
  },
];

export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.featured);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return blogPosts.slice(0, limit);
  return blogPosts
    .filter((p) => p.slug !== slug && p.topic === current.topic)
    .concat(blogPosts.filter((p) => p.slug !== slug && p.topic !== current.topic))
    .slice(0, limit);
}

export const blogTopics: { name: BlogTopic; image: string; description: string }[] = [
  { name: 'Style Guide',     image: '/img/blog/b1.jpg', description: 'Build a wardrobe you love' },
  { name: 'Trends',          image: '/img/blog/b2.jpg', description: "What's defining the season" },
  { name: 'Inside Joy-Mart', image: '/img/blog/b3.jpg', description: 'Stories from the team' },
  { name: 'Sustainability',  image: '/img/blog/b4.jpg', description: 'Conscious choices, made simple' },
  { name: 'Savings',         image: '/img/blog/b5.jpg', description: 'Shop smarter, spend less' },
  { name: 'Care Guide',      image: '/img/blog/b6.jpg', description: 'Make every piece last' },
];
