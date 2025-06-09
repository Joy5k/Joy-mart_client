'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faStar, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch } from '@/src/redux/hooks'
import { addItem } from '@/src/redux/features/localstorage/wishlistSlice'

interface Product {
  id: number
  image: string
  brand: string
  name: string
  price: number
  category: string
  rating: number
  inStock: boolean
  discount?: number
}

const ProductCard = ({ product }: { product: any }) => {
  const dispatch = useAppDispatch()
  
  const handleAddToWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    dispatch(addItem(product))
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="pro group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image with zoom effect */}
        <div className="overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.name} 
            width={200} 
            height={250}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Quick actions (appear on hover) */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => handleAddToWishlist(e, product)} 
            className="w-6 h-6 bg-transparent rounded-full flex items-center justify-center shadow-md hover:bg-transparent transition-colors hover:cursor-pointer"
          >
            <FontAwesomeIcon icon={faHeart} className="text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Product info */}
        <div className="p-4 bg-white">
          <span className="text-gray-600 text-sm text-start">{product.brand}</span>
          <h5 className="font-semibold mt-1 text-gray-800 hover:text-green-600 transition-colors">
            {product.name}
          </h5>
          <div className="star flex mt-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon 
                key={i} 
                icon={faStar} 
                className={`w-4 h-4 hover:scale-125 transition-transform ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <div className="flex justify-between items-start mt-3">
            <div>
              {product.discount ? (
                <>
                  <span className="font-bold text-green-700">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">${product.price}</span>
                </>
              ) : (
                <span className="font-bold text-green-700">${product.price}</span>
              )}
            </div>
            
            {/* Add to cart button with bounce animation */}
            <div className="relative overflow-hidden">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-start justify-start shadow-md hover:bg-green-200 transition-all duration-300">
                <FontAwesomeIcon 
                  icon={faShoppingCart} 
                  className="text-green-700 hover:text-green-800 transition-colors"
                />
              </div>
              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-700 opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all duration-300">
                Add to Cart
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        {product.discount && (
          <div className="absolute top-5 left-4 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 animate-pulse">
            {product.discount}% OFF
          </div>
        )}
        {!product.inStock && (
          <div className="absolute top-5 left-4 bg-gray-500 text-white text-xs font-bold rounded-full px-2 py-1">
            SOLD OUT
          </div>
        )}
      </div>
    </Link>
  )
}

const ProductsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortOption, setSortOption] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/products')
        // const data = await response.json()
        
        // Mock data with more realistic products
        const mockProducts: Product[] = [
          // Sneakers
          { id: 1, image: '/images/sneakers-1.jpg', brand: 'Nike', name: 'Air Max 270', price: 150, category: 'Sneakers', rating: 4, inStock: true, discount: 10 },
          { id: 2, image: '/images/sneakers-2.jpg', brand: 'Adidas', name: 'Ultraboost 21', price: 180, category: 'Sneakers', rating: 5, inStock: true },
          { id: 3, image: '/images/sneakers-3.jpg', brand: 'Puma', name: 'RS-X', price: 110, category: 'Sneakers', rating: 3, inStock: true },
          
          // T-Shirts
          { id: 4, image: '/images/tshirt-1.jpg', brand: 'Nike', name: 'Dry Fit T-Shirt', price: 30, category: 'T-Shirts', rating: 4, inStock: true, discount: 15 },
          { id: 5, image: '/images/tshirt-2.jpg', brand: 'Adidas', name: 'Originals T-Shirt', price: 25, category: 'T-Shirts', rating: 4, inStock: true },
          { id: 6, image: '/images/tshirt-3.jpg', brand: 'Under Armour', name: 'Tech 2.0', price: 35, category: 'T-Shirts', rating: 5, inStock: false },
          
          // Hoodies
          { id: 7, image: '/images/hoodie-1.jpg', brand: 'Champion', name: 'Reverse Weave', price: 65, category: 'Hoodies', rating: 4, inStock: true },
          { id: 8, image: '/images/hoodie-2.jpg', brand: 'Nike', name: 'Sportswear Club', price: 55, category: 'Hoodies', rating: 3, inStock: true, discount: 20 },
          { id: 9, image: '/images/hoodie-3.jpg', brand: 'Adidas', name: 'Trefoil Hoodie', price: 60, category: 'Hoodies', rating: 4, inStock: true },
          
          // Accessories
          { id: 10, image: '/images/accessory-1.jpg', brand: 'Nike', name: 'Heritage Backpack', price: 45, category: 'Accessories', rating: 4, inStock: true },
          { id: 11, image: '/images/accessory-2.jpg', brand: 'Adidas', name: '3-Stripes Cap', price: 25, category: 'Accessories', rating: 3, inStock: true },
          { id: 12, image: '/images/accessory-3.jpg', brand: 'New Era', name: '9Fifty Snapback', price: 35, category: 'Accessories', rating: 5, inStock: false },
          
          // Add more products to reach 48 for pagination demo
          ...Array.from({ length: 36 }, (_, i) => ({
            id: i + 13,
            image: `/images/product-${(i % 6) + 1}.jpg`,
            brand: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance'][i % 6],
            name: ['Running Shoes', 'T-Shirt', 'Hoodie', 'Shorts', 'Cap', 'Socks'][i % 6] + ' ' + (i + 13),
            price: Math.round(Math.random() * 900 + 100),
            category: ['Sneakers', 'T-Shirts', 'Hoodies', 'Accessories', 'Shorts', 'Socks'][i % 6],
            rating: Math.round(Math.random() * 3 + 2),
            inStock: Math.random() > 0.3,
            discount: Math.random() > 0.7 ? Math.round(Math.random() * 30 + 10) : undefined
          }))
        ]

        setProducts(mockProducts)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch products')
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchProducts()
  }, [])

  // Get all unique categories
  const categories = Array.from(new Set(products.map(p => p.category)))

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category))
    }

    // Apply price filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Apply in stock filter
    if (inStockOnly) {
      result = result.filter(product => product.inStock)
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0))
        break
      default:
        // 'featured' - keep original order
        break
    }

    setFilteredProducts(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, searchQuery, selectedCategories, priceRange, sortOption, inStockOnly])

  // Handle URL params for sharing filters
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','))
    if (priceRange[0] !== 0 || priceRange[1] !== 1000) {
      params.set('minPrice', priceRange[0].toString())
      params.set('maxPrice', priceRange[1].toString())
    }
    if (sortOption !== 'featured') params.set('sort', sortOption)
    if (inStockOnly) params.set('inStock', 'true')
    if (currentPage !== 1) params.set('page', currentPage.toString())

    // Update URL without page reload
    router.replace(`/products?${params.toString()}`, { scroll: false })
  }, [searchQuery, selectedCategories, priceRange, sortOption, inStockOnly, currentPage, router])

  // Read initial state from URL params
  useEffect(() => {
    const search = searchParams.get('search')
    const categories = searchParams.get('categories')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort')
    const inStock = searchParams.get('inStock')
    const page = searchParams.get('page')

    if (search) setSearchQuery(search)
    if (categories) setSelectedCategories(categories.split(','))
    if (minPrice && maxPrice) {
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)])
    }
    if (sort) setSortOption(sort)
    if (inStock) setInStockOnly(true)
    if (page) setCurrentPage(parseInt(page))
  }, [searchParams])

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Products</h1>
          <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:mt-4">
            Browse our wide selection of high-quality products
          </p>
        </div>

        {/* Filters and search */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <select
                id="sort"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* In stock toggle */}
            <div className="flex items-center">
              <input
                id="in-stock"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <label htmlFor="in-stock" className="ml-2 block text-sm text-gray-700">
                In stock only
              </label>
            </div>
          </div>

          {/* Price range filter */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategories(prev =>
                      prev.includes(category)
                        ? prev.filter(c => c !== category)
                        : [...prev, category]
                    )
                  }}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedCategories.includes(category)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(indexOfLastProduct, filteredProducts.length)}
            </span>{' '}
            of <span className="font-medium">{filteredProducts.length}</span> results
          </p>
        </div>

        {/* Products grid */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-3 py-1 text-gray-500">...</span>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => paginate(totalPages)}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage