
import Banner from "@/src/components/Banner/Banner"
import Hero from "@/src/components/Hero/Hero"
import FeatureBox from "@/src/components/FeatureBox/FeatureBox"
import { NextPage } from "next"
import SummerCollection from "@/src/components/summerCollection/SummerCollection"
import NewArrivals from "@/src/components/newArrivalsCollections/NewArrivals"
import Subscribe from "@/src/components/userSubscribe/Subscribe"



  const features = [
    { id:1, image: '/img/features/f1.png', title: 'Free Shipping' },
    { id:2, image: '/img/features/f2.png', title: 'Online Order' },
    { id:3, image: '/img/features/f3.png', title: 'Save Money' },
    { id:4, image: '/img/features/f4.png', title: 'Promotions' },
    { id:5, image: '/img/features/f5.png', title: 'Happy Sell' },
    { id:6, image: '/img/features/f6.png', title: '24/7 Support' },
  ]

const HomePage: NextPage = async() => {

  return (
    <>
 
        <div>
          
     
          <Hero></Hero>
        </div>
      <section id="feature" className="py-10 md:py-20 lg:py-20 flex justify-center align-middle items-center flex-wrap">
        {features.map((feature, index) => (
          <FeatureBox key={index} image={feature.image} title={feature.title} />
        ))}
      </section>

      {/* //new arrivals products appearing */}
        <NewArrivals></NewArrivals>

      <Banner 
        title="Repair Services" 
        subtitle="Up to 70% Off - All t-shirts & Accessories" 
        buttonText="Explore More" 
      />
      
{/* // summer collection products appearing here */}
          <SummerCollection></SummerCollection>

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

        <Subscribe></Subscribe>

    </>
  )
}

export default HomePage