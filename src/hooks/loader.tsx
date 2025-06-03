import React from 'react'

function Loader() {
  return (
     <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#088178]"></div>
            </div>
  )
}

export default Loader