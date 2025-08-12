import Footer from "../../components/user/Footer";
import RecruiterHeader from "../../components/recruiter/RecruiterHeader";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IuserProfile } from "../../types/user.types";
import { getUserDetails } from "../../api/recruiter/recriuters";
import { User2, FileText, File } from "lucide-react";
import Loader from "../../components/ui/Loader";

const ViewAnyUserProfile = () => {
  const [user, setUser] = useState<IuserProfile>();
  const { id } = useParams();

  useEffect(() => {
    const getUser = async () => {
      const response = await getUserDetails(id as string);
      if (response.data) {
        setUser(response.data.user);
      }
    };
    getUser();
  }, [id]);

  if (!user) {
    return (
        <>
       <RecruiterHeader />
          <Loader />
       <Footer />
       </>
    )
  }

  return (
    <>
      <RecruiterHeader />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 sm:px-8 py-10">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl">
          {/* Header Section */}
          <div className="flex items-center space-x-6">
            {user.imageUrl ? (
              <>
              <img
                src={user.imageUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border"
              />
              
              </>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border">
                <User2 className="w-10 h-10 text-gray-500" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-600">{user.mobile}</p>
              <p className="text-sm text-gray-600">📍 {user.location}</p>
            </div>
          </div>

          {/* Skills */}
          {user.skills?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {user.education && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700">Education</h3>
              <div className="text-sm text-gray-600 mt-2">
                <p>
                  🎓 <strong>{user.education.education}</strong> at{" "}
                  {user.education.institute}
                </p>
                <p>📅 Graduated: {new Date(user.education.graduateDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {/* Experience */}
          {user.experience && user.experience?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700">Experience</h3>
              <div className="mt-2 space-y-3">
                {user.experience.map((exp, idx) => (
                  <div key={idx} className="text-sm text-gray-600 border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold">{exp.title}</p>
                    <p>🏢 {exp.jobTitle} <span className="font-semibold text-gray-800"> @{exp.company}</span></p>
                    <p>🕒 {exp.duration}</p>
                    <p>🏆 {exp.achievements}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume & Cover Letter */}
          <div className="mt-6 flex gap-4">
            {user.resumeUrl && (
              <a
                href={user.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Resume
              </a>
            )}
            {user.coverLetter && (
              <a
                href={user.coverLetter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                <File className="w-4 h-4 mr-2" />
                View Cover Letter
              </a>
            )}
            
         {/* chat is in pending do it after other tasks */}

            {/* <button  className="flex items-center text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer">
              <MessageCircle className="w-4 h-4 mr-2"/>
                Chat
            </button> */}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewAnyUserProfile;
