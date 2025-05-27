'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiDollarSign,
  FiStar,

} from 'react-icons/fi';
import { IProduct } from '@/src/types';
import AddProduct from '../../components/productsComponents/addProduct';
import { useGetProductsQuery } from '@/src/redux/features/productManagement/productApi';
import UpdateProduct from '../../components/productsComponents/updateProduct';
import DeleteProductModal from '../../components/productsComponents/deleteProductModal';


export default function ProductManagementPage() {
  //redux api
  // State variables
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [searchText, setSearchText] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('all');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const {data:products, isLoading:loading} = useGetProductsQuery(searchText)

  // Apply filters
  useEffect(() => {
    let result = products?.data?.result || [];

    if (searchText) {
      result = result.filter((product:IProduct) =>
        product.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter((product:IProduct) => product.category?.categoryName === categoryFilter);
    }
    // Filter by status 
    if (statusFilter !== 'all') {
      result = result.filter((product:IProduct) => product.isActive === (statusFilter === 'active'));
    }

  }, [searchText, categoryFilter, statusFilter, products]);

  const handleEditProduct = async () => {
    if (!currentProduct) return;
    
    try {
      const response = await fetch(`/api/products/${currentProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProduct),
      });
      
      if (response.ok) {
        const updatedProduct = await response.json();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };





  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between flex-col md:flex-row lg:flex-row mt-3">
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900">Product Management</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your product inventory and listings
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-[#088178] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2 mt-5"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Product
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-6 rounded-lg bg-white p-4 shadow"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Products
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
            <input
      type="text"
      id="search"
      className="focus:ring-[#088178] focus:border-[#088178] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
      placeholder="Name or description"
      onChange={(e) => {
        const value = e.target.value;

        // Clear previous timeout (if any)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
          setSearchText(value);
        }, 300);
      }}
    />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home Goods</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'active' | 'inactive' | 'all')}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#088178]"></div>
            </div>
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
      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
        <span className="sr-only">Actions</span>
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 bg-white">
    {products?.data?.result.length === 0 ? (
      <tr>
        <td colSpan={7} className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <FiPackage className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-1">Add a new product to get started</p>
            <button
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#088178] hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178]"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              Add Product
            </button>
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
                <div className="text-gray-500 line-clamp-1">{product.shortTitle || product.description}</div>
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
      </motion.div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <AddProduct 
          isAddModalOpen={isAddModalOpen} 
          setIsAddModalOpen={setIsAddModalOpen}
          onProductAdded={(newProduct) => {
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