interface BannerProps {
    title: string
    subtitle: string
    buttonText: string
  }
  
  const Banner = ({ title, subtitle, buttonText }: BannerProps) => {
    return (
      <section id="banner" className="">
        <h4>{title}</h4>
        <h2 dangerouslySetInnerHTML={{ __html: subtitle }}></h2>
        <button className="normal bg-[#088178] cursor-pointer border-white px-2 py-1 rounded-sm">{buttonText}</button>
      </section>
    )
  }
  
  export default Banner