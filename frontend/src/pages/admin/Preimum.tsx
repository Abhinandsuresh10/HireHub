import PremiumCard from "../../components/admin/PremiumCard"
import AdminHeader from "../../components/admin/AdminHeader"
import Sidebar from "../../components/admin/AdminSidebar"
import { useEffect, useState } from "react"
import PremiumModal from "../../components/admin/PremiumModal"
import { PremiumFormData } from "../../types/premiums.types"
import { getPremiums } from "../../api/admin/premium"
import PremiumEditModal from "../../components/admin/PremiumEditModal"
import Loader from "../../components/ui/Loader"


const Premium = () => {
    const [addModal, setAddModal] = useState(false);
    const [premiums, setPremiums] = useState<PremiumFormData[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 6;


    useEffect(() => {
        const fetchPremiums = async () => {
            const response = await getPremiums(page, limit);
            if (response.data) {
                setPremiums(response.data.premiums);
                setTotal(response.data.total);
            }
        }
        fetchPremiums();
    }, [addModal, editId, page, limit])


    // pagination next and prev func...
    const handleNext = () => {
        if (page < total) setPage((prev) => prev + 1);
    }

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    }

    if (!premiums) {
        return (
            <div className="h-screen flex">
                <Sidebar />

                <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-300">
                    <AdminHeader pageTitle="Premium" />
                    <div className="">
                        <Loader />
                    </div>
                </div>
            </div>
        )
    }

                    return (
                    <div className="h-screen flex">
                        <Sidebar />

                        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-300">
                            <AdminHeader pageTitle="Premium" />
                            <div className="w-full">
                                <button className="px-6 py-1 m-4 rounded-lg bg-green-600 text-white" onClick={() => setAddModal(true)}>Add + </button>
                            </div>

                            {/* main area - with cards...*/}
                            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {premiums?.map((premium) => (
                                        <PremiumCard 
                                            key={premium?._id}
                                            premium={premium}
                                            onDelete={(id) => setPremiums(prev => prev?.filter(p => p._id !== id))}
                                            onEdit={(id) => setEditId(id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-center">
                                <div className="flex items-center gap-4 p-2 m-2">
                                    <button onClick={handlePrev} className={`p-2 m-2 rounded-lg bg-black text-white disabled:opacity-50`} disabled={page === 1}>Prev</button>
                                    <span>{page} / {Math.ceil(total / limit)}</span>
                                    <button onClick={handleNext} className={`p-2 m-2 rounded-lg bg-black text-white disabled:opacity-50`} disabled={page === Math.ceil(total / limit)}>Next</button>
                                </div>
                            </div>

                        </div>
                        {addModal && <PremiumModal onClose={() => setAddModal(false)} />}
                        {editId && <PremiumEditModal onClose={() => setEditId(null)} id={editId} />}
                    </div>

                    )
}

                    export default Premium
