import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { io, Socket } from "socket.io-client";
import { deleteNotification, fetchNotifications } from "../../api/user/notification";
import toast from "react-hot-toast";
import { verifyPassword } from "../../api/user/users";
import RecruiterAPI from "../../config/recruiterApi";

const socket:Socket = io("http://localhost:5000");


interface NotificationItem {
  _id: string;
  content: string;
  offerLetter?: string;
  date: string;
}

interface OfferItem {
  fileUrl: string;
  onClose: () => void;
}

// to debounce and make a delay
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

const OfferLetterModal:React.FC<OfferItem> = ({ onClose, fileUrl}) => {
  const [password, setPassword] = useState<string>('');
  const debouncedSearch = useDebounce(password, 500);
  const user = useSelector((state: RootState) => state.users.user);

    useEffect(() => {
    if (debouncedSearch.trim()) {
      const passwordVerify = async() => {
        const response = await verifyPassword(debouncedSearch, user._id);
        if(response.data) {
          toast.success(response.data.message);
           try {
           const response = await RecruiterAPI.post(
             `/downloadPdf`,
             { fileUrl },
             {
               responseType: 'blob', 
               headers: {
                 'Content-Type': 'application/json',
               },
             }
           );
       
           const blob = new Blob([response.data], { type: 'application/pdf' });
       
           const contentDisposition = response.headers['content-disposition'];
           let fileName = 'offerLetter.pdf';
           if (contentDisposition) {
             const match = contentDisposition.match(/filename="?(.+)"?/);
             if (match?.[1]) {
               fileName = match[1];
             }
           }
       
           const downloadUrl = window.URL.createObjectURL(blob);
           const link = document.createElement('a');
           link.href = downloadUrl;
           link.setAttribute('download', fileName);
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
       
           window.URL.revokeObjectURL(downloadUrl);

           onClose();

           } catch (error) {
             console.error('Error downloading resume:', error);
             alert('Failed to download resume');
           }
        }
      }
      passwordVerify();
    }
  }, [debouncedSearch, user, fileUrl, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-30 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xs flex flex-col items-center ">
          <p className="text-black text-xs">Please enter your password to download offerLetter ?</p>
          <div className="flex justify-between items-center space-x-10">
          <button onClick={onClose} className="text-xs text-white px-2 py-1 m-2 bg-red-600 rounded-lg">close</button>
          <input type='password' className="border border-black rounded px-2 py-0.5" onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
      </div>
  )
}

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offerModal, setOfferModal] = useState(false);
  const [offerLetter, setOfferLetter] = useState<string>('');

  const user = useSelector((state: RootState) => state.users.user);

 

  useEffect(() => {
   const getNotifications = async () => {
    setLoading(true);
    const res = await fetchNotifications(user._id, page, limit);
    setNotifications(res.data);
    setTotal(res.total);
    setLoading(false);
    };
    getNotifications()
  }, [page, limit, user]);

  useEffect(() => {
    socket.emit('join_room', user._id)

    socket.on('new_notification', (data) => {
        setNotifications((prev) => [data, ...prev])
    });

    return () => {
        socket.off('new_notification')
    }
  },[user])

  const handleDelete = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    const response = await deleteNotification(id);
    if(response.data) {
      toast.success(response.data.message)
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <Header />
    <main className="flex-1">
      <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg min-h-[300px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h2>
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No notifications found.</div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 shadow-sm"
              >
                <div>
                  <div className="text-gray-700">{notif.content}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(notif.date).toLocaleString()}
                  </div>
                  <div className="flex flex-row space-x-2 mt-2">
                  <button
                    onClick={() => handleDelete(notif._id)}
                    className="text-white text-sm font-medium px-2 py-1 rounded transition bg-red-500 "
                    title="Delete"
                  >
                    Delete
                  </button>
                  {notif.offerLetter && 
                    <button
                    className="text-white bg-green-500 text-sm font-medium px-2 py-1 rounded transition "
                    title="Download" onClick={() => { setOfferModal(true); setOfferLetter(notif.offerLetter as string) }}>
                    Download OfferLetter
                    </button>
                    }
                    </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
    <Footer />
    {offerModal && <OfferLetterModal onClose={() => setOfferModal(false)} fileUrl={offerLetter} />}
  </div>
);
};

export default Notification;
