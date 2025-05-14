interface BannerProps {
    title: string
    subtitle: string
    buttonText: string
  }
  
  const Banner = ({ title, subtitle, buttonText }: BannerProps) => {
    return (
      <section id="banner" className="section-m1">
        <h4>{title}</h4>
        <h2 dangerouslySetInnerHTML={{ __html: subtitle }}></h2>
        <button className="normal">{buttonText}</button>
      </section>
    )
  }
  
  export default Banner