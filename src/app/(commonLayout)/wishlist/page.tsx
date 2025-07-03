/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSelector, useDispatch } from 'react-redux';
import { FaRegHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { removeItem } from '@/src/redux/features/localstorage/wishlistSlice';
import { RootState } from '@/src/redux/store';
import { useEffect, useState } from 'react';
import { useCreateBookingMutation } from '@/src/redux/features/booking/bookingApi';
import Loader from '@/src/hooks/loader';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.wishlist);
    const [bookingMutation]=useCreateBookingMutation()
  const [isHydrated, setIsHydrated] = useState(true);

  useEffect(() => {
    setIsHydrated(false);
  });

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeItem(productId));
    toast.success('Removed from wishlist', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

const handleBookingMutation=async(productId:string)=>{
    const payload= {
        bookingQuantity:1,
        productId
    }
    try {
        const res=await bookingMutation(payload).unwrap()
        console.log(res)
        if(res.success){
            toast.success('Saved the product on you cart',{
                position:"top-center",
                autoClose:2000,
                hideProgressBar:false,
                closeOnClick:true,
                pauseOnHover:true,
                draggable:true,
                progress:undefined,
                theme:"colored"
            })
            dispatch(removeItem(productId)); 
        }
    } catch (err) {
        
    } 
}

  if (isHydrated) {
    return (
      <section className="section-p1 py-12 min-h-screen bg-[#E3E6F3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Skeleton loader while hydrating */}
            <div className="bg-gradient-to-r from-[#088178] to-[#0abab5] p-6 text-center">
              <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
              <div className="h-6"></div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 w-1/2 mx-auto bg-gray-200 rounded"></div>
                <div className="h-4 w-1/3 mx-auto bg-gray-200 rounded mt-2"></div>
                <div className="h-10 w-32 mx-auto bg-gray-200 rounded mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
   
    <div>
         <section className="section-p1 py-12 min-h-screen bg-[#E3E6F3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#088178] to-[#0abab5] p-6 text-center">
            <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
            <p className="text-[#cce7d0] mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <FaRegHeart className="mx-auto text-5xl text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Your wishlist is empty</h3>
                <p className="text-gray-500 mt-2">Save your favorite items here</p>
                <Link
                  href="/products"
                  className="mt-6 inline-block px-6 py-2 bg-[#088178] text-white rounded-md hover:bg-[#0abab5] transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <Image
                        src={item.images[0] || '/img/placeholder-product.png'}
                        width={120}
                        height={120}
                        alt="Product image"
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <p className="text-gray-600 mt-1">{item.description?.substring(0, 100)}...</p>
                      <div className="mt-2 flex items-center">
                        <span className="text-[#088178] font-bold">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.oldPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${item.oldPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex  space-x-3 ">
                        <button onClick={()=>handleBookingMutation(item._id)}
                          className="flex items-center px-4 py-2 bg-[#088178] text-white rounded-md hover:bg-[#0abab5] transition-colors"
                        >
                          <FaShoppingCart className="mr-2" />
                          Add to Cart
                        </button>
                        <Link
                          href={`/products/${item.slug || item._id}`}
                          className="px-4 py-2 border border-[#088178] text-[#088178] rounded-md hover:bg-gray-50 transition-colors"
                        >
                           Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default WishlistPage;