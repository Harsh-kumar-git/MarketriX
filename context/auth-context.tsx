"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "team_member";
  subscriptionPlan: "free" | "pro" | "business";
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  isAuthenticated: boolean;
  subscriptionPlan: string;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to verify the session
        const storedUser = localStorage.getItem("marketix-user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to authenticate
      // Mock login for demo purposes
      const mockUser: User = {
        id: "user-1",
        name: "Demo User",
        email: email,
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem("marketix-user", JSON.stringify(mockUser));
      setUser(mockUser);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to register
      // Mock registration for demo purposes
      const mockUser: User = {
        id: "user-" + Date.now(),
        name: name,
        email: email,
        role: "manager",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem("marketix-user", JSON.stringify(mockUser));
      setUser(mockUser);
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("marketix-user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);