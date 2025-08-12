import { useState } from "react";
import { PremiumFormData } from "../../types/premiums.types";
import toast from "react-hot-toast";
import { deletePremium, patchPremium } from "../../api/admin/premium";

interface PremiumCardProps {
    premium: PremiumFormData;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}

const PremiumCard = ({ premium, onDelete, onEdit}: PremiumCardProps) => {
    const [status, setStatus] = useState(premium.status);
    const backgroundImage = (premium.price > 250 ? 'url("/golden-pack.avif")' : 'url("/silver-pack2.avif")');

    const handleStatus = async () => {
        setStatus(!status);
        const response = await patchPremium(premium?._id as string);
        if (response.data) {
            toast.success(`status changed to ${status ? 'Inactive' : 'Active'}`);
        }
    }

    const handleDelete = async () => {
        onDelete(premium?._id as string)
        const response = await deletePremium(premium?._id as string);
        if (response) {
            toast.success(response.data.message);
        }
    }

    return (
            <div
                className="max-w-full w-90 min-h-44 rounded-2xl shadow-2xl text-white bg-cover bg-center relative overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), ${backgroundImage}`,
                }}
            >
                <div className="flex flex-col justify-between h-full p-4">
                    {/* Top Right Label */}
                    <div className="w-full flex justify-end">
                        <p className="text-sm font-semibold">{premium.price > 250 ? 'Gold Plan' : 'Silver Plan'}</p>
                    </div>

                    {/* Middle Section: Plan Info */}
                    <div>
                        <h2 className="text-lg font-bold mb-1">🌟 Premium Plan</h2>
                        <p className="text-sm text-white/80">
                            💰 Plan: <span className="font-semibold text-white">₹{premium.price}</span>
                        </p>
                        <p className="text-sm text-white/80">
                            👤 Role: <span className="font-semibold text-white">{premium.role}</span>
                        </p>
                        <p className="text-sm text-white/80">
                            📝 Decription: <span className="font-semibold text-white">{premium.description}</span>
                        </p>
                        <p className="text-sm text-white/80">
                            ⏳ createdAt:{" "}
                            <span className="font-semibold text-white">
                                {premium?.createdAt && new Date(premium?.createdAt).toLocaleDateString()}
                            </span>
                        </p>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="flex gap-3 mt-2">
                        <button className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 transition"
                        onClick={() => onEdit(premium?._id as string)}
                        >Edit</button>
                        <button className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-700 transition" onClick={handleDelete}>
                            Delete
                        </button>
                        <button
                            className={`px-3 py-1 text-sm rounded-md ${status ? "bg-emerald-600 hover:bg-emerald-700" : "bg-orange-600 hover:bg-orange-700"
                                } transition`}
                            onClick={handleStatus}
                        >
                            {status === true ? "Active" : "Inactive"}
                        </button>
                    </div>
                </div>
            </div>


    )
}

export default PremiumCard
