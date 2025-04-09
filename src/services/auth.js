import api from '@/utils/axios';

// Admin Login
export const loginAdmin = async (data) => {
  const res = await api.post('/login', data);
  return res.data;
};

// Fetch current logged-in admin
export const fetchAdmin = async () => {
  const res = await api.get('/profile');
  return res.data;
};

// Logout admin
export const logoutAdmin = async () => {
  const res = await api.post('/logout'); // create this endpoint if not present
  return res.data;
};
