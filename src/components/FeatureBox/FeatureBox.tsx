import Image from "next/image"

interface FeatureBoxProps {
    image: string
    title: string
  }
  
  const FeatureBox = ({ image, title }: FeatureBoxProps) => {
    return (
      <div className="fe-box">
        <Image src={image} alt={title}  width={80} height={100}/>
        <h6 className="text-pretty">{title}</h6>
      </div>
    )
  }
  
  export default FeatureBox