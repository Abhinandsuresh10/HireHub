import { useEffect, useState } from "react"
import Footer from "../../components/user/Footer"
import Header from "../../components/user/Header"
import { motion, AnimatePresence } from 'framer-motion'
import { getCompanies } from "../../api/user/users"
import { FaCommentDots, FaRegStar, FaStar } from "react-icons/fa"
import toast from "react-hot-toast"
import { addRating, getComments } from "../../api/user/rating"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { CompanyRatingGroup, RatingDetail } from "../../types/rating.types"

const Company = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [companies, setCompanies] = useState<string[]>([]);
  const [companyComments, setCompanyComments] = useState<CompanyRatingGroup[]>([]);

  const user = useSelector((state: RootState) => state.users.user);

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [writeComment, setWriteComment] = useState<string>('');

  const handleSubmitComment = async () => {
    if(hoveredIndex !== null) { 
      if(!writeComment.trim()) {
        toast.error('Write a comment before submitting...');
        return;
      } else if (rating < 1) {
        toast.error("Give rating before submitting...");
        return;
      }
      const response = await addRating(user._id as string, writeComment, rating, companies[hoveredIndex]);
      if(response.data) {
        toast.success(response.data.message);
        setRating(0);
        setHoveredIndex(null);
        setWriteComment('');
        // Refresh comments after adding
        fetchComments();
      }
    }
  }

  // Fetch comments and companies
  const fetchComments = async () => {
    const response = await getComments();
    if(response.data) {
      setCompanyComments(response.data.ratings.data);
    }
  }

  useEffect(() => {
    fetchComments();
  },[])

  useEffect(() => {
   const fetchCompanies = async() => {
    const response = await getCompanies();
    if(response.data) {
       setCompanies(response.data.companies[0].companies);
    }
   }
   fetchCompanies();
  },[])

  // need to add listing jobs and applying them... pending...

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex justify-center items-center p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {companies.map((item, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                layout
                className="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg w-60 h-20 p-4 cursor-pointer z-10 "
                transition={{ layout: { duration: 0.5, type: "spring" } }}
              >
                <p className="text-xs font-semibold">{item}</p>
              </motion.div>

              <AnimatePresence>
                {hoveredIndex === index && (
                 <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 transition={{ duration: 0.3 }}
                 className="absolute top-1/2 left-1/2 w-[90vw] px-2 max-w-full sm:max-w-md -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-2xl z-50 p-6"
               >
                 <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">{item}</h2>
           
                 {/* Interactive Star Rating */}
                 <div className="flex justify-center mb-6">
                   {[1, 2, 3, 4, 5].map((i) => (
                     <span
                       key={i}
                       onClick={() => setRating(i)}
                       onMouseEnter={() => setHovered(i)}
                       onMouseLeave={() => setHovered(0)}
                       className="text-xl cursor-pointer transition-transform hover:scale-110"
                     >
                       {i <= (hovered || rating) ? (
                         <FaStar className="text-yellow-400" />
                       ) : (
                         <FaRegStar className="text-gray-300" />
                       )}
                     </span>
                   ))}
                 </div>
           
                 {/* Buttons */}
                 <div className="flex justify-center gap-4 mb-6">
                   <button className="px-5 py-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-md transition-all" onClick={handleSubmitComment}>
                     <FaCommentDots /> Save Comment
                   </button>
                 </div>
           
                 {/* Comments */}
                 <motion.div className="bg-gray-50 shadow rounded-lg p-4 max-h-40 overflow-y-auto">
                  <textarea
                    value={writeComment}
                    onChange={(e) => setWriteComment(e.target.value)}
                    placeholder="write your comment..."
                    className="text-xs p-2 m-2 w-full focus:outline-blue-400 border border-gray-200 hover:border-blue-500 transition ease-in-out rounded-xl"
                  />
                   <h3 className="text-lg font-semibold text-gray-700 mb-2">Comments</h3>
                   <ul className="space-y-2 text-sm text-gray-700">
                     {(companyComments.find(c => c.company === item)?.ratings || []).map((cmt: RatingDetail, i: number) => (
                       <li key={i} className="flex items-start gap-2">
                         <img
                           src={cmt.user.imageUrl}
                           alt={cmt.user.name}
                           className="w-7 h-7 rounded-full object-cover border"
                         />
                         <div>
                           <span className="font-semibold">{cmt.user.name}</span>
                           <span className="ml-2 text-yellow-500">{'★'.repeat(cmt.stars)}</span>
                           <div>{cmt.comment}</div>
                         </div>
                       </li>
                     ))}
                   </ul>
                 </motion.div>
               </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Company  