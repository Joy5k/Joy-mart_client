import Banner from "@/src/components/Banner/Banner"
import Hero from "@/src/components/Hero/Hero"
import FeatureBox from "@/src/components/FeatureBox/FeatureBox"
import Footer from "@/src/components/Footer/Footer"
import Navbar from "@/src/components/Navbar/Navbar"
import ProductCard from "@/src/components/ProductCart/ProductCart"
import { NextPage } from "next"

interface Product {
  id: number
  image: string
  brand: string
  name: string
  price: number
}

const HomePage: NextPage = () => {
  const featuredProducts: Product[] = [
    { id: 1, image: '/img/products/f1.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 2, image: '/img/products/f2.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 3, image: '/img/products/f3.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 4, image: '/img/products/f4.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 5, image: '/img/products/f5.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 6, image: '/img/products/f6.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 7, image: '/img/products/f7.jpg', brand: 'adidas', name: 'Cartoon Ladies paint', price: 78 },
    { id: 8, image: '/img/products/f8.jpg', brand: 'adidas', name: 'Cartoon Astronaut Dress', price: 78 },
  ]

  const newArrivals: Product[] = [
    { id: 9, image: '/img/products/n1.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 10, image: '/img/products/n2.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 11, image: '/img/products/n3.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 12, image: '/img/products/n4.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 13, image: '/img/products/n5.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
    { id: 14, image: '/img/products/n6.jpg', brand: 'adidas', name: 'Cartoon Astronaut Paint', price: 78 },
    { id: 15, image: '/img/products/n7.jpg', brand: 'adidas', name: 'Cartoon Astronaut Shirts', price: 78 },
    { id: 16, image: '/img/products/n8.jpg', brand: 'adidas', name: 'Cartoon Astronaut T-Shirts', price: 78 },
  ]

  const features = [
    { image: '/img/features/f1.png', title: 'Free Shipping' },
    { image: '/img/features/f2.png', title: 'Online Order' },
    { image: '/img/features/f3.png', title: 'Save Money' },
    { image: '/img/features/f4.png', title: 'Promotions' },
    { image: '/img/features/f5.png', title: 'Happy Sell' },
    { image: '/img/features/f6.png', title: '24/7 Support' },
  ]

  return (
    <>
      <Navbar />
      
      {/* <section id="hero">
        <h4>Trade-in-offer</h4>
        <h2>Super value deals</h2>
        <h1>On all products</h1>
        <p>Save more with coupons & up to 70% off!</p>
        <button>Shop Now</button>
      </section> */}

        <div>
          <Hero></Hero>
        </div>
      <section id="feature" className="section-p1">
        {features.map((feature, index) => (
          <FeatureBox key={index} image={feature.image} title={feature.title} />
        ))}
      </section>

      <section id="product1" className="section-p1">
        <h2>Featured Products</h2>
        <p>Summer Collection New Modern Design</p>
        <div className="pro-container">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Banner 
        title="Repair Services" 
        subtitle="Up to 70% Off - All t-shirts & Accessories" 
        buttonText="Explore More" 
      />

      <section id="product1" className="section-p1">
        <h2>New Arrivals</h2>
        <p>Summer Collection New Modern Design</p>
        <div className="pro-container">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

{/* Advertisement Static two carts */}
      <section id="sm-banner" className="section-p1">
        <div className="banner-box">
          <h4>crazy deals</h4>
          <h2>buy 1 get 1 free</h2>
          <span>The best classic dress is on sale at cara</span>
          <button className="white">Learn More</button>
        </div>
        <div className="banner-box banner-box2">
          <h4>spring/summer</h4>
          <h2>upcoming season</h2>
          <span>The best classic dress is on sale at cara</span>
          <button className="white">Collection</button>
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
      <section id="newsletter" className="section-p1 section-m1">
        <div className="newstext">
          <h4>Sign Up For Newsletters</h4>
          <p>Get E-mail updates about our latest shop and <span>special offers.</span></p>
        </div>
        <div className="form">
          <input type="text" placeholder="Your email address" />
          <button className="normal">Sign Up</button>
        </div>
      </section>

      <Footer  />
    </>
  )
}

export default HomePage