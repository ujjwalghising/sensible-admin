import axios from "@/utils/axios";

export const loginAdmin = (credentials) => axios.post("/api/admin/login", credentials);

export const getCurrentAdmin = () => axios.get("/api/admin/me");

export const logoutAdmin = () => axios.post("/api/admin/logout");
