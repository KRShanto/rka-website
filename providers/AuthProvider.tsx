"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { appwrite } from "@/lib/appwrite";
import { Account } from "appwrite";

type User = {
  isLoggedIn: boolean;
  role: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const defaultUser: User = {
  isLoggedIn: false,
  role: "",
  name: "",
  email: "",
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  login: async () => {},
  logout: async () => {},
  loading: true,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkSession = async () => {
      try {
        // Try to get the current session
        try {
          // Get current session
          const session = await appwrite.account.getSession("current");
          console.log("Found existing session:", session.$id);

          // If session exists, get account details
          const account = await appwrite.account.get();
          console.log("Account details loaded:", account.name);

          // Set user information
          setUser({
            isLoggedIn: true,
            role: "student", // This could be fetched from database
            name: account.name,
            email: account.email,
          });
        } catch (error: any) {
          // This is normal for non-authenticated users
          console.log("No active session found:", error?.message);
        }
      } catch (error: any) {
        console.error("Session check failed:", error?.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    // Protect dashboard routes
    if (!loading) {
      if (pathname?.startsWith("/dashboard") && !user?.isLoggedIn) {
        router.push("/login");
      }
    }
  }, [pathname, user, loading, router]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Format email according to our convention
      const email = `${username}@bwkd.app`;
      console.log("Attempting login with email:", email);

      // Use the Account SDK directly without additional parameters
      // This method has overloads, and we're making sure we're using the right one
      await appwrite.account.createEmailPasswordSession(email, password);

      // Now try to get user data
      try {
        const account = await appwrite.account.get();
        console.log("Account retrieved successfully", account);

        // Set user state
        setUser({
          isLoggedIn: true,
          role: "student",
          name: account.name || "Student",
          email: account.email,
        });

        // Navigate to dashboard
        router.push("/dashboard");
      } catch (accountError: any) {
        console.error("Error getting account after login:", accountError);
        setError("Authentication succeeded but failed to get account data.");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Create a more helpful error message
      if (error?.message) {
        if (error.message.includes("userId")) {
          setError("Login failed: There's an issue with the username format.");
        } else if (error.message.includes("Invalid credentials")) {
          setError("Invalid email or password. Please check your credentials.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      // Delete the current session
      await appwrite.account.deleteSession("current");
      console.log("Session deleted successfully");

      // Clear user state
      setUser(null);

      // Redirect to login page
      router.push("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
