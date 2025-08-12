

const Loader = () => {
  return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-8 md:px-20">
        <div className="w-full max-w-7xl p-6 flex items-center justify-center">
         <div className="w-72 h-48 rounded-xl flex items-center justify-center">
           <div className="flex space-x-1">
           <span className="h-1 w-1 bg-black rounded-full animate-bounce [animation-delay:0.6s]"></span>
           <span className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></span>
           <span className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
           <span className="h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:0s]"></span>
           <span className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:0.6s]"></span>
           <span className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></span>
           <span className="h-1 w-1 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
           </div>
        </div>
         </div>
 </div>
  )
}

export default Loader
