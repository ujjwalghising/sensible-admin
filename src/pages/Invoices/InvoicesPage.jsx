import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { toast } from "react-hot-toast";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("/admin/invoices");
      setInvoices(res.data);
    } catch (err) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) return <div>Loading invoices...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left py-2 px-4">Invoice ID</th>
              <th className="text-left py-2 px-4">User</th>
              <th className="text-left py-2 px-4">Amount</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id} className="border-t">
                <td className="py-2 px-4">{invoice._id}</td>
                <td className="py-2 px-4">{invoice.user?.email}</td>
                <td className="py-2 px-4">${invoice.amount.toFixed(2)}</td>
                <td className="py-2 px-4 capitalize">{invoice.status}</td>
                <td className="py-2 px-4">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <button className="text-blue-600 hover:underline text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
