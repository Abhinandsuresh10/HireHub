import toast from "react-hot-toast";
import { premiumPurchase, completePurchase } from "../../api/user/users";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../store/slices/userDataSlice";
import { RecruiterCompletePurchase, recruiterPremiumPurchase } from "../../api/recruiter/recriuters";
import { addRecruiter } from "../../store/slices/recruiterDataSlice";
import { getPremiumsForCards } from "../../api/admin/premium";


interface Premium {
  _id?: string;
  title: string;
  description: string;
  role: string;
  status: boolean;
  price: number
}

const PremiumModal = ({ role, onClose }: { role: 'user' | 'recruiter', onClose: () => boolean }) => {

  const [id, setId] = useState<string>('');
  const user = useSelector((state: RootState) => state.users.user);
  const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);
  const [premiums, setPremiums] = useState<Premium[]>([])

  useEffect(() => {
    const fetchPremiums = async () => {
      if (role === 'user') {
        setId(user._id);
        const response = await getPremiumsForCards(role);
        if (response.data) {
          setPremiums(response.data.premiums);
        }
      } else {
        setId(recruiter._id);
        const response = await getPremiumsForCards(role);
        if (response.data) {
          setPremiums(response.data.premiums);
        }
      };
    }
    fetchPremiums()
  }, [user, recruiter, role]);

  const [planDetails, setPlanDetails] = useState<Premium>();

  const dispatch = useDispatch();

  const handlePlanDetails = (id: string) => {
    const filterd = premiums.find((item) => item._id === id)
    setPlanDetails(filterd);
    handlePurchase();
  }

  const handlePurchase = async () => {
    if (role === 'user') {
      const response = await premiumPurchase(id, Number(`${planDetails?.price}00`));
      if (response.data) {
        const options = {
          key: "rzp_test_Mwa9XdFzCTCV9f",
          amount: response.data.order.amount,
          currency: response.data.order.currency,
          name: "HireHub Premium",
          description: planDetails?.title,
          order_id: response.data.order.id,
          handler: async function (response: any) {
            const result = await completePurchase(id, response.razorpay_payment_id, Number(planDetails?.price));
            if (result.data) {
              dispatch(addUser({ user: result.data.user }))
            }
            toast.success("Payment successful!");
            onClose();
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: { color: "#2563eb" },
        };

        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } else if (role === 'recruiter') {
      const response = await recruiterPremiumPurchase(id, Number(`${planDetails?.price}00`));
      if (response.data) {
        const options = {
          key: "rzp_test_Mwa9XdFzCTCV9f",
          amount: response.data.order.amount,
          currency: response.data.order.currency,
          name: "HireHub Premium",
          description: planDetails?.title,
          order_id: response.data.order.id,
          handler: async function (response: any) {
            const result = await RecruiterCompletePurchase(id, response.razorpay_payment_id, Number(planDetails?.price));
            console.log(result)
            if (result.data) {
              dispatch(addRecruiter({ recruiter: result.data.recruiter }))
            }
            toast.success("Payment successful!");
            onClose();
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: { color: "#2563eb" },
        };

        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-2xl max-w-[95%] relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold"
        >
          &times;
        </button>

        {/* Modal Title (Optional) */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Choose a Premium Plan</h2>

        {/* Grid Layout for Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
          {premiums && premiums.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 p-4 rounded-lg shadow w-full max-w-xs"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-lg text-blue-600 font-semibold mb-3">{`₹${item.price}/month`}</p>

              <ul className="text-sm text-gray-600 list-disc list-inside mb-4">
                <li>{item.description}</li>
                {item.price === 149 &&
                  <li>validity 10 days</li>
                }
                {item.price === 249 &&
                  <li>validity 15 days</li>
                }
                {item.price === 349 &&
                  <li>validity 20 days</li>
                }
                {item.price === 449 &&
                  <li>validity a month</li>
                }
              </ul>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                onClick={() => handlePlanDetails(item?._id as string)}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>


  )
}

export default PremiumModal
