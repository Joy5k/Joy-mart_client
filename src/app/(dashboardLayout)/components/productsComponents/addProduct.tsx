import { Product, ProductCategory } from '@/src/types';
import React, { useState } from 'react'
import { FiDollarSign, FiImage, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface AddProductProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onProductAdded?: (newProduct: Product) => void;
}

function AddProduct({ isAddModalOpen, setIsAddModalOpen, onProductAdded }: AddProductProps) {
  // Form states
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>({
    name: '',
    description: '',
    price: 0,
    category: 'electronics',
    stock: 0,
    images: [],
    status: 'draft'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState<number[]>([]);

  // Reset form when modal is closed
  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      category: 'electronics',
      stock: 0,
      images: [],
      status: 'draft'
    });
    setImageUploadProgress([]);
  };

  // CRUD Operations
  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (newProduct.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (newProduct.stock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      
      if (response.ok) {
        const addedProduct = await response.json();
        toast.success('Product added successfully');
        onProductAdded?.(addedProduct);
        setIsAddModalOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('An error occurred while adding the product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File, index: number) => {
    // Simulate upload progress (in a real app, you'd use actual upload progress)
    for (let i = 0; i <= 100; i += 20) {
      setTimeout(() => {
        const newProgress = [...imageUploadProgress];
        newProgress[index] = i;
        setImageUploadProgress(newProgress);
      }, i * 20);
    }

    // In a real app, you would upload to cloud storage or your server
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Validate file types and sizes
      const validFiles = files.filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!validTypes.includes(file.type)) {
          toast.error(`Invalid file type: ${file.name}`);
          return false;
        }
        
        if (file.size > maxSize) {
          toast.error(`File too large (max 10MB): ${file.name}`);
          return false;
        }
        
        return true;
      });

      if (validFiles.length === 0) return;

      setImageUploadProgress(Array(validFiles.length).fill(0));
      
      try {
        const urls = await Promise.all(
          validFiles.map((file, index) => handleImageUpload(file, index))
        );
        
        setNewProduct(prev => ({
          ...prev,
          images: [...prev.images, ...urls]
        }));
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Failed to upload some images');
      } finally {
        setImageUploadProgress([]);
      }
    }
  };

  if (!isAddModalOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={() => {
            setIsAddModalOpen(false);
            resetForm();
          }}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div 
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
            >
              <span className="sr-only">Close</span>
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Product</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#088178] focus:ring-[#088178] sm:text-sm"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 text-left">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#088178] focus:ring-[#088178] sm:text-sm"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 text-left">
                      Price *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="price"
                        min="0"
                        step="0.01"
                        className="focus:ring-[#088178] focus:border-[#088178] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={newProduct.price || ''}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 text-left">
                      Stock *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#088178] focus:ring-[#088178] sm:text-sm"
                      value={newProduct.stock || ''}
                      onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 text-left">
                      Category *
                    </label>
                    <select
                      id="category"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value as ProductCategory})}
                      required
                    >
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="home">Home Goods</option>
                      <option value="books">Books</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 text-left">
                    Status *
                  </label>
                  <select
                    id="status"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                    value={newProduct.status}
                    onChange={(e) => setNewProduct({...newProduct, status: e.target.value as 'active' | 'inactive' | 'draft'})}
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Images
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#088178] hover:text-[#07756e] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#088178]"
                        >
                          <span>Upload images</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            multiple 
                            accept="image/jpeg, image/png, image/gif"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  
                  {newProduct.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 text-left mb-2">Uploaded Images</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {newProduct.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                            <img 
                              src={img} 
                              alt={`Preview ${idx}`} 
                              className="h-full w-full object-cover" 
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                              onClick={() => setNewProduct({
                                ...newProduct,
                                images: newProduct.images.filter((_, i) => i !== idx)
                              })}
                            >
                              <FiX className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#088178] text-base font-medium text-white hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:col-start-2 sm:text-sm disabled:opacity-75 disabled:cursor-not-allowed"
              onClick={handleAddProduct}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:mt-0 sm:col-start-1 sm:text-sm"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProduct