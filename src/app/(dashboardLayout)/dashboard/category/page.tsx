'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';

type Category = {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

type FormData = {
  name: string;
  description: string;
  status: 'active' | 'inactive';
};

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    status: 'active'
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch('/api/categories');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData: Category[] = [
          { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', status: 'active', createdAt: '2023-05-15' },
          { id: 2, name: 'Clothing', description: 'Apparel and fashion items', status: 'active', createdAt: '2023-04-22' },
          { id: 3, name: 'Home & Garden', description: 'Home improvement and gardening', status: 'active', createdAt: '2023-03-10' },
          { id: 4, name: 'Books', description: 'All types of books', status: 'inactive', createdAt: '2023-02-28' },
        ];
        
        setCategories(mockData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to create/update the category
      // const method = currentCategory ? 'PUT' : 'POST';
      // const url = currentCategory ? `/api/categories/${currentCategory.id}` : '/api/categories';
      // const response = await fetch(url, { method, body: JSON.stringify(formData) });
      
      // For demo purposes, we'll just update the state
      if (currentCategory) {
        // Update existing category
        setCategories(categories.map(cat => 
          cat.id === currentCategory.id ? { ...cat, ...formData } : cat
        ));
      } else {
        // Add new category
        const newCategory: Category = {
          id: categories.length + 1,
          ...formData,
          createdAt: new Date().toISOString()
        };
        setCategories([...categories, newCategory]);
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', description: '', status: 'active' });
      setCurrentCategory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Edit category
  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      status: category.status
    });
    setIsModalOpen(true);
  };

  // Delete category
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        // Here you would typically make an API call to delete the category
        // await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        
        // For demo purposes, we'll just update the state
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Category Management</h2>
          <button
            onClick={() => {
              setCurrentCategory(null);
              setFormData({ name: '', description: '', status: 'active' });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#088178] hover:bg-[#076b63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178]"
          >
            <FiPlus className="mr-2" /> Add Category
          </button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-6 relative"
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search categories..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#088178] focus:border-[#088178] sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Categories Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-[#088178] hover:text-[#076b63] mr-4"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed  opacity-75 " aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <div className="mt-4 ">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Category Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          className="shadow-sm focus:ring-[#088178] focus:border-[#088178] block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          rows={3}
                          className="shadow-sm focus:ring-[#088178] focus:border-[#088178] block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          name="status"
                          id="status"
                          className="shadow-sm focus:ring-[#088178] focus:border-[#088178] block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#088178] text-base font-medium text-white hover:bg-[#076b63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:col-start-2 sm:text-sm"
                        >
                          <FiCheck className="mr-2" /> {currentCategory ? 'Update' : 'Create'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                          <FiX className="mr-2" /> Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}