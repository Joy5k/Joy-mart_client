import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } from '@/src/redux/features/productManagement/categoryApi';
import { TCategory, TFormData } from '@/src/types';
import React, { useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

function CreateCategoryModal({currentCategory}) {
      const [error, setError] = useState<string | null>(null);
      const [searchTerm, setSearchTerm] = useState<string>('');
      const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
 
    
      const [createCategory]=useCreateCategoryMutation()
      const {data:Categories,isLoading:loading}=useGetCategoriesQuery({})
      const [deleteCategory]=useDeleteCategoryMutation()
    
      const [formData, setFormData] = useState<TFormData>({
        categoryName: '',
        description: '',
        isActive:true
      });




  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setError(null)
          try {
            const res=await createCategory(formData).unwrap()
      
            if(res.success){
              toast.success('Created category successfully')
            }
          
            setIsModalOpen(false);
            
      
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
          }
        };


          // Edit category
          const handleEdit = (category: TCategory) => {
                setError(null)
        
            setFormData({
              categoryName: category.categoryName,
              description: category.description,
              isActive: category.isActive
            });
            setIsModalOpen(true);
          };
        
          // Delete category
          const handleDelete = async (id: string) => {
                setError(null)
        
            if (confirm('Are you sure you want to delete this category?')) {
              try {
                  const res=await deleteCategory({id}).unwrap()
                  if(res.success){
                    toast.success("category deleted")
                  }
              } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
              }
            }
          };
  return (
    <div>
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
                                  name="categoryName"
                                  id="name"
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
                              <div className="mb-4">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                  Status
                                </label>
                                <select
                                  name="isActive"
                                  id="status"
                                  className="shadow-sm focus:ring-[#088178] focus:border-[#088178] block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                  onChange={handleInputChange}
                                >
                                  <option value="true">Active</option>
                                  <option value="false">Inactive</option>
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
    </div>
  )
}

export default CreateCategoryModal