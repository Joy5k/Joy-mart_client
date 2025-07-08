'use client'

import { useGetProductsQuery } from "@/src/redux/features/productManagement/productApi"
import ProductCard from "../ProductCart/ProductCart"
import { IProduct } from "@/src/types"
import Loader from "@/src/hooks/loader"

function SummerCollection() {
     const {data,isLoading,isError}=useGetProductsQuery({})
      const products: IProduct[] = data ? data?.data?.result || [] : []
            if(isLoading) {return <Loader></Loader>}
      
  return (
    <div>   
           <section id="product1" className="px-10 py-10 md:py-20 lg:py-20">
        <h2 className="text-2xl font-bold text-gray-800">New Arrivals</h2>
        <p className="text-xl font-bold text-gray-700">Summer Collection New Modern Design</p>
        <div className="pro-container">
          {products.slice(6).map((product:IProduct) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section></div>
  )
}

export default SummerCollection