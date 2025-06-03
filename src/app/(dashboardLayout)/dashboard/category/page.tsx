'use client';

import Loader from '@/src/hooks/loader';
import { 
  useCreateCategoryMutation, 
  useDeleteCategoryMutation, 
  useGetCategoriesQuery,
  useUpdateCategoryMutation 
} from '@/src/redux/features/productManagement/categoryApi';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

type Category = {
  _id: string;
  categoryName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
};

type FormData = {
  categoryName: string;
  description: string;
  isActive: boolean;
};

export default function CategoryManagement() {
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    categoryName: '',
    description: '',
    isActive: true
  });

  const [createCategory] = useCreateCategoryMutation();
  const { data: categoriesResponse, isLoading: loading, refetch } = useGetCategoriesQuery({});
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const categories = categoriesResponse?.data || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleActive = () => {
    setFormData(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await createCategory(formData).unwrap();
      if (res.success) {
        toast.success('Category created successfully');
        setIsModalOpen(false);
        setFormData({ categoryName: '', description: '', isActive: true });
        refetch();
      }
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred while creating category');
      toast.error(err?.data?.message || 'An error occurred while creating category');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!currentCategory) return;
    
    try {
      const res = await updateCategory({
        id: currentCategory._id,
        data: formData
      }).unwrap();
      if (res.success) {
        toast.success('Category updated successfully');
        setIsModalOpen(false);
        setCurrentCategory(null);
        setFormData({ categoryName: '', description: '', isActive: true });
        refetch();
      }
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred while updating category');
      toast.error(err?.data?.message || 'An error occurred while updating category');
    }
  };

  const handleEdit = (category: Category) => {
    setError(null);
    setCurrentCategory(category);
    setFormData({
      categoryName: category.categoryName,
      description: category.description,
      isActive: category.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setError(null);
      try {
        const res = await deleteCategory({ id }).unwrap();
        if (res.success) {
          toast.success("Category deleted successfully");
          // Force a refetch to ensure UI is in sync with server state
          await refetch();
        }
      } catch (err: any) {
        setError(err?.data?.message || 'An error occurred while deleting category');
        toast.error(err?.data?.message || 'An error occurred while deleting category');
      }
    
  };

  if (loading) return <Loader />;

  const filteredCategories = categories.filter((category: Category) => 
   !category.isActive|| category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) || (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error && <div className="text-center py-5 text-red-500">Error: {error}</div>}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Category Management</h2>
          <button
            onClick={() => {
              setCurrentCategory(null);
              setFormData({ categoryName: '', description: '', isActive: true });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#088178] hover:bg-[#076b63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178]"
          >
            <FiPlus className="mr-2" /> Add Category
          </button>
        </div>
      </motion.div>
     
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
                filteredCategories.map((category: Category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.description || "No description provided"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-[#088178] hover:text-[#076b63] mr-4"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
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
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <div className="mt-4">
                    <form onSubmit={currentCategory ? handleUpdateCategory : handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          name="categoryName"
                          id="categoryName"
                          required
                          className="shadow-sm focus:ring-[#088178] focus:border-[#088178] block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          value={formData.categoryName}
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
                      <div className="mb-4 flex items-center">
                        <input
                          type="checkbox"
                          name="isActive"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={handleToggleActive}
                          className="h-4 w-4 text-[#088178] focus:ring-[#088178] border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                          Active Status
                        </label>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#088178] text-base font-medium text-white hover:bg-[#076b63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:col-start-2 sm:text-sm"
                        >
                          <FiCheck className="mr-2 mt-1" /> 
                          {currentCategory ? 'Update Category' : 'Create Category'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            setCurrentCategory(null);
                            setFormData({ categoryName: '', description: '', isActive: true });
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                          <FiX className="mr-2 mt-1" /> Cancel
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