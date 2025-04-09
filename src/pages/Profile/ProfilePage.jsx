import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from '@/utils/axios';
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { admin, setAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  useEffect(() => {
    if (admin) {
      setFormData({ name: admin.name, password: "" });
    }
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/api/admin/profile", formData);
      setAdmin((prev) => ({ ...prev, name: res.data.name }));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-400 text-black px-4 py-2 rounded hover:bg-blue-700 border-2"
        >
          Update
        </button>
      </form>
    </div>
  );
}
