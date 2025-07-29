'use client'

import { useLoginWithSocialMutation } from "@/src/redux/features/Auth/authApi";
import { SocialSession } from "@/src/utils/socialAuth";
import Image from "next/image";
import { useEffect } from "react";

const Hero = () => {
    const [socialLoginMutation]=useLoginWithSocialMutation()
  
    const handleSocialLogin=async()=>{
    const session= await  SocialSession()
    if(session){
      
      const res=await socialLoginMutation({data:session})
      console.log(res,'response from social login')
    }
    console.log(session)
  }
  useEffect(()=>{
    handleSocialLogin()
  },[])
  return (
    <section className="relative w-full h-[90vh] md:h-[80vh]">
      {/* Background image */}
      <Image
        src="/img/hero4.webp"
        alt="Super value deals"
        fill
        priority
        quality={85}
        className="object-cover object-[top_25%_right_0] md:object-center"
        sizes="100vw"
        placeholder="blur"
        blurDataURL="/img/hero4-blur.webp"
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 md:bg-transparent"></div>
      
      {/* Content container */}
      <div className="relative z-10 h-full flex items-center pl-[5%] md:pl-[10%] w-full max-w-[1400px] mx-auto">
        {/* Text content container */}
        <div className="max-w-[750px] p-4 md:p-6 lg:p-20 bg-white/80 md:bg-transparent rounded-lg md:rounded-none mx-4 md:mx-0">
          <h4 className="text-base md:text-xl font-medium pb-2 md:pb-[15px]">
            Trade-in-offer (update)
          </h4>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
            Super value deals
          </h2>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 text-[#088178]">
            On all products
          </h1>
          <p className="text-sm md:text-xl mb-4 md:mb-8">
            Save more with coupons & up to 70% off!
          </p>
          
          {/* Custom button */}
          <button 
            className="relative inline-flex items-center justify-center 
                      text-[#088178] font-bold text-sm md:text-[15px] 
                      py-2 md:py-[14px] pl-12 md:pl-[65px] pr-16 md:pr-[80px]
                      cursor-pointer hover:opacity-90 transition-opacity 
                      overflow-hidden border-0 bg-transparent"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src="/img/button.webp"
                alt=""
                fill
                className="object-cover"
                quality={85}
                loading="eager"
              />
            </div>
            <span className="relative z-10">Shop Now</span>
          </button>
        </div>
      </div>
    </section>
  )
}
export default Hero;