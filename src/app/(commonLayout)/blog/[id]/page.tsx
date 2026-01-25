import { FaCalendarAlt, FaUser, FaTags, FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin, FaPinterest } from 'react-icons/fa'
import { IoMdShareAlt } from 'react-icons/io'
import Link from 'next/link'
import sanitizeHTML from '@/src/utils/htmlSanitizer'

function BlogDetails() {
  // Mock blog data with online placeholder images
  const blogPost = {
    id: 1,
    title: 'JavaScript Closures Explained: From Child to Advanced Concepts',
    content: `
      <p class="mb-4">Closures are one of JavaScript's most powerful yet misunderstood concepts. In this deep dive, we'll explore closures from basic understanding to advanced implementations.</p>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">What is a Closure?</h2>
      <p class="mb-4">A closure is a function that has access to its own scope, the outer function's variables, and global variables—even after the outer function has returned.</p>

      <div class="bg-[#088178]/10 p-6 rounded-lg my-6">
        <h3 class="font-bold text-[#088178] mb-2">Simple Example</h3>
        <pre class="bg-gray-800 text-white p-4 rounded overflow-x-auto">
          <code>
  function outer() {
    const outerVar = 'I am outside!';

    function inner() {
      console.log(outerVar); // Accesses outerVar
    }

    return inner;
  }

  const closureFn = outer();
  closureFn(); // Logs: "I am outside!"
          </code>
        </pre>
      </div>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">How Closures Work</h2>
      <p class="mb-4">When a function is created, it carries with it a reference to its lexical environment. This combination of the function and its environment is called a closure.</p>

      <h3 class="font-bold text-lg my-4 text-[#088178]">Key Characteristics</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Preserves the scope chain</li>
        <li>Remembers variables even after outer function execution</li>
        <li>Creates private variables in JavaScript</li>
      </ul>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Practical Use Cases</h2>

      <h3 class="font-bold text-lg my-4 text-[#088178]">1. Data Encapsulation</h3>
      <p class="mb-4">Closures help create private variables and methods:</p>
      <pre class="bg-gray-800 text-white p-4 rounded overflow-x-auto mb-6">
        <code>
  function createCounter() {
    let count = 0;

    return {
      increment: function() { count++; },
      getCount: function() { return count; }
    };
  }

  const counter = createCounter();
  counter.increment();
  console.log(counter.getCount()); // 1
  console.log(counter.count); // undefined (private)
        </code>
      </pre>

      <h3 class="font-bold text-lg my-4 text-[#088178]">2. Function Factories</h3>
      <p class="mb-4">Create specialized functions based on parameters:</p>
      <pre class="bg-gray-800 text-white p-4 rounded overflow-x-auto mb-6">
        <code>
  function multiplier(factor) {
    return function(x) {
      return x * factor;
    };
  }

  const double = multiplier(2);
  const triple = multiplier(3);

  console.log(double(5)); // 10
  console.log(triple(5)); // 15
        </code>
      </pre>

      <h3 class="font-bold text-lg my-4 text-[#088178]">3. Event Handlers</h3>
      <p class="mb-4">Maintain state in event callbacks:</p>
      <pre class="bg-gray-800 text-white p-4 rounded overflow-x-auto mb-6">
        <code>
  function setupButtons() {
    const buttons = document.querySelectorAll('button');

    for (var i = 0; i < buttons.length; i++) {
      (function(index) {
        buttons[index].addEventListener('click', function() {
          console.log('Button ' + index + ' clicked');
        });
      })(i);
    }
  }
        </code>
      </pre>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Advanced Closure Patterns</h2>

      <h3 class="font-bold text-lg my-4 text-[#088178]">1. Module Pattern</h3>
      <p class="mb-4">Create self-contained modules with private and public access:</p>
      <pre class="bg-gray-800 text-white p-4 rounded overflow-x-auto mb-6">
        <code>
  const myModule = (function() {
    const privateVar = 'I am private';

    function privateMethod() {
      console.log(privateVar);
    }

    return {
      publicMethod: function() {
        privateMethod();
      }
    };
  })();

  myModule.publicMethod(); // "I am private"
  myModule.privateMethod(); // Error: private
        </code>
      </pre>

      <h3 class="font-bold text-lg my-4 text-[#088178]">2. Memoization</h3>
      <p class="mb-4">Cache expensive function calls:</p>
      <pre class="bg-gray-800 text-white p-4 rounded overflow-x-auto mb-6">
        <code>
  function memoize(fn) {
    const cache = {};

    return function(...args) {
      const key = JSON.stringify(args);
      if (cache[key]) {
        return cache[key];
      }
      const result = fn.apply(this, args);
      cache[key] = result;
      return result;
    };
  }

  const factorial = memoize(function(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
  });
        </code>
      </pre>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Common Pitfalls</h2>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Accidentally creating closures in loops (use let instead of var)</li>
        <li>Memory leaks from holding references to large objects</li>
        <li>Overusing closures when simpler solutions exist</li>
      </ul>

      <h2 class="text-2xl font-bold my-6 text-[#088178]">Final Thoughts</h2>
      <p class="mb-4">Mastering closures will give you a deeper understanding of JavaScript's execution context and scope chain. They're fundamental to many patterns and frameworks in modern JavaScript development.</p>
    `,
    date: 'June 10, 2023',
    author: 'Alex Johnson',
    category: 'JavaScript',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    readTime: '10 min read',
    tags: ['javascript', 'closures', 'advanced', 'scope']
  }

  // Mock comments with online avatars
  const comments = [
    {
      id: 1,
      name: 'Sarah Developer',
      date: 'June 12, 2023',
      content: 'This is the clearest explanation of closures I\'ve ever read! The practical examples really helped solidify my understanding.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Mike CodeSmith',
      date: 'June 15, 2023',
      content: 'Could you expand more on how closures interact with garbage collection? When do closed-over variables get cleaned up?',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Emma JS',
      date: 'June 20, 2023',
      content: 'The memoization example was a game-changer for me. I immediately applied this pattern to optimize some expensive calculations in my app!',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ]

  const relatedPosts = [
    {
      id: 2,
      title: 'Mastering JavaScript Scope and Hoisting',
      date: 'May 28, 2023',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
    },
    {
      id: 4,
      title: 'The Complete Guide to JavaScript Promises',
      date: 'July 5, 2023',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80'
    },
    {
      id: 6,
      title: 'Understanding JavaScript Event Loop',
      date: 'August 10, 2023',
      image: 'https://images.unsplash.com/photo-1542903660-eedba2cda473?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Blog Header */}
      <div className="bg-[#088178] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/blog" className="flex items-center text-white hover:text-gray-200">
              <FaArrowLeft className="mr-2" /> Back to Blog
            </Link>
            <div className="flex space-x-4">
              <span className="flex items-center">
                <FaCalendarAlt className="mr-2" /> {blogPost.date}
              </span>
              <span className="flex items-center">
                <FaUser className="mr-2" /> {blogPost.author}
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blogPost.title}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20">
              <FaTags className="mr-1" />
              {blogPost.category}
            </span>
            <span className="text-white/80">{blogPost.readTime}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Blog Content */}
          <div className="lg:w-2/3">
            {/* Featured Image */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={blogPost.image} 
                alt={blogPost.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Blog Content */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm mb-8">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(blogPost.content) }}
              />
            </div>

            {/* Tags and Share */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-[#088178] mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map(tag => (
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
                <div>
                  <h3 className="font-bold text-[#088178] mb-2">Share:</h3>
                  <div className="flex space-x-3">
                    <button className="p-2 bg-gray-100 rounded-full text-[#088178] hover:bg-[#088178] hover:text-white transition-colors">
                      <FaFacebook />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-full text-[#088178] hover:bg-[#088178] hover:text-white transition-colors">
                      <FaTwitter />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-full text-[#088178] hover:bg-[#088178] hover:text-white transition-colors">
                      <FaLinkedin />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-full text-[#088178] hover:bg-[#088178] hover:text-white transition-colors">
                      <FaPinterest />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-full text-[#088178] hover:bg-[#088178] hover:text-white transition-colors">
                      <IoMdShareAlt />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-6 text-[#088178]">
                Comments ({comments.length})
              </h2>
              
              <div className="space-y-6">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <img 
                      src={comment.avatar} 
                      alt={comment.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold">{comment.name}</h4>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-[#088178]">Leave a Comment</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment *</label>
                  <textarea 
                    id="comment" 
                    rows={5}
                    required
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-transparent"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-[#088178] hover:bg-[#06605a] text-white font-medium rounded-lg transition-colors"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* About Author */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-[#088178]">About the Author</h3>
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/men/75.jpg" 
                  alt={blogPost.author}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold">{blogPost.author}</h4>
                  <p className="text-sm text-gray-600">Senior JavaScript Developer</p>
                </div>
              </div>
              <p className="text-gray-700">
                Alex has been working with JavaScript for over 8 years. He specializes in explaining complex concepts in simple terms and loves teaching through practical examples.
              </p>
            </div>

            {/* Related Posts */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-[#088178]">Related Posts</h3>
              <div className="space-y-4">
                {relatedPosts.map(post => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.id}`}
                    className="flex items-start space-x-3 group"
                  >
                    <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-[#088178] transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-[#088178] p-6 rounded-lg shadow-sm text-white">
              <h3 className="text-lg font-bold mb-2">Subscribe to Newsletter</h3>
              <p className="text-sm mb-4">Get the latest JavaScript tips and tutorials straight to your inbox.</p>
              <form className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button 
                  type="submit" 
                  className="w-full px-4 py-2 bg-white text-[#088178] font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetails