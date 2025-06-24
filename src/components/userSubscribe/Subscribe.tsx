'use client'

import Loader from "@/src/hooks/loader"
import { useCreateSubscribeMutation } from "@/src/redux/features/subscribe/subscribeApi"
import { useState } from "react"
import { toast } from "react-toastify"

function Subscribe() {
    const [subscribeUser,{isLoading,isError}]=useCreateSubscribeMutation()
    const [email,setEmail]=useState<string>('')

    const handleSubscribe=async()=>{
        try {
            const res=await subscribeUser({email}).unwrap()
            if(res.success){
                toast.success('Welcome to JoyMart.You Successfully Subscribed ',{
                  position:"top-center",
                 
                })
            }
        }
        catch(error){
            console.log(error)
        }
    }

  return (
    <div>
        {/* Subscribe to Newsletter */}
       <section id="newsletter" className="px-10 py-10 md:py-20 lg:20 my-10">
        <div className="newstext">
          <h4>Sign Up For Newsletters</h4>
          <p>Get E-mail updates about our latest shop and <span>special offers.</span></p>
        </div>
        <form className="form">
          <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="Your email address" />
          {
            isLoading ? <Loader></Loader> :    <button type="submit" onClick={handleSubscribe} className=" px-5 rounded-r-2xl cursor-pointer">Sign Up</button>

          }
        </form>
       </section>
      </div>
  )
}

export default Subscribe