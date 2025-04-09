import { useState } from "react";
import { inviteAdmin } from "@/services/adminServices";
import { toast } from "react-toastify";

export default function InviteAdmin() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await inviteAdmin(email, role);
      toast.success("Invite sent successfully");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to invite admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Invite New Admin</h2>
      <form onSubmit={handleInvite} className="space-y-4">
        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>
      </form>
    </div>
  );
}
