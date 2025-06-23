'use client'


import { useGetProductsQuery } from '@/src/redux/features/productManagement/productApi'
import ProductCard from '../ProductCart/ProductCart'
import { IProduct } from '@/src/types'
import Loader from '@/src/hooks/loader'

function NewArrivals() {
      const {data,isLoading,isError}=useGetProductsQuery({})
      const products: IProduct[] = data ? data?.data?.result || [] : []
      console.log(products)
      if(isLoading) {return <Loader></Loader>}
  return (
    <div>
          <section id="product1" className="px-10 py-10 md:py-20 lg:py-20">
            <h2 className="text-2xl font-black text-gray-800 ">Featured Products</h2>
            <p className="text-gray-700 font-semibold text-xl">Summer Collection New Modern Design</p>
            <div className="pro-container">
              {products.slice(0,8)?.map((product:IProduct) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section></div>
  )
}

export default NewArrivals