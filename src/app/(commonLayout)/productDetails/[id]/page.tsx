'use client'

import Loader from "@/src/hooks/loader"
import { useGetProductByIdQuery } from "@/src/redux/features/productManagement/productApi"
import { useParams } from "next/navigation"
import Image from 'next/image'
import { faStar, faHeart, faShoppingCart, faFlag, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useAppDispatch } from "@/src/redux/hooks"
import { addItem } from "@/src/redux/features/localstorage/wishlistSlice"
import { toast } from "react-toastify"
import { useCreateBookingMutation } from "@/src/redux/features/booking/bookingApi"
import { useReportProductMutation } from "@/src/redux/features/reportProduct/reportProductApi"
import { ReportedProduct } from "@/src/types"
import { useCreateProductCommentMutation, useDeleteProductCommentMutation, useGetProductCommentsQuery, useUpdateProductCommentMutation } from "@/src/redux/features/productComments/productCommentApi"
import { FaEllipsisV, FaTimes } from "react-icons/fa"



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
    const [reportProductInfo, setReportProductInfo] = useState<ReportedProduct>({
        _id: '',
        productId: {
            _id: typeof id === 'string' ? id : '',
            title: '',
            images: [],
            price: 0,
        },
        reportedBy: {
            _id: '',
            email: '',
            name: ''
        },
        status: 'pending' as 'pending'|'rejected'|'resolved',
        reason: '',
        reportImages: [],
        createdAt: '',
        updatedAt: ''
    })
    const [selectedComment, setSelectedComment] = useState<any>(null);
    const [editingComment, setEditingComment] = useState<any>(null);
    const [bookingMutation,{isLoading:bookingLoading}]=useCreateBookingMutation()
    const [ReportProduct]=useReportProductMutation()
    const [createComment,{isLoading:createCommentLoading}]=useCreateProductCommentMutation()
    const {data:comments}=useGetProductCommentsQuery({productId:id})
    const [deleteComment] = useDeleteProductCommentMutation();
    const [updateComment] = useUpdateProductCommentMutation();
    const handleAddToWishlist = (product: any) => {
        dispatch(addItem(product))
    }


const handleDeleteComment = async (commentId: string) => {
    try {
        await deleteComment(commentId).unwrap();
        // Refetch comments or update local state
        setSelectedComment(null);
    } catch (error) {
        console.error('Failed to delete comment:', error);
    }
};

const handleUpdateReview = async () => {
    if (!editingComment) return;
    
    try {
      const res=  await updateComment({
            commentId: editingComment._id,
            commentData: {
                rating,
                comment: review
            }
        }).unwrap();
        console.log(res,'update review',rating)
    if(res.success){
        toast.info("Updated your comment",{
            position:"top-center",
            autoClose:1000
        })
        setEditingComment(null);
        setReview('');
        setRating(0);
    }
        
    } catch (error) {
         setEditingComment(null);
        toast.error("something went wrong",{
            position:"top-center",
            autoClose:1000
        })
        console.error('Failed to update comment:', error);
    }
};


    const handleReport =async () => {
        try {
         const res=   await ReportProduct({ ...reportProductInfo, productId: product._id, }).unwrap()

         if(res.success){
            toast.success("Product reported successfully!")
            setReported(false)
         }
            

        } catch (error) {
            toast.error("Failed to report product. Please try again later.")
                    setReported(false)

        }

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
        if(res.success){
            toast.success('Saved the product on you cart',{
                position:"top-center"
            })
        }
    } catch (err) {
        
    } finally {
        
    }
}

const handleAddReview=async()=>{
    alert("clicked")
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
                                <span className="ml-2 text-sm text-red-500">(You save ${((Number(product.originalPrice) || 0) - (Number(product.price) || 0)).toFixed(2)})</span>
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
                            Customer Reviews ({comments?.data?.meta?.total})
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
            {comments?.data?.meta.total > 0 ? (
                <div className="space-y-6">
                    {comments?.data?.result.map((review: any) => (
                        <div key={review._id} className="border-b pb-4 relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-medium">{review?.userName || "Guest"}</h4>
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
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 text-sm">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedComment(selectedComment?._id === review._id ? null : review);
                                            }}
                                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <FaEllipsisV className="w-4 h-4" />
                                        </button>
                                        
                                        {selectedComment?._id === review._id && (
                                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                                                <button
                                                    onClick={() => {
                                                        setEditingComment(review);
                                                        setSelectedComment(null);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(review._id)}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 mt-2">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Be the first to review this product!</p>
            )}
        </div>

        {/* Review Form */}
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

        {/* Edit Comment Modal */}
        {editingComment && (
            <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Edit Your Review</h3>
                        <button
                            onClick={() => {
                                setEditingComment(null);
                                setReview('');
                                setRating(0);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes />
                        </button>
                    </div>
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
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => {
                                setEditingComment(null);
                                setReview('');
                                setRating(0);
                            }}
                            className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateReview}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                        >
                            Update Review
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
)}
                </div>
            </div>

            {/* Report Product Section */}
            <div className="border-t pt-6">
                <button
                    onClick={()=>setReported(true)}
                    disabled={reported}
                    className={`flex items-center text-sm ${reported ? 'text-gray-400' : 'text-red-500 hover:text-red-700'}`}
                >
                    <FontAwesomeIcon icon={faFlag} className="mr-2" />
                    {reported ? 'Thank you for your report' : 'Report this Product'}
                </button>
            {reported && (
    <div className="p-6 border-2 border-red-200 rounded-xl bg-red-50 shadow-sm">
        <div className="space-y-5">
            <h3 className="text-xl font-semibold text-red-800">Report Product Issue</h3>
            
            <div>
                <label htmlFor="issue-description" className="block text-sm font-medium text-gray-700 mb-1">
                    What's the issue? <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="issue-description"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    rows={4}
                    required
                    minLength={20}
                    maxLength={500}
                    placeholder="Please provide specific details about the issue with this product..."
                    value={reportProductInfo.reason}
                    onChange={(e) => setReportProductInfo({ ...reportProductInfo, reason: e.target.value })}
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">Please describe the issue in detail (20-500 characters)</p>
            </div>
            
            <div>
                <label className=" text-sm font-medium text-gray-700 mb-1">
                    Upload Images (Optional)
                </label>
                
                <label 
                    htmlFor="file-upload"
                    className="mt-1 flex flex-col justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-300 transition-all cursor-pointer"
                >
                    <div className="space-y-3 text-center ">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className=" text-sm text-gray-600 hidden md:block lg:block">
                            <span className="relative inline bg-white rounded-md font-medium text-red-600 hover:text-red-500">
                                Click to upload
                            </span>
                            <span className="pl-1 inline">or drag and drop</span>
                        </div>
                        <p className="text-xs text-gray-500 hidden md:block lg:block">
                            PNG, JPG, GIF up to 5MB
                        </p>
                    </div>
                    <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            const files = e.target.files ? Array.from(e.target.files) : [];
                            setReportProductInfo({ ...reportProductInfo, reportImages: files as any });
                        }}
                    />
                </label>
                
                    {/* Image preview container */}
            <div id="image-preview" className="mt-3 grid grid-cols-3 gap-3">
    {reportProductInfo.reportImages && reportProductInfo.reportImages.length > 0 ? (
        reportProductInfo.reportImages.map((file, index) => (
            <div key={index} className="relative aspect-square">
                <Image
                    src={URL.createObjectURL(file as any)}
                    alt={`Uploaded image ${index + 1}`}
                    width={100}  // Reduced from 50 to make images smaller
                    height={100} // Added fixed height
                    className="w-full h-full object-cover rounded-lg"
                />
                <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none"
                    onClick={() => {
                        const newImages = [...(reportProductInfo.reportImages || [])];
                        newImages.splice(index, 1);
                        setReportProductInfo({ ...reportProductInfo, reportImages: newImages });
                    }}
                >
                    ×
                </button>
            </div>
        ))
    ) : (
        <p className="text-gray-500">No images uploaded</p>
    )}
</div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                    type="button"
                    className="px-5 py-2.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    onClick={() => setReported(false)}
                >
                    Cancel
                </button>
                <button
                onClick={handleReport}
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                    Submit Report
                </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
                Your feedback helps us improve product quality for everyone.
            </p>
        </div>
    </div>
)}
            </div>
        </div>
    )
}

export default ProductDetails