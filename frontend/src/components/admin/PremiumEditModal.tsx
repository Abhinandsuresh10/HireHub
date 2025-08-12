import { PremiumFormData } from "../../types/premiums.types";
import { getPremium, updatePremium } from "../../api/admin/premium";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PremiumEditModal = ({ onClose, id }: { onClose: () => void; id: string }) => {
    const [price, setPrice] = useState(100);
    const [role, setRole] = useState("");
    const [description, setDecription] = useState("");
    const [status, setStatus] = useState<boolean>(true);

    useEffect(() => {
        const fetchPremium = async () => {
            const response = await getPremium(id);
            if (response.data) {
                setPrice(response.data.premium.price);
                setRole(response.data.premium.role);
                setDecription(response.data.premium.description);
                setStatus(response.data.premium.status);
            }
        }
        fetchPremium();
    }, [])

    const handleSubmit = async () => {

        if (!role) return;
        if (status === null) return;

        if (price < 100 || price > 500) {
            toast.error('Price must be between 100 and 500')
            return;
        }

        if (!description && description.length < 10) {
            toast.error('Decription length at least 10 character long')
            return;
        }

        const formData: PremiumFormData = {
            price,
            role,
            description,
            status,
        };

        const response = await updatePremium(id, { formData });
        if (response.data) {
            toast.success(response.data.message);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Premium Plan</h2>

                <form className="space-y-4">
                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <select
                            value={price}
                            onChange={(e) => setPrice(parseInt(e.target.value))}
                            className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={149}>₹149</option>
                            <option value={249}>₹249</option>
                            <option value={349}>₹349</option>
                            <option value={449}>₹449</option>
                        </select>
                    </div>


                    {/* Decription */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            placeholder="Enter Description"
                            value={description}
                            className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setDecription(e.target.value)}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}>
                            <option value="">Select Role</option>
                            <option value="user">User</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            value={status === null ? "" : status.toString()}
                            onChange={(e) => setStatus(e.target.value === "true")}>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
                            onClick={onClose}

                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white ${!role && 'opacity-50'} ${status === null && 'opacity-50'}`}
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PremiumEditModal
