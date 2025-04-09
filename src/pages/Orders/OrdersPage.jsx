import { useEffect, useState } from "react";
import { getAllOrders } from "@/services/adminServices";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res);
        setFilteredOrders(res);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (search.trim()) {
      filtered = filtered.filter(
        (o) =>
          o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
          o._id.includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((o) => {
        const orderDate = new Date(o.createdAt).getTime();
        const fromDate = dateRange.from ? new Date(dateRange.from).getTime() : null;
        const toDate = dateRange.to ? new Date(dateRange.to).getTime() : null;
        return (
          (!fromDate || orderDate >= fromDate) &&
          (!toDate || orderDate <= toDate)
        );
      });
    }

    setFilteredOrders(filtered);
  }, [search, statusFilter, dateRange, orders]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>

      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by email or order ID"
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{order._id}</td>
                  <td className="p-2 border">{order.user?.email || "N/A"}</td>
                  <td className="p-2 border">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{order.status || "Pending"}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleOrderClick(order)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <p>
              <strong>Order ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>User:</strong> {selectedOrder.user?.email || "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
