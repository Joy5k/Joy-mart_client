'use client';

import uploadImage from '@/src/hooks/imageUploader';
import { useGetCategoriesQuery } from '@/src/redux/features/productManagement/categoryApi';
import { useUpdateProductMutation } from '@/src/redux/features/productManagement/productApi';
import { IProduct, TCategory } from '@/src/types';
import React, { useRef, useState } from 'react';
import { FiDollarSign, FiImage, FiX, FiTag, FiBox, FiTruck, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface UpdateProductProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialProduct: IProduct;
}

function UpdateProduct({ isAddModalOpen, setIsAddModalOpen, initialProduct }: UpdateProductProps) {
  const { data: categories } = useGetCategoriesQuery({});
  const [productUpdate, { isLoading }] = useUpdateProductMutation();
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialProduct.images || []);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updatedProduct, setUpdatedProduct] = useState<Omit<IProduct, '_id' | 'rating'>>({
    title: initialProduct.title,
    shortTitle: initialProduct.shortTitle || '',
    description: initialProduct.description || '',
    shortDescription: initialProduct.shortDescription || '',
    price: initialProduct.price || 0,
    originalPrice: initialProduct.originalPrice || undefined,
    discountPercentage: initialProduct.discountPercentage || undefined,
    costPrice: initialProduct.costPrice || undefined,
    stock: initialProduct.stock || 0,
    lowStockThreshold: initialProduct.lowStockThreshold || 5,
    weight: initialProduct.weight || undefined,
    dimensions: initialProduct.dimensions || undefined,
    category: initialProduct.category || ({} as IProduct['category']),
    subCategory: initialProduct.subCategory || '',
    tags: initialProduct.tags || [],
    images: initialProduct.images || [],
    thumbnail: initialProduct.thumbnail || '',
    videoUrl: initialProduct.videoUrl || '',
    attributes: initialProduct.attributes || {},
    featured: initialProduct.featured || false,
    shipping: {
      free: initialProduct.shipping?.free || false,
      processingTime: initialProduct.shipping?.processingTime || '3-5 business days'
    },
    isDeleted: false,
    isActive: initialProduct.isActive !== undefined ? initialProduct.isActive : true
  });

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    setImageLoading(true);
    if (!selectedFiles) {
      console.log("No files selected");
      return;
    }

    try {
      const uploadedPhotos: string[] = [];
      
      for (let i = 0; i < selectedFiles?.length; i++) {
        const file = selectedFiles[i];
        const response = await uploadImage(file);
        if (response) {
          uploadedPhotos.push(response.imageUrl);
        }
        setImageLoading(false);
        setImagePreviews(prev => [...prev, response?.imageUrl]);
      }
      
      // Update the product state with new images
      setUpdatedProduct(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedPhotos]
      }));
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    
    // Also remove from the product images array
    const newImages = [...updatedProduct.images];
    newImages.splice(index, 1);
    
    setUpdatedProduct(prev => ({
      ...prev,
      images: newImages,
      thumbnail: prev.thumbnail === updatedProduct.images[index] ? '' : prev.thumbnail
    }));
  };

  const handleUpdateProduct = async () => {
    if (!updatedProduct.title.trim()) {
      toast.error('Product title is required');
      return;
    }

    if (updatedProduct.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    
    if (!updatedProduct.category) {
      toast.error('Category is required');
      return;
    }

    try {
      const response = await productUpdate({ 
        id: initialProduct._id, 
        data: updatedProduct 
      }).unwrap();
      
      if (response.success) {
        toast.success(`${updatedProduct.title} updated successfully`);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An error occurred while updating the product');
    }
  };

  const addAttribute = () => {
    setUpdatedProduct(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        ['newAttribute']: ''
      }
    }));
  };

  const updateAttribute = (key: string, value: string) => {
    setUpdatedProduct(prev => {
      const newAttributes = { ...prev.attributes };
      if (value === '') {
        delete newAttributes[key];
      } else {
        newAttributes[key] = value;
      }
      return {
        ...prev,
        attributes: newAttributes
      };
    });
  };

  if (!isAddModalOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
      {/* Shadow backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/10 backdrop-blur-sm"
        onClick={() => {
          setIsAddModalOpen(false);
        }}
      />
      
      <div 
        className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          onClick={() => {
            setIsAddModalOpen(false);
          }}
        >
          <FiX className="h-6 w-6" />
        </button>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Update Product</h3>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                  value={updatedProduct.title}
                  onChange={(e) => setUpdatedProduct({...updatedProduct, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="shortTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Short Title
                </label>
                <input
                  type="text"
                  id="shortTitle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                  value={updatedProduct.shortTitle || ''}
                  onChange={(e) => setUpdatedProduct({...updatedProduct, shortTitle: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                value={updatedProduct.description}
                onChange={(e) => setUpdatedProduct({...updatedProduct, description: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                id="shortDescription"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                value={updatedProduct.shortDescription || ''}
                onChange={(e) => setUpdatedProduct({...updatedProduct, shortDescription: e.target.value})}
              />
            </div>
            
            {/* Pricing */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiDollarSign className="mr-2" /> Pricing
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="price"
                      min="0"
                      step="0.01"
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                      value={updatedProduct.price || ''}
                      onChange={(e) => setUpdatedProduct({...updatedProduct, price: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="originalPrice"
                      min="0"
                      step="0.01"
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                      value={updatedProduct.originalPrice || ''}
                      onChange={(e) => setUpdatedProduct({...updatedProduct, originalPrice: parseFloat(e.target.value) || undefined})}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="costPrice"
                      min="0"
                      step="0.01"
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                      value={updatedProduct.costPrice || ''}
                      onChange={(e) => setUpdatedProduct({...updatedProduct, costPrice: parseFloat(e.target.value) || undefined})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Inventory */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiBox className="mr-2" /> Inventory
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                    value={updatedProduct.stock || ''}
                    onChange={(e) => setUpdatedProduct({...updatedProduct, stock: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    id="lowStockThreshold"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                    value={updatedProduct.lowStockThreshold || ''}
                    onChange={(e) => setUpdatedProduct({...updatedProduct, lowStockThreshold: parseInt(e.target.value) || undefined})}
                  />
                </div>
                
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (grams)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                    value={updatedProduct.weight || ''}
                    onChange={(e) => setUpdatedProduct({...updatedProduct, weight: parseFloat(e.target.value) || undefined})}
                  />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    id="length"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                    value={updatedProduct.dimensions?.length || ''}
                    onChange={(e) => setUpdatedProduct({
                      ...updatedProduct,
                      dimensions: {
                        length: parseFloat(e.target.value) || 0,
                        width: updatedProduct.dimensions?.width ?? 0,
                        height: updatedProduct.dimensions?.height ?? 0
                      }
                    })}
                  />
                </div>
                
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    id="width"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                    onChange={(e) => setUpdatedProduct({
                      ...updatedProduct,
                      dimensions: {
                        length: updatedProduct.dimensions?.length ?? 0,
                        width: parseFloat(e.target.value) || 0,
                        height: updatedProduct.dimensions?.height ?? 0
                      }
                    })}
                    
                  />
                </div>
                
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    min="0"
                    onChange={(e) => setUpdatedProduct({
                      ...updatedProduct,
                      dimensions: {
                        length: updatedProduct.dimensions?.length ?? 0,
                        width: updatedProduct.dimensions?.width ?? 0,
                        height: parseFloat(e.target.value) || 0
                      }
                    })}
                 
                  />
                </div>
              </div>
            </div>
            
            {/* Categorization */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiTag className="mr-2" /> Categorization
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    className='border w-full px-3 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]'
                    id="category"
                    value={updatedProduct.category?._id || ''}
                    onChange={(e) => {
                      const selectedCategory = categories?.data.find(
                        (cat: TCategory) => cat._id === e.target.value
                      );
                      setUpdatedProduct({
                        ...updatedProduct,
                        category: selectedCategory || null
                      });
                    }}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories?.data.map((category: TCategory) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    id="subCategory"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                    value={updatedProduct.subCategory || ''}
                    onChange={(e) => setUpdatedProduct({...updatedProduct, subCategory: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                  value={updatedProduct.tags?.join(', ') || ''}
                  onChange={(e) => setUpdatedProduct({
                    ...updatedProduct,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  placeholder="e.g., summer, cotton, men's"
                />
              </div>
            </div>
            
            {/* Media */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Media</h4>
              
              <div className="mt-1">
                <h4 className='text-md font-bold text-gray-700 mb-2'>Product Images</h4>
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${index}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-md">
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 mr-2"
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#088178] hover:text-[#07756e] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#088178]"
                        >
                          <span>Upload images</span>
                          <input 
                            id="file-upload" 
                            ref={fileInputRef}
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            multiple 
                            accept="image/jpeg, image/png, image/gif"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
                
                {imageLoading && (
                  <div className="mt-4 text-center text-gray-500">
                    Uploading images...
                  </div>
                )}
              </div>
              
              {updatedProduct.images.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Thumbnail Image in ({updatedProduct.images.length})
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {updatedProduct.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img} 
                          alt={`Preview ${idx}`} 
                          className={`h-32 w-full object-cover rounded-md border-2 ${updatedProduct.thumbnail === img ? 'border-[#088178]' : 'border-gray-200'}`}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            className="p-1 bg-white/80 rounded-full hover:bg-white"
                            onClick={() => setUpdatedProduct({
                              ...updatedProduct,
                              thumbnail: img
                            })}
                            title="Set as thumbnail"
                          >
                            <FiStar className={`h-4 w-4 ${updatedProduct.thumbnail === img ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL (optional)
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                  value={updatedProduct.videoUrl || ''}
                  onChange={(e) => setUpdatedProduct({...updatedProduct, videoUrl: e.target.value})}
                  placeholder="https://youtube.com/embed/..."
                />
              </div>
            </div>
            
            {/* Variants */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Variants & Attributes</h4>
              
              <div>
                {Object.entries(updatedProduct.attributes || {}).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        updateAttribute(key, newKey);
                      }}
                      placeholder="Attribute name"
                    />
                    <div className="flex">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                        value={value}
                        onChange={(e) => updateAttribute(key, e.target.value)}
                        placeholder="Attribute value"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="mt-2 px-3 py-1 text-sm text-[#088178] hover:text-[#07756e] font-medium"
                  onClick={addAttribute}
                >
                  + Add Attribute
                </button>
              </div>
            </div>
            
            {/* Shipping & Status */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiTruck className="mr-2" /> Shipping & Status
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="processingTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Processing Time
                  </label>
                  <input
                    type="text"
                    id="processingTime"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                    value={updatedProduct.shipping?.processingTime || ''}
                    onChange={(e) => setUpdatedProduct({
                      ...updatedProduct,
                      shipping: {
                        ...updatedProduct.shipping,
                        processingTime: e.target.value || '',
                        free: updatedProduct.shipping?.free ?? false
                      }
                    })}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="freeShipping"
                    className="h-4 w-4 text-[#088178] focus:ring-[#088178] border-gray-300 rounded"
                    checked={updatedProduct.shipping?.free || false}
                    onChange={(e) => setUpdatedProduct({
                      ...updatedProduct,
                      shipping: {
                        ...updatedProduct.shipping,
                                                processingTime: e.target.value || '',
                                                free: updatedProduct.shipping?.free ?? false
                      }
                    })}
                  />
                  <label htmlFor="freeShipping" className="ml-2 block text-sm text-gray-700">
                    Free Shipping
                  </label>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    className="h-4 w-4 text-[#088178] focus:ring-[#088178] border-gray-300 rounded"
                    checked={updatedProduct.featured || false}
                    onChange={(e) => setUpdatedProduct({
                      ...updatedProduct,
                      featured: e.target.checked
                    })}
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Product
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 text-[#088178] focus:ring-[#088178] border-gray-300 rounded"
                    checked={updatedProduct.isActive || false}
                    onChange={(e) => setUpdatedProduct({
                      ...updatedProduct,
                      isActive: e.target.checked
                    })}
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active (Visible to customers)
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178]"
              onClick={() => {
                setIsAddModalOpen(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#088178] hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] disabled:opacity-75"
              onClick={handleUpdateProduct}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;