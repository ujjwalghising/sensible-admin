import api from "@/utils/api";

export const getAllUsers = () => api.get("/users");
export const deleteUserById = (id) => api.delete(`/users/${id}`);
export const updateUserById = (id, updatedData) =>
  api.put(`/users/${id}`, updatedData);
