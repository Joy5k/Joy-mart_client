import Link from 'next/link'
import { FaCalendarAlt, FaUser, FaTags, FaArrowRight } from 'react-icons/fa'

function Blog() {
  // Mock blog data
  const blogPosts = [
    {
      id: 1,
      title: 'The Ultimate Guide to Sustainable Fashion',
      excerpt: 'Discover how to build a sustainable wardrobe without compromising on style or breaking the bank.',
      date: 'May 15, 2023',
      author: 'Sarah Johnson',
      category: 'Fashion',
      image: '/images/blog-1.jpg'
    },
    {
      id: 2,
      title: '10 Essential Items for Your Summer Wardrobe',
      excerpt: 'Our top picks for must-have clothing items that will keep you cool and stylish all summer long.',
      date: 'June 2, 2023',
      author: 'Michael Chen',
      category: 'Style Tips',
      image: '/images/blog-2.jpg'
    },
    {
      id: 3,
      title: 'How to Care for Your Denim Collection',
      excerpt: 'Learn the best practices for washing, drying, and storing your denim to make it last longer.',
      date: 'June 18, 2023',
      author: 'Emma Rodriguez',
      category: 'Care Guide',
      image: '/images/blog-3.jpg'
    },
    {
      id: 4,
      title: 'The Rise of Eco-Friendly Materials in Fashion',
      excerpt: 'Exploring innovative materials that are changing the fashion industry for the better.',
      date: 'July 5, 2023',
      author: 'David Kim',
      category: 'Sustainability',
      image: '/images/blog-4.jpg'
    },
    {
      id: 5,
      title: 'Accessorizing 101: Complete Any Outfit',
      excerpt: 'Simple tricks to elevate your look with the right accessories for any occasion.',
      date: 'July 22, 2023',
      author: 'Lisa Wong',
      category: 'Style Tips',
      image: '/images/blog-5.jpg'
    },
    {
      id: 6,
      title: 'Seasonal Color Palettes: What to Wear This Fall',
      excerpt: 'The perfect color combinations to try this autumn based on your skin tone and personal style.',
      date: 'August 10, 2023',
      author: 'James Wilson',
      category: 'Trends',
      image: '/images/blog-6.jpg'
    }
  ]

  const categories = ['All', 'Fashion', 'Style Tips', 'Care Guide', 'Sustainability', 'Trends']
  const popularPosts = blogPosts.slice(0, 3)
  const tags = ['Fashion', 'Style', 'Eco-Friendly', 'Wardrobe', 'Accessories', 'Denim', 'Summer', 'Winter', 'Colors']

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#088178] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover the latest fashion trends, style tips, and sustainable living advice from our experts.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Blog Posts */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="flex items-center mr-4">
                        <FaCalendarAlt className="mr-1 text-[#088178]" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <FaUser className="mr-1 text-[#088178]" />
                        {post.author}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 hover:text-[#088178] transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#088178]/10 text-[#088178]">
                        <FaTags className="mr-1" />
                        {post.category}
                      </span>
                      <Link 
                        href={`/blog/${post.id}`} 
                        className="flex items-center text-[#088178] hover:text-[#06605a] font-medium"
                      >
                        Read More <FaArrowRight className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-4 py-2 border rounded-md text-[#088178] border-[#088178] hover:bg-[#088178] hover:text-white transition-colors">
                  Previous
                </button>
                {[1, 2, 3].map(page => (
                  <button 
                    key={page}
                    className={`px-4 py-2 rounded-md ${page === 1 ? 'bg-[#088178] text-white' : 'text-[#088178] hover:bg-[#088178]/10'}`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-4 py-2 border rounded-md text-[#088178] border-[#088178] hover:bg-[#088178] hover:text-white transition-colors">
                  Next
                </button>
              </nav>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-[#088178]">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-transparent"
                />
                <button className="absolute right-2 top-2 text-[#088178]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-[#088178]">Categories</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category}>
                    <Link 
                      href="#" 
                      className="flex justify-between items-center py-2 text-gray-700 hover:text-[#088178] transition-colors"
                    >
                      <span>{category}</span>
                      <span className="bg-[#088178]/10 text-[#088178] text-xs px-2 py-1 rounded-full">
                        {blogPosts.filter(p => p.category === category || category === 'All').length}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-[#088178]">Popular Posts</h3>
              <div className="space-y-4">
                {popularPosts.map(post => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm hover:text-[#088178] transition-colors">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h4>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-[#088178]">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Link 
                    key={tag} 
                    href="#" 
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-[#088178] hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog