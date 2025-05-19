'use client'
import Image from "next/image"
interface FeatureBoxProps {
  image: string
  title: string
}

const FeatureBox = ({ image, title }: FeatureBoxProps) => {
  return (
    <div className="fe-box relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out group overflow-hidden mb-5 mr-7 ">
      {/* Subtle background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity duration-500 -translate-x-full group-hover:translate-x-0" />
      
      {/* Image with gentle float effect */}
      <div className="flex justify-center mb-4 transform transition-transform duration-500 group-hover:-translate-y-1 ">
        <Image 
          src={image} 
          alt={title}  
          width={80} 
          height={80}
          className="object-contain h-16 w-16 group-hover:scale-110 transition-transform duration-300"
          loading="lazy" // Optimized loading
        />
      </div>
      
      {/* Text with fade-in underline */}
      <h3 className="text-center text-lg font-medium text-gray-800 relative inline-block">
        {title}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300 ease-out" />
      </h3>
      
      {/* Performance-optimized pulse effect (only on render) */}
      <style jsx>{`
        @keyframes subtlePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        .fe-box {
          animation: subtlePulse 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default FeatureBox