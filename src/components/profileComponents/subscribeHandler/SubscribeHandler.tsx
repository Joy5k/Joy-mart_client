

import { useHandleSubscribeUserMutation } from '@/src/redux/features/subscribe/subscribeApi'
import { toast } from 'react-toastify'

function SubscribeHandler() {
      const [subscribeMutation]=useHandleSubscribeUserMutation()

      // unsubsribe user
    const handleSubscribe=async()=>{
      try {
        const res= await subscribeMutation({}).unwrap()
        console.log(res)
        if(res.success){
          toast.success(res?.message,{
            autoClose:500,
            position:'bottom-center'
          })
        }
      } catch(error) {
        console.error(error,"The error from profile")
      }
    }
  return (
    <div>      
         <div className="border-b pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                className="rounded text-[#088178] focus:ring-[#088178]" 
                onChange={handleSubscribe}
              />
              <span>Email notifications</span>
            </label>
    
          </div>
        </div></div>
  )
}

export default SubscribeHandler