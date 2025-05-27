import { useDeleteProductMutation } from '@/src/redux/features/productManagement/productApi';
import { IProduct } from '@/src/types';
import  { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify';




interface deleteProduct {
  currentProduct: IProduct | null;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productId: string;
}


function DeleteProductModal({ currentProduct, setIsDeleteModalOpen, productId }: deleteProduct) {
    const [deleteProduct]=useDeleteProductMutation();

      const handleDeleteProduct = async () => {
        if (!currentProduct) return;
        
        try {
          const response = await deleteProduct(productId).unwrap();

          if (response.success) {
            toast.success('Product deleted successfully',{
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            setIsDeleteModalOpen(false);
          }
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      };
  return (
    <div> 
         <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FiTrash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete {currentProduct?.title}? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleDeleteProduct}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div></div>
  )
}

export default DeleteProductModal