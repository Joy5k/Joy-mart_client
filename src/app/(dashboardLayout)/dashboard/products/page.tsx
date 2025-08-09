'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiDollarSign,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { IProduct } from '@/src/types';
import AddProduct from '../../components/productsComponents/addProduct';
import { useGetAllProductsForAdminQuery } from '@/src/redux/features/productManagement/productApi';
import UpdateProduct from '../../components/productsComponents/updateProduct';
import DeleteProductModal from '../../components/productsComponents/deleteProductModal';
import Loader from '@/src/hooks/loader';

export default function ProductManagementPage() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

const [queryParams, setQueryParams] = useState({
  searchTerm: '',
  minPrice: 0,
  maxPrice: 10000,
  sort: '',
  inStock: '',
  page: 1,
  limit: 10,
});


  // Fetch products using the query parameters
  const { data: products, isLoading: loading } = useGetAllProductsForAdminQuery(queryParams);

  // Handle input changes for all filter fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setQueryParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Debounced search function
  const handleSearch = (value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setQueryParams(prev => ({ ...prev, searchTerm: value, page: 1 }));
    }, 300);
  };

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    setQueryParams(prev => ({ ...prev, page: newPage }));
  };

  // Modal state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between flex-col md:flex-row lg:flex-row mt-3">
          <div>
            <h3 className="text-xl font-medium leading-6 text-gray-900">Product Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your product inventory and listings
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center w-full md:w-fit lg:w-fit rounded-md border border-transparent bg-[#088178] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2 mt-5"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Product
          </button>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-6 rounded-lg bg-white p-4 shadow"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {/* Search Term */}
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
              Search Term
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="searchTerm"
                className="focus:ring-[#088178] focus:border-[#088178] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search products..."
                value={queryParams.searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

         

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                className="w-1/2 focus:ring-[#088178] focus:border-[#088178] block sm:text-sm border-gray-300 rounded-md"
                value={queryParams.minPrice}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                className="w-1/2 focus:ring-[#088178] focus:border-[#088178] block sm:text-sm border-gray-300 rounded-md"
                value={queryParams.maxPrice}
                onChange={handleInputChange}
              />
            </div>
          </div>

         

          {/* Sort */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              name="sort"
              className="mt-1 focus:ring-[#088178] focus:border-[#088178] block w-full sm:text-sm border-gray-300 rounded-md"
              value={queryParams.sort}
              onChange={handleInputChange}
            >
              <option value="">Default</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

         

          {/* Items Per Page */}
          <div>
            <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
              Items Per Page
            </label>
            <select
              name="limit"
              className="mt-1 focus:ring-[#088178] focus:border-[#088178] block w-full sm:text-sm border-gray-300 rounded-md"
              value={queryParams.limit}
              onChange={handleInputChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
      >
        <div className="bg-white">
          {loading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Product
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Stock
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products?.data?.result.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FiPackage className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                          <p className="text-gray-500 mt-1">Try adjusting your search filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products?.data?.result.map((product: IProduct) => (
                      <tr key={product._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <img className="h-10 w-10 rounded-md object-cover" src={product.images[0]} alt={product.title} />
                              ) : (
                                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#c8faf7] text-[#088178]">
                                  <FiPackage className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{product.title}</div>
                              <div className="text-gray-500 line-clamp-1">{product.shortTitle || product.description?.slice(0, 20)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                          {product?.category?.categoryName || "Uncategorized"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiDollarSign className="mr-1 h-3 w-3 text-gray-400" />
                            {product.price.toFixed(2)}
                            {product.originalPrice && (
                              <span className="ml-2 text-xs text-gray-400 line-through">
                                <FiDollarSign className="inline h-2 w-2" />
                                {product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            {product.stock}
                            {product.lowStockThreshold && product.stock <= product.lowStockThreshold && (
                              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Low
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex flex-wrap gap-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {product.featured && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <FiStar className="mr-1 h-3 w-3" /> Featured
                              </span>
                            )}
                            {product.isDeleted && (
      <span 
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 ring-1 ring-amber-600/20"
        aria-label="Deleted product"
      >
        <FiTrash2 className="mr-1 h-3 w-3 flex-shrink-0" />
        Archived
      </span>
    )}
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setCurrentProduct(product);
                                setIsEditModalOpen(true);
                              }}
                              className="text-[#088178] hover:text-[#07756e]"
                              aria-label="Edit product"
                            >
                              <FiEdit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setCurrentProduct(product);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                              aria-label="Delete product"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {products?.data?.result.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(queryParams.page - 1)}
                disabled={queryParams.page === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(queryParams.page + 1)}
                disabled={queryParams.page >= (products?.data?.meta.totalPage || 1)}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(queryParams.page - 1) * queryParams.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(queryParams.page * queryParams.limit, products.data.meta.total)}
                  </span> of{' '}
                  <span className="font-medium">{products.data.meta.total}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(queryParams.page - 1)}
                    disabled={queryParams.page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: Math.min(5, products.data.meta.totalPage) }, (_, i) => {
                    let pageNum;
                    if (products.data.meta.totalPage <= 5) {
                      pageNum = i + 1;
                    } else if (queryParams.page <= 3) {
                      pageNum = i + 1;
                    } else if (queryParams.page >= products.data.meta.totalPage - 2) {
                      pageNum = products.data.meta.totalPage - 4 + i;
                    } else {
                      pageNum = queryParams.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          queryParams.page === pageNum
                            ? 'bg-[#088178] text-white focus:z-20  focus-visible:outline-2 focus-visible:outline-[#088178]'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(queryParams.page + 1)}
                    disabled={queryParams.page >= products.data.meta.totalPage}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <AddProduct 
          isAddModalOpen={isAddModalOpen} 
          setIsAddModalOpen={setIsAddModalOpen}
          onProductAdded={() => {
            // You might want to refresh the product list here
          }}
        />
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && currentProduct && (
        <UpdateProduct
          isAddModalOpen={isEditModalOpen}
          setIsAddModalOpen={setIsEditModalOpen}
          initialProduct={currentProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentProduct && (
        <DeleteProductModal
          currentProduct={currentProduct}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          productId={currentProduct._id}
        />
      )}
    </div>
  );
}