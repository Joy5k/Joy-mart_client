'use client'

import Loader from "@/src/hooks/loader"
import { useGetProductByIdQuery } from "@/src/redux/features/productManagement/productApi"
import { useParams } from "next/navigation"
import Image from 'next/image'
import { faStar, faHeart, faShoppingCart, faFlag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useAppDispatch } from "@/src/redux/hooks"
import { addItem } from "@/src/redux/features/localstorage/wishlistSlice"
import { toast } from "react-toastify"
import { useCreateBookingMutation } from "@/src/redux/features/booking/bookingApi"

function ProductDetails() {
    const dispatch = useAppDispatch()
    const { id } = useParams()
    const { data, isLoading, isError } = useGetProductByIdQuery(id)
    const product = data?.data
    
    // State for reviews and interaction
    const [activeTab, setActiveTab] = useState('description')
    const [review, setReview] = useState('')
    const [rating, setRating] = useState(0)
    const [reported, setReported] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)

    const [bookingMutation,{isLoading:bookingLoading}]=useCreateBookingMutation()
    const handleAddToWishlist = (product: any) => {
        dispatch(addItem(product))
    }

    // Sample reviews data
    const [reviews, setReviews] = useState([
        {
            id: 1,
            user: 'Sarah J.',
            rating: 4,
            comment: 'The fabric is so comfortable and the fit is perfect! Exactly as shown in the pictures.',
            date: '2 days ago'
        },
        {
            id: 2,
            user: 'Michael T.',
            rating: 5,
            comment: 'Great quality for the price. I get compliments every time I wear this!',
            date: '1 week ago'
        }
    ])

    const handleAddReview = () => {
        if (review && rating > 0) {
            const newReview = {
                id: reviews.length + 1,
                user: 'You',
                rating,
                comment: review,
                date: 'Just now'
            }
            setReviews([...reviews, newReview])
            setReview('')
            setRating(0)
            toast.success("Thank you for your review!")
        }
    }

    const handleReport = () => {
        setReported(true)
        toast.info("Thank you for reporting. We'll review this product.")
    }

    const handleQuantityChange = (value: number) => {
        if (quantity + value > 0 && quantity + value <= (product?.stock || 10)) {
            setQuantity(quantity + value)
        }
    }

    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return (
            <div className="text-red-500 text-center h-screen w-screen flex flex-col justify-center items-center text-3xl font-bold">
                <p className="block">We're experiencing technical difficulties. Please try again later.</p>
            </div>
        )
    }

    if (!product) {
        return <div className="text-center py-20">Product not found</div>
    }

const handleBookingMutation=async(productId:string)=>{
    const payload= {
        bookingQuantity:quantity,
        productId
    }
    try {
        const res=await bookingMutation(payload).unwrap()
        console.log(res)
        if(res.success){
            toast.success('Saved the product on you cart',{
                position:"top-center"
            })
        }
    } catch (err) {
        
    } finally {
        
    }
}


    return (
        <div className="container mx-auto px-4 py-8">
            {/* Product Details Section */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Product Images */}
                <div className="w-full md:w-1/2">
                    <div className="relative group overflow-hidden rounded-lg shadow-md">
                        <Image
                            src={product.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.title}
                            width={600}
                            height={800}
                            className="w-full object-cover"
                        />
                        <div onClick={()=>handleAddToWishlist(product)} className="absolute top-3 right-3 flex flex-col space-y-2">
                            <button 
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                            >
                                <FontAwesomeIcon 
                                    icon={faHeart} 
                                    className={isWishlisted ? "text-red-500" : "text-gray-600"} 
                                />
                            </button>
                        </div>
                        {product.discountPercentage > 0 && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                SALE: {product.discountPercentage}% OFF
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
                    <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon 
                                    key={i} 
                                    icon={faStar} 
                                    className={`w-4 h-4 ${i < Math.floor(product.rating?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                />
                            ))}
                        </div>
                        <span className="text-gray-600 text-sm">({product.rating?.count || 0} customer reviews)</span>
                    </div>

                    <div className="mb-6">
                        {product.discountPercentage > 0 ? (
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-green-700 mr-3">${product.price}</span>
                                <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                                <span className="ml-2 text-sm text-red-500">(You save ${(product.originalPrice - product.price).toFixed(2)})</span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-green-700">${product.price}</span>
                        )}
                    </div>

                    <p className="text-gray-700 mb-6">{product.shortDescription || 'Premium quality clothing designed for comfort and style.'}</p>

                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Availability</h3>
                        <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                            {product.stock > 0 ? `In Stock (${product.stock} items available)` : "Currently out of stock"}
                        </span>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Size</h3>
                        <div className="flex gap-2">
                            {['S', 'M', 'L', 'XL'].map(size => (
                                <button 
                                    key={size}
                                    className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center mb-6">
                        <span className="font-semibold text-gray-800 mr-4">Quantity:</span>
                        <div className="flex items-center border rounded-md">
                            <button 
                                onClick={() => handleQuantityChange(-1)}
                                className="px-3 py-1 text-lg hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="px-4 py-1 border-x">{quantity}</span>
                            <button 
                                onClick={() => handleQuantityChange(1)}
                                className="px-3 py-1 text-lg hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                   {bookingLoading ? <Loader></Loader> :  <div className="flex flex-wrap gap-3 mb-8">
                       <button onClick={()=>handleBookingMutation(product._id)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 cursor-pointer">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            Add to Cart
                            
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors cursor-pointer">
                            Buy Now
                        </button>
                    </div>}

                    <div className="border-t pt-4">
                        <p className="text-gray-600"><span className="font-semibold">Category:</span> {product.category?.categoryName || 'Clothing'}</p>
                        <p className="text-gray-600"><span className="font-semibold">Shipping:</span> {product.shipping?.free ? 'Free shipping on all orders' : 'Standard shipping rates apply'}</p>
                        <p className="text-gray-600"><span className="font-semibold">Returns:</span> Easy 30-day returns policy</p>
                    </div>
                </div>
            </div>

            {/* Product Tabs Section */}
            <div className="mb-12">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`py-4 px-1 font-medium text-sm ${activeTab === 'description' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Product Details
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`py-4 px-1 font-medium text-sm ${activeTab === 'reviews' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Customer Reviews ({reviews.length})
                        </button>
                    </nav>
                </div>

                <div className="py-6">
                    {activeTab === 'description' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About This Item</h3>
                            <p className="text-gray-700 mb-4">{product.description || 'This stylish piece is made from high-quality materials for maximum comfort and durability. Designed to fit perfectly and maintain its shape wash after wash.'}</p>
                            
                            <h4 className="font-semibold mb-2">Features:</h4>
                            <ul className="list-disc pl-5 mb-4 text-gray-700">
                                <li>Premium quality fabric</li>
                                <li>Comfortable fit</li>
                                <li>Machine washable</li>
                                <li>Designed for everyday wear</li>
                            </ul>
                            
                            <h4 className="font-semibold mb-2">Care Instructions:</h4>
                            <p className="text-gray-700">Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed.</p>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">What Customers Are Saying</h3>
                                {reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="border-b pb-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium">{review.user}</h4>
                                                        <div className="flex text-yellow-400 my-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FontAwesomeIcon 
                                                                    key={i} 
                                                                    icon={faStar} 
                                                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-gray-500 text-sm">{review.date}</span>
                                                </div>
                                                <p className="text-gray-700 mt-2">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Be the first to review this product!</p>
                                )}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Your Rating</label>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className="text-2xl mr-1 focus:outline-none"
                                            >
                                                <FontAwesomeIcon 
                                                    icon={faStar} 
                                                    className={star <= rating ? 'text-yellow-400' : 'text-gray-300'} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Your Review</label>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows={4}
                                        placeholder="What do you think about this product? Share your experience..."
                                    ></textarea>
                                </div>
                                <button
                                    onClick={handleAddReview}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Report Product Section */}
            <div className="border-t pt-6">
                <button
                    onClick={handleReport}
                    disabled={reported}
                    className={`flex items-center text-sm ${reported ? 'text-gray-400' : 'text-red-500 hover:text-red-700'}`}
                >
                    <FontAwesomeIcon icon={faFlag} className="mr-2" />
                    {reported ? 'Thank you for your report' : 'Report this Product'}
                </button>
                {reported && (
                    <p className="text-sm text-gray-500 mt-2">
                        We appreciate you helping us maintain quality standards. Our team will review this product.
                    </p>
                )}
            </div>
        </div>
    )
}

export default ProductDetails