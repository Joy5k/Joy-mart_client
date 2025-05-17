import Image from "next/image"

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh]">
      {/* Background image */}
      <Image
        src="/img/hero4.webp"
        alt="Super value deals"
        fill
        priority
        quality={85}
        className="object-cover object-[top_25%_right_0]"
        sizes="100vw"
        placeholder="blur"
        blurDataURL="/img/hero4-blur.webp"
      />
      
      {/* Content container */}
      <div className="relative z-10 h-full flex items-center pl-[10%] w-full max-w-[1400px] mx-auto">
        {/* Text content container */}
        <div className="max-w-[750px] p-6 md:p-10 lg:p-20">
          <h4 className="text-xl font-medium pb-[15px]">Trade-in-offer (update)</h4>
          <h2 className="text-5xl font-bold mb-4">Super value deals</h2>
          <h1 className="text-6xl font-extrabold mb-6 text-[#088178]">On all products</h1>
          <p className="text-xl mb-8">Save more with coupons & up to 70% off!</p>
          
          {/* Custom button */}
          <button 
            className="relative inline-flex items-center justify-center 
                      text-[#088178] font-bold text-[15px] 
                      py-[14px] pl-[65px] pr-[80px]
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