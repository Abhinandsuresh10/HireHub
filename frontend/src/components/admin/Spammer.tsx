import { getSpammer } from "../../api/common/Spam";
import { Loader, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SpammerProps {
    data: {
        refId: string,
        role: string
    } | null;
    onClose: () => void;
}

interface ISpammer {
   imageUrl: string;
   email: string;
   name: string;
}


const Spammer:React.FC<SpammerProps> = ({data, onClose}) => {
  const [spammer, setSpammer] = useState<ISpammer>()
  useEffect(() => {
   const fetchSpammer = async () => {
    const response = await getSpammer(data?.refId as string, data?.role as string);
    if(response.data) {
       setSpammer(response.data.spammer);
    }
   }
   fetchSpammer();
  }, [data]);
  
  if(!spammer) {
    return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xs flex flex-col items-center">
          <span className="animate-spin text-cyan-700 mb-2">
            <Loader size={20} />
          </span>
          <p className="text-gray-600 text-xs">Loading spammer details...</p>
        </div>
      </div>
    )
  }

  return (
     <div className="fixed inset-0 z-50 backdrop-brightness-30 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs sm:max-w-sm relative m-2">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
          <X size={20}/>
        </button>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-gray-200 border border-gray-400 w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
            <img src={spammer?.imageUrl} alt="" className="w-20 h-20 rounded-full object-cover" />
          </div>
          <div className="flex justify-center w-full mt-2">
            <span className="px-3 py-1 bg-red-400 text-white text-xs rounded-2xl font-semibold">
              {data?.role}
            </span>
          </div>
          <div className="flex flex-col items-center mt-2">
            <h1 className="text-base font-semibold text-gray-800">{spammer?.name}</h1>
            <p className="text-xs text-gray-600">{spammer?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Spammer
