"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

type User = {
  isLoggedIn: boolean;
  role: string;
  name: string;
  email: string;
  isAdmin?: boolean;
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
  isAdmin: false,
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
        // Get current session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.log("No active session found:", error.message);
          return;
        }

        if (session && session.user) {
          console.log(
            "Found existing session:",
            session.access_token.slice(0, 10) + "..."
          );
          console.log("User details loaded:", session.user.email);

          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_id", session.user.id)
            .single();

          // Set user information
          setUser({
            isLoggedIn: true,
            role: profile?.role || "student",
            name:
              profile?.name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "Student",
            email: session.user.email || "",
            isAdmin: profile?.is_admin || false,
          });
        } else {
          console.log("No active session found");
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
    // Protect dashboard and admin routes
    if (!loading) {
      if (pathname?.startsWith("/dashboard") && !user?.isLoggedIn) {
        router.push("/login");
      }
      if (
        pathname?.startsWith("/admin") &&
        (!user?.isLoggedIn || !user?.isAdmin)
      ) {
        router.push("/");
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

      // Use Supabase auth to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log("Login successful:", data.user.email);

        // Get user profile to fetch role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_id", data.user.id)
          .single();

        // Set user state
        setUser({
          isLoggedIn: true,
          role: profile?.role || "student",
          name:
            profile?.name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "Student",
          email: data.user.email || "",
          isAdmin: profile?.is_admin || false,
        });

        // Navigate to dashboard
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Create a more helpful error message
      if (error?.message) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials.");
        } else if (error.message.includes("Email not confirmed")) {
          setError(
            "Please check your email and confirm your account before logging in."
          );
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
      // Sign out using Supabase
      await supabase.auth.signOut();
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
