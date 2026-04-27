import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast"; // migrating out of sonner

const AUTH_DB_KEY = "vendor_users_db";
const AUTH_SESSION_KEY = "vendor_active_session";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const activeSession = localStorage.getItem(AUTH_SESSION_KEY);
      if (activeSession) {
        setUser(JSON.parse(activeSession));
      }
    } catch (e) {
      console.error("Failed to restore session", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = async (userData) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const dbRows = JSON.parse(localStorage.getItem(AUTH_DB_KEY) || "[]");
      
      if (dbRows.some((u) => u.email === userData.email)) {
        return { success: false, error: "Email already exists" };
      }

      const newUser = {
        ...userData,
        id: `vendor-usr-${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      dbRows.push(newUser);
      
      // Save to mock DB
      localStorage.setItem(AUTH_DB_KEY, JSON.stringify(dbRows));
      
      // Set active session (Omit password for security simulation)
      const { password, ...sessionUser } = newUser;
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);

      return { success: true, user: sessionUser };
    } catch (error) {
      return { success: false, error: "Signup failed. Please try again." };
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const dbRows = JSON.parse(localStorage.getItem(AUTH_DB_KEY) || "[]");
      const existingUser = dbRows.find(
        (u) => u.email === email && u.password === password
      );

      if (!existingUser) {
        return { success: false, error: "Invalid email or password" };
      }

      // Set active session
      const { password: _, ...sessionUser } = existingUser;
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);

      return { success: true, user: sessionUser };
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    setUser(null);
    toast.success("Successfully logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
