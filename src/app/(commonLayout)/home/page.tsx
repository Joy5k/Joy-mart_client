import Banner from "@/src/components/Banner/Banner"
import Hero from "@/src/components/Hero/Hero"
import FeatureBox from "@/src/components/FeatureBox/FeatureBox"
import ProductCard from "@/src/components/ProductCart/ProductCart"
import { NextPage } from "next"

interface Product {
  _id: string
  image: string
  category: {categoryName:string}
  title: string
  price: number
  description: string
  stock: number
  images: string[]
}
 export const featuredProducts: Product[] = [
    { _id: '1', image: '/img/products/f1.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 10, images: ['/img/products/f1.jpg'] },
    { _id: '2', image: '/img/products/f2.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 12, images: ['/img/products/f2.jpg'] },
    { _id: '3', image: '/img/products/f3.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 8, images: ['/img/products/f3.jpg'] },
    { _id: '4', image: '/img/products/f4.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 15, images: ['/img/products/f4.jpg'] },
    { _id: '5', image: '/img/products/f5.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 20, images: ['/img/products/f5.jpg'] },
    { _id: '6', image: '/img/products/f6.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 7, images: ['/img/products/f6.jpg'] },
    { _id: '7', image: '/img/products/f7.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Ladies paint', price: 78, description: 'A stylish ladies paint.', stock: 9, images: ['/img/products/f7.jpg'] },
    { _id: '8', image: '/img/products/f8.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut Dress', price: 78, description: 'A trendy astronaut dress.', stock: 11, images: ['/img/products/f8.jpg'] },
  ]
 export const newArrivals: Product[] = [
    { _id: '9', image: '/img/products/n1.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 10, images: ['/img/products/n1.jpg'] },
    { _id: '10', image: '/img/products/n2.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 12, images: ['/img/products/n2.jpg'] },
    { _id: '11', image: '/img/products/n3.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 8, images: ['/img/products/n3.jpg'] },
    { _id: '12', image: '/img/products/n4.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 15, images: ['/img/products/n4.jpg'] },
    { _id: '13', image: '/img/products/n5.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 20, images: ['/img/products/n5.jpg'] },
    { _id: '14', image: '/img/products/n6.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut Paint', price: 78, description: 'A stylish astronaut paint.', stock: 7, images: ['/img/products/n6.jpg'] },
    { _id: '15', image: '/img/products/n7.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut Shirts', price: 78, description: 'A cool astronaut shirt.', stock: 9, images: ['/img/products/n7.jpg'] },
    { _id: '16', image: '/img/products/n8.jpg', category: {categoryName:'adidas'}, title: 'Cartoon Astronaut T-Shirts', price: 78, description: 'A cool astronaut t-shirt.', stock: 11, images: ['/img/products/n8.jpg'] },

  ]

  const features = [
    { id:1, image: '/img/features/f1.png', title: 'Free Shipping' },
    { id:2, image: '/img/features/f2.png', title: 'Online Order' },
    { id:3, image: '/img/features/f3.png', title: 'Save Money' },
    { id:4, image: '/img/features/f4.png', title: 'Promotions' },
    { id:5, image: '/img/features/f5.png', title: 'Happy Sell' },
    { id:6, image: '/img/features/f6.png', title: '24/7 Support' },
  ]

const HomePage: NextPage = () => {

 

  return (
    <>
 
        <div>
          <Hero></Hero>
        </div>
      <section id="feature" className=" py-10 md:py-20 lg:py-20 flex justify-center align-middle items-center flex-wrap">
        {features.map((feature, index) => (
          <FeatureBox key={index} image={feature.image} title={feature.title} />
        ))}
      </section>

      <section id="product1" className="px-10 py-10 md:py-20 lg:py-20">
        <h2 className="text-2xl font-black text-gray-800 ">Featured Products</h2>
        <p className="text-gray-700 font-semibold text-xl">Summer Collection New Modern Design</p>
        <div className="pro-container">
          {featuredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <Banner 
        title="Repair Services" 
        subtitle="Up to 70% Off - All t-shirts & Accessories" 
        buttonText="Explore More" 
      />

      <section id="product1" className="px-10 py-10 md:py-20 lg:py-20">
        <h2 className="text-2xl font-bold text-gray-800">New Arrivals</h2>
        <p className="text-xl font-bold text-gray-700">Summer Collection New Modern Design</p>
        <div className="pro-container">
          {newArrivals.map((product:Product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

{/* Advertisement Static two carts */}
      <section id="sm-banner" className="px-10 py-10 md:py-20 lg:py-20">
        <div className="banner-box">
          <h4>crazy deals</h4>
          <h2>buy 1 get 1 free</h2>
          <span>The best classic dress is on sale at joy_mart</span>
          <button className="white p-2 text-white border cursor-pointer">Learn More</button>
        </div>
        <div className="banner-box banner-box2">
          <h4>spring/summer</h4>
          <h2>upcoming season</h2>
          <span>The best classic dress is on sale at joy_mart</span>
          <button className="white p-2 text-white border cursor-pointer">Learn More</button>
        </div>
      </section>


{/* products vareities Advertisement */}
      <section id="banner3">
        <div className="banner-box">
          <h2>SEASONAL SALE</h2>
          <h3>Winter Collection - 50% OFF</h3>
        </div>
        <div className="banner-box banner-box2">
          <h2>NEW FOOTWEAR COLLECTION</h2>
          <h3>Spring / Summer 2022</h3>
        </div>
        <div className="banner-box banner-box3">
          <h2>T-SHIRTS</h2>
          <h3>New Trendy Prints</h3>
        </div>
      </section>

{/* Subscribe to Newsletter */}
      <section id="newsletter" className="px-10 py-10 md:py-20 lg:20 my-10">
        <div className="newstext">
          <h4>Sign Up For Newsletters</h4>
          <p>Get E-mail updates about our latest shop and <span>special offers.</span></p>
        </div>
        <div className="form">
          <input type="text" placeholder="Your email address" />
          <button className=" px-5 rounded-r-2xl cursor-pointer">Sign Up</button>
        </div>
      </section>

    </>
  )
}

export default HomePage