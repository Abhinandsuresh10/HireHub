'use client'
import { useEffect, useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/AdminSidebar';
import { addCategorys, addJobRoles, deleteCategoryFunc, deleteRoleFunc, getJobRoles } from '../../api/admin/jobRoles';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  category: string;
  jobRole: string[];
}

const JobRoles = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // to fetch all jobRoles from the backend...
    const fetchJobRoles = async () => {
      const response = await getJobRoles();
      if(response?.data) {
        setCategories(response.data.jobRoles);
      }
    }

    fetchJobRoles();
  }, [])

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newRole, setNewRole] = useState('');

  const toggleCategory = (id: string) => {
    setExpandedCategory(prev => (prev === id ? null : id));
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const response = await addCategorys(newCategory);
    if(response?.data) {
      toast.success(response.data.message)
    } else {
      return;
    }
    setCategories(prev => [
      ...prev,
      { _id: Date.now().toString(), category: newCategory.trim(), jobRole: [] }
    ]);
    setNewCategory('');
    setShowCategoryInput(false);
  };

  const addRole = async () => {
    if (!newRole.trim() || !selectedCategory) return;
    const response = await addJobRoles(newRole, selectedCategory);
    if(response?.data) {
      toast.success(response.data.message);
    }
    setCategories(prev =>
      prev.map(cat =>
        cat._id === selectedCategory
          ? { ...cat, jobRole: [...cat.jobRole, newRole.trim()] }
          : cat
      )
    );
    setNewRole('');
  };

  const deleteCategory = async (id: string) => {
    const response = await deleteCategoryFunc(id);
    if(response?.data) {
      toast.success(response.data.message);
    }
    setCategories(prev => prev.filter(cat => cat._id !== id));
  };

  const deleteRole = async (catId: string, role: string) => {
    const response = await deleteRoleFunc(catId, role);
    if(response?.data) {
       toast.success(response.data.message);
    }
    setCategories(prev =>
      prev.map(cat =>
        cat._id === catId
          ? { ...cat, jobRole: cat.jobRole.filter(r => r !== role) }
          : cat
      )
    );
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        <AdminHeader pageTitle="JobRole" />

        <div className="w-full max-w-5xl mx-auto p-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600">
              <h2 className="text-4xl font-bold text-white mb-2">Job Role Management</h2>
              <p className="text-blue-100">Add and manage job roles across categories</p>
            </div>

            {/* Add category */}
            <div className="p-8 space-y-6">
              <div className="bg-white/50 backdrop-blur rounded-2xl p-6 border border-gray-100 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Management</h3>
                {showCategoryInput ? (
                  <div className="flex gap-4">
                    <input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                      placeholder="Enter category name..."
                      className="flex-1 px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={addCategory}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl hover:shadow-lg"
                    >
                      <Plus size={20} /> Add
                    </button>
                    <button
                      onClick={() => setShowCategoryInput(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl"
                    >
                      <X size={20} /> Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCategoryInput(true)}
                    className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50"
                  >
                    <Plus size={20} /> New Category
                  </button>
                )}
              </div>

              {/* Add Job Role */}
              <div className="bg-white/50 backdrop-blur rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Job Role</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addRole()}
                    placeholder="Enter job role..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white shadow-sm border"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white shadow-sm border"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.category}</option>
                    ))}
                  </select>
                  <button
                    onClick={addRole}
                    disabled={!selectedCategory}
                    className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium ${
                      selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus size={20} /> Add Role
                  </button>
                </div>
              </div>
            </div>

            {/* Job Role Categories List */}
            <div className="px-8 pb-8 space-y-6">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-white/50 rounded-2xl shadow-lg border border-gray-300">
                  <div className="flex items-center justify-between px-6 py-4">
                    <button onClick={() => toggleCategory(cat._id)} className="flex-1 text-left">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {cat.category}
                      </h3>
                    </button>
                    {expandedCategory === cat._id ? <ChevronUp /> : <ChevronDown />}
                    <button onClick={() => deleteCategory(cat._id)} className="ml-4 text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {expandedCategory === cat._id && (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cat.jobRole.length === 0 ? (
                        <p className="text-gray-500 col-span-full text-center">No job roles in this category</p>
                      ) : (
                        cat.jobRole.map((role) => (
                          <div
                            key={role}
                            className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md flex justify-between items-center"
                          >
                            <span>{role}</span>
                            <button onClick={() => deleteRole(cat._id, role)} className="text-red-600">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRoles;
