import api from "@/utils/api";

export const getAllOrders = () => api.get("/orders");
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}`, { status });
