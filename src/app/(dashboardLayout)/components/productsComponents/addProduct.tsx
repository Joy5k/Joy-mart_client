'use client';

import { IProduct } from '@/src/types';
import React, { useState } from 'react';
import { FiDollarSign, FiImage, FiX, FiTag, FiBox, FiTruck, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface AddProductProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onProductAdded?: (newProduct: IProduct) => void;
    initialProduct?: IProduct;

}

function AddProduct({ isAddModalOpen, setIsAddModalOpen, onProductAdded }: AddProductProps) {
  const [newProduct, setNewProduct] = useState<Omit<IProduct, '_id' | 'rating'>>({
    title: '',
    shortTitle: '',
    description: '',
    shortDescription: '',
    price: 0,
    originalPrice: undefined,
    discountPercentage: undefined,
    costPrice: undefined,
    stock: 0,
    lowStockThreshold: 5,
    weight: undefined,
    dimensions: undefined,
    category: undefined as unknown as IProduct['category'],
    subCategory: '',
    tags: [],
    images: [],
    thumbnail: '',
    videoUrl: '',
    attributes: {},
    featured: false,
    shipping: {
      free: false,
      processingTime: '3-5 business days'
    },
    isDeleted: false,
    isActive: true
  });

  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setNewProduct({
      title: '',
      shortTitle: '',
      description: '',
      shortDescription: '',
      price: 0,
      originalPrice: undefined,
      discountPercentage: undefined,
      costPrice: undefined,
      stock: 0,
      lowStockThreshold: 5,
      weight: undefined,
      dimensions: undefined,
      category: undefined as unknown as IProduct['category'],
      subCategory: '',
      tags: [],
      images: [],
      thumbnail: '',
      videoUrl: '',
      attributes: {},
      featured: false,
      shipping: {
        free: false,
        processingTime: '3-5 business days'
      },
      isDeleted: false,
      isActive: true
    });
  };

  const handleAddProduct = async () => {
    if (!newProduct.title.trim()) {
      toast.error('Product title is required');
      return;
    }

    if (newProduct.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          // Calculate discount percentage if original price is provided
          discountPercentage: newProduct.originalPrice 
            ? Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)
            : undefined
        }),
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls = files.map(file => URL.createObjectURL(file));
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, ...urls],
        thumbnail: prev.thumbnail || urls[0] // Set first image as thumbnail if not set
      }));
    }
  };

  const addAttribute = () => {
    setNewProduct(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        ['newAttribute']: ''
      }
    }));
  };

  const updateAttribute = (key: string, value: string) => {
    setNewProduct(prev => {
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
          resetForm();
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
            resetForm();
          }}
        >
          <FiX className="h-6 w-6" />
        </button>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h3>
          
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
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
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
                  value={newProduct.shortTitle || ''}
                  onChange={(e) => setNewProduct({...newProduct, shortTitle: e.target.value})}
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
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
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
                value={newProduct.shortDescription || ''}
                onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})}
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
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
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
                      value={newProduct.originalPrice || ''}
                      onChange={(e) => setNewProduct({...newProduct, originalPrice: parseFloat(e.target.value) || undefined})}
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
                      value={newProduct.costPrice || ''}
                      onChange={(e) => setNewProduct({...newProduct, costPrice: parseFloat(e.target.value) || undefined})}
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
                    value={newProduct.stock || ''}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
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
                    value={newProduct.lowStockThreshold || ''}
                    onChange={(e) => setNewProduct({...newProduct, lowStockThreshold: parseInt(e.target.value) || undefined})}
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
                    value={newProduct.weight || ''}
                    onChange={(e) => setNewProduct({...newProduct, weight: parseFloat(e.target.value) || undefined})}
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
                    value={newProduct.dimensions?.length || ''}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                     dimensions: {
                        length: newProduct.dimensions?.length ?? 0,
                        width: parseFloat(e.target.value) || 0,
                        height: newProduct.dimensions?.height ?? 0
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
                    value={newProduct.dimensions?.width || ''}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                      dimensions: {
                        length: newProduct.dimensions?.length ?? 0,
                        width: parseFloat(e.target.value) || 0,
                        height: newProduct.dimensions?.height ?? 0
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                    value={newProduct?.dimensions?.height || ''}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                     dimensions: {
                        length: newProduct.dimensions?.length ?? 0,
                        width: parseFloat(e.target.value) || 0,
                        height: newProduct.dimensions?.height ?? 0
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
                  <input
                    type="text"
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                    value={newProduct.category?.categoryName || ''}
                    onChange={(e) => setNewProduct({...newProduct, category: { categoryName: e.target.value, isActive: true }})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    id="subCategory"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#088178] focus:border-[#088178]"
                    value={newProduct.subCategory || ''}
                    onChange={(e) => setNewProduct({...newProduct, subCategory: e.target.value})}
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
                  value={newProduct.tags?.join(', ') || ''}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  placeholder="e.g., summer, cotton, men's"
                />
              </div>
            </div>
            
            {/* Media */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Media</h4>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        multiple 
                        accept="image/jpeg, image/png, image/gif"
                        onChange={handleImageUpload}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images ({newProduct.images.length})
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {newProduct.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img} 
                          alt={`Preview ${idx}`} 
                          className={`h-32 w-full object-cover rounded-md border-2 ${newProduct.thumbnail === img ? 'border-[#088178]' : 'border-gray-200'}`}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            className="p-1 bg-white/80 rounded-full hover:bg-white"
                            onClick={() => setNewProduct({
                              ...newProduct,
                              thumbnail: img
                            })}
                            title="Set as thumbnail"
                          >
                            <FiStar className={`h-4 w-4 ${newProduct.thumbnail === img ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
                          </button>
                          <button
                            type="button"
                            className="p-1 bg-white/80 rounded-full hover:bg-white ml-1"
                            onClick={() => setNewProduct({
                              ...newProduct,
                              images: newProduct.images.filter((_, i) => i !== idx),
                              thumbnail: newProduct.thumbnail === img ? '' : newProduct.thumbnail
                            })}
                            title="Remove image"
                          >
                            <FiX className="h-4 w-4 text-gray-700" />
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
                  value={newProduct.videoUrl || ''}
                  onChange={(e) => setNewProduct({...newProduct, videoUrl: e.target.value})}
                  placeholder="https://youtube.com/embed/..."
                />
              </div>
            </div>
            
            {/* Variants */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Variants & Attributes</h4>
              
              <div>
                {Object.entries(newProduct.attributes || {}).map(([key, value]) => (
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
                    value={newProduct.shipping?.processingTime || ''}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                      shipping: {
                        ...newProduct.shipping,
                        processingTime: e.target.value || '',
                        free: newProduct.shipping?.free ?? false
                      }
                    })}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="freeShipping"
                    className="h-4 w-4 text-[#088178] focus:ring-[#088178] border-gray-300 rounded"
                    checked={newProduct.shipping?.free || false}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                       shipping: {
                        ...newProduct.shipping,
                        processingTime: e.target.value || '',
                        free: newProduct.shipping?.free ?? false
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
                    checked={newProduct.featured || false}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
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
                    checked={newProduct.isActive || false}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
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
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#088178] hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] disabled:opacity-75"
              onClick={handleAddProduct}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;