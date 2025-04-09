// src/services/adminService.js
import api from "@/utils/axios";

// ✅ Invite an admin
export const inviteAdmin = (email, role) => {
  return api.post("/invite", { email, role });
};

// ✅ Register invited admin
export const registerInvitedAdmin = (name, password, token) => {
  return api.post("/register", { name, password, token });
};

// ✅ Admin login
export const loginAdmin = (data) => {
  return api.post("/login", data);
};

// ✅ Get current logged-in admin
export const getCurrentAdmin = () => {
  return api.get("/me");
};

// ✅ Logout admin
export const logoutAdmin = () => {
  return api.post("/logout");
};

// ✅ Get all orders
export const getAllOrders = async () => {
  const res = await axios.get("/orders");
  return res.data.orders; // ✅ Make sure this is returning an array
};

// ✅ Update order status
export const updateOrderStatus = (id, status) => {
  return api.put(`/orders/${id}`, { status });
};

// ✅ Get analytics data
export const getAnalytics = () => {
  return api.get("/analytics");
};

// ✅ Get dashboard stats
export const getDashboardStats = () => {
  return api.get("/dashboard");
};

// ✅ Get all users
export const getAllUsers = async () => {
  const res = await axios.get("/users");
  return res.data.users; // ✅ not just res.data
};


// ✅ Delete user
export const deleteUserById = (id) => {
  return api.delete(`/users/${id}`);
};

// ✅ Update user
export const updateUserById = (id, updatedData) => {
  return api.put(`/users/${id}`, updatedData);
};
