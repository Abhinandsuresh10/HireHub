import Footer from "../../components/user/Footer"
import RecruiterHeader from "../../components/recruiter/RecruiterHeader"
import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { addOfferLetter, getCompletedInterviews } from "../../api/recruiter/recriuters";
import { User2 } from "lucide-react";
import { CardContent } from "../../components/ui/card";
import toast from "react-hot-toast";
import { socket } from "../../utils/socket";
import { hireInterviewe } from "../../api/user/userApplication";

interface CompletedInterviewsProps {
    userId: string;
    onClose: () => void;
}

interface CompletedInterview {
    _id: string;
    applicationId: string;
    name: string;
    imageUrl: string;
    jobRole: string;
    status: string;
    date: Date;
}

const Modal: React.FC<CompletedInterviewsProps> = ({ onClose, userId }: { onClose: () => void, userId: string }) => {

    const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);

    const handleSubmit = async (e) => {
        const filename = e.target.files?.[0];
        const formData = new FormData();
        formData.append('offerLetter', filename);
        console.log('this is the one : ', formData)
        if (filename) {
            const response = await addOfferLetter(formData, userId)
            if (response.data) {

                onClose();
                const notification = {
                    senderId: recruiter._id,
                    offerLetter: response.data.offerLetter,
                    content: `${recruiter.name}, have sented you offerLetter. please download`,
                    userId: userId
                }
                socket.emit('shedule_interview', notification);
                toast.success('offer letter sented')
            }
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-30 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xs flex flex-col items-center">
                <p className="text-black text-xs">Are you sure that you want to upload offer letter ?</p>
                <div className="flex justify-between items-center space-x-10">
                    <button onClick={onClose} className="text-xs text-white px-2 py-1 m-2 bg-red-600 rounded-lg">close</button>
                    <label htmlFor="offer-letter" className="text-xs max-w-40 text-white px-2 py-1 m-2 bg-green-600 rounded-lg cursor-pointer">select & submit</label>
                    <input type='file' id='offer-letter' accept=".pdf" className="hidden" onChange={(e) => handleSubmit(e)} />
                </div>
            </div>
        </div>
    )
}

const CompletedInterviews = () => {

    const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);
    const [interviewers, setInterviewers] = useState<CompletedInterview[]>();
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(9);
    const [total, setTotal] = useState<number>(0);
    const [selectedInterviewId, setSelectedInterviewId] = useState<string>('')
    const [offerModal, setOfferModal] = useState(false);
    const [change, setChange] = useState(0);

    useEffect(() => {
        const getCompletedInterview = async () => {
            const response = await getCompletedInterviews(recruiter._id as string, page, limit);
            if (response.data) {
                setInterviewers(response.data.interviewers);
                setTotal(response.data.total);
                setLimit(9);
            }
        }
        getCompletedInterview();
    }, [recruiter, page, limit, change]);

    const totalPages = Math.ceil(total / limit);

    const handlSubmit = (id: string) => {
        setSelectedInterviewId(id);
        setOfferModal(true);
        setChange(prev => prev + 1)
    }

    const handleHire = async (id: string) => {
        const response = await hireInterviewe(id);
        if (response.data) {
            setChange(prev => prev + 1);
            toast.success(response.data.message);
        }
    }


    return (
        <div className="flex flex-col min-h-screen bg-gray-100 shadow-2xl">
            {/* Header */}
            <header className="w-full z-50">
                <RecruiterHeader />
            </header>

            {/* Main Content */}
            <main>
                <div className="p-2 px-4 sm:px-8 m-2 sm:m-6 w-full flex justify-center min-h-full">
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        {interviewers &&
                            interviewers.map((interview, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 p-4 rounded-xl border shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Left: Info */}
                                        <div className="flex-1">
                                            <p className="text-base font-medium">{interview.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {interview.jobRole}
                                            </p>
                                            <p className="text-xs text-green-700 mt-2">
                                                {interview.status}
                                            </p>
                                        </div>

                                        {/* Right: Avatar */}
                                        <div className="flex flex-col items-center gap-2">
                                            {interview.imageUrl ? (
                                                <img
                                                    src={interview.imageUrl}
                                                    alt=""
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            ) : (
                                                <>
                                                    <User2 className="w-10 h-10 bg-gray-200 rounded-full text-gray-700" />

                                                </>

                                            )}
                                            <div className="w-full flex flex-row space-x-2">
                                                {interview.status !== 'Hired' &&
                                                <>
                                                    <button className="text-xs px-2 py-1 text-white rounded-lg bg-green-700" onClick={() => handleHire(interview.applicationId)} >
                                                        Hire
                                                    </button>
                                                <button className="text-xs px-2 py-1 text-white rounded-lg bg-red-700" >
                                                    Reject
                                                </button>
                                                </>
                                                }
                                                {interview.status === 'Hired' &&
                                                    <button className="text-xs px-2 py-1 text-white rounded-lg bg-blue-700" onClick={() => handlSubmit(interview._id)}>
                                                        OfferLetter
                                                    </button>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </CardContent>
                </div>
            </main>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 mb-4">
                <button
                    className="px-4 py-1 m-2 bg-black text-white rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <p className="px-4 py-1 m-2 bg-black rounded text-white">
                    {page} / {totalPages || 1}
                </p>
                <button
                    className="px-4 py-1 m-2 bg-black text-white rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>

            {/* Footer */}
            <footer className="w-full z-50 mt-auto">
                <Footer />
            </footer>
            {offerModal && <Modal onClose={() => setOfferModal(false)} userId={selectedInterviewId} />}
        </div>
    )
}

export default CompletedInterviews
