import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentAdmin, loginAdmin, logoutAdmin } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdmin = async () => {
    try {
      const res = await getCurrentAdmin();
      setAdmin(res.data);
    } catch (err) {
      setAdmin(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      await loginAdmin({ email, password }); // request to backend
  
      await fetchAdmin(); // set admin context after successful login
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      throw err; // so the Login component can show the error toast
    } finally {
      setAuthLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await logoutAdmin();
      setAdmin(null);
      toast.success("Logged out");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };
  
    useEffect(() => {
      fetchAdmin();
    }, []);
    
  

  return (
    <AuthContext.Provider value={{ admin, authLoading, login, logout, fetchAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
