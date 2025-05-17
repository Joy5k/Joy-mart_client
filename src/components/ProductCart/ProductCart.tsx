'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faStar, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch } from '@/src/redux/hooks'
import { addItem } from '@/src/redux/features/localstorage/wishlistSlice'

interface ProductCardProps {
  product: {
    id: number
    image: string
    brand: string
    name: string
    price: number
  }
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch()
  const handleAddToWishlist = (product: any) => {
    dispatch(addItem(product))
  }
  return (
    <div className="pro group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image with zoom effect */}
      <div className="overflow-hidden">
        <Image 
          src={product.image} 
          alt={product.name} 
          width={200} 
          height={250}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Quick actions (appear on hover) */}
      <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={() => handleAddToWishlist(product)} className="w-6 h-6 bg-transparent rounded-full flex items-center justify-center shadow-md hover:bg-transparent transition-colors hover:cursor-pointer">
          <FontAwesomeIcon icon={faHeart} className="text-gray-600 hover:text-red-500" />
        </button>
      </div>

      {/* Product info */}
      <div className="p-4 bg-white">
        <span className="text-gray-600 text-sm text-start">{product.brand}</span>
        <h5 className="font-semibold mt-1 text-gray-800 hover:text-green-600 transition-colors">
          {product.name}
        </h5>
        <div className="star flex mt-2 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon 
              key={i} 
              icon={faStar} 
              className="w-4 h-4 hover:scale-125 transition-transform" 
            />
          ))}
        </div>
        <div className="flex justify-between items-start mt-3">
          <h4 className="font-bold text-green-700">${product.price}</h4>
          
          {/* Add to cart button with bounce animation */}
          <Link 
            href="#" 
            className="relative overflow-hidden"
          
          >
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-start justify-start shadow-md hover:bg-green-200 transition-all duration-300 ">
              <FontAwesomeIcon 
                icon={faShoppingCart} 
                className="text-green-700 hover:text-green-800 transition-colors"
              />
            </div>
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-700 opacity-0 ">
              Add to Cart
            </span>
          </Link>
        </div>
      </div>

      {/* Sale badge (example) */}
      {product.id % 3 === 0 && (
        <div className="absolute top-5 left-4 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse w-10">
          HOT
        </div>
      )}
    </div>
  )
}

export default ProductCard