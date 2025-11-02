'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/src/components/ProductCart/ProductCart'
import { useGetProductsQuery } from '@/src/redux/features/productManagement/productApi'
import { IProduct, TCategory } from '@/src/types'
import { useGetCategoriesQuery } from '@/src/redux/features/productManagement/categoryApi'

const ProductsPage = () => {
  const searchParams = useSearchParams()
  const pageFromUrl = searchParams.get('page')

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortOption, setSortOption] = useState('-createdAt')
  const [inStockOnly, setInStockOnly] = useState(false)

  const [currentPage, setCurrentPage] = useState(pageFromUrl ? parseInt(pageFromUrl) : 1)
  const productsPerPage = 12

  // Initialize state from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    
    if (params.get('search')) setSearchQuery(params.get('search') || '')
    
    if (params.get('category')) {
      const categories = params.get('category')?.split(',') || []
      setSelectedCategories(categories.filter(Boolean))
    }
    
    if (params.get('minPrice') || params.get('maxPrice')) {
      setPriceRange([
        parseInt(params.get('minPrice') || '0'),
        parseInt(params.get('maxPrice') || '1000')
      ])
    }
    
    if (params.get('sort')) setSortOption(params.get('sort') || '-createdAt')
    if (params.get('inStock')) setInStockOnly(params.get('inStock') === 'true')
  }, [])


  const { data, isLoading, isError } = useGetProductsQuery({
    searchTerm: searchQuery,
    category: selectedCategories.join(','), 
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort: sortOption,
    page: currentPage,
    limit: productsPerPage,
  })

  const products = data?.data?.result || []
  const totalProducts = data?.data?.meta?.total || 0
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  // Get all categories for filter options
  const { data: categoriesData } = useGetCategoriesQuery({})
  const categories = categoriesData?.data || []

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
      return newCategories
    })
    setCurrentPage(1)
  }

  const handlePriceChange = (index: number, value: number) => {
    const newPriceRange = [...priceRange] as [number, number]
    newPriceRange[index] = value
    setPriceRange(newPriceRange)
    setCurrentPage(1)
  }
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Failed to load products. Please try again later.</div>
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
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            {/* Sort */}
            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating">Highest Rated</option>
                <option value="-discount">Biggest Discount</option>
              </select>
            </div>

            {/* In stock toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked)
                  setCurrentPage(1)
                }}
              />
              <label className="ml-2 block text-sm text-gray-700">
                In stock only
              </label>
            </div>
          </div>

          {/* Price range filter */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <input
                  type="number"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <input
                  type="number"
                  min={priceRange[0]}
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, parseInt(e.target.value) || 1000)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories?.map((category: TCategory) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryToggle(category._id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategories.includes(category._id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.categoryName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{(currentPage - 1) * productsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * productsPerPage, totalProducts)}
            </span>{' '}
            of <span className="font-medium">{totalProducts}</span> results
          </p>
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
             <section id="product1" className="px-2 py-10 md:py-20 lg:py-20">
                  <h2 className="text-2xl font-bold text-gray-800">New Arrivals</h2>
                  <p className="text-xl font-bold text-gray-700">Choose your Collection with New Modern Design</p>
                  <div className="pro-container">
                    {products.map((product:IProduct) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </section>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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
                <>
                  <span className="px-3 py-1 text-gray-500">...</span>
                  <button
                    onClick={() => paginate(totalPages)}
                    className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                </>
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