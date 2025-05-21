import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { io, Socket } from "socket.io-client";
import { deleteNotification, fetchNotifications } from "../../api/user/notification";
import toast from "react-hot-toast";

const socket:Socket = io("http://localhost:5000");


interface NotificationItem {
  _id: string;
  content: string;
  date: string;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

 

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
                </div>
                <button
                  onClick={() => handleDelete(notif._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded transition"
                  title="Delete"
                >
                  Delete
                </button>
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
  </div>
);
};

export default Notification;
