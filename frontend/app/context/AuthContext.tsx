"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  provider: "google" | "email";
  joinedDate: string;
  watershedAccess: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showAuthModal: boolean;
  authModalMode: "signin" | "signup";
  openAuthModal: (mode?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  signupWithGoogle: (customEmail?: string, customName?: string) => Promise<void>;
  loginWithEmail: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AUTH_STORAGE_KEY = "gw_v2_auth_user";

export const defaultDemoUser: AuthUser = {
  id: "usr_google_108249",
  name: "Ansh Kumar",
  email: "ansh.kumar@watershed.ai",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  role: "Lead GIS Hydrologist",
  provider: "google",
  joinedDate: "Nov 2026",
  watershedAccess: ["Upper Bhima Basin", "Ghod River Catchment", "Indrayani Valley Watershed", "Mula-Mutha Confluence Sector"],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        // By default, visitor is NOT logged in so the Landing Page appears first!
        setUser(null);
      }
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (mode: "signin" | "signup" = "signin") => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const authedUser: AuthUser = {
          ...defaultDemoUser,
          id: `usr_g_${Date.now()}`,
        };
        setUser(authedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authedUser));
        setShowAuthModal(false);
        setIsLoading(false);
        // Direct redirect to the main application dashboard upon sign in
        router.push("/dashboard");
        resolve();
      }, 700);
    });
  };

  const signupWithGoogle = async (customEmail?: string, customName?: string): Promise<void> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const authedUser: AuthUser = {
          id: `usr_g_${Date.now()}`,
          name: customName || defaultDemoUser.name,
          email: customEmail || defaultDemoUser.email,
          avatar: defaultDemoUser.avatar,
          role: "GIS Analyst & Field Surveyor",
          provider: "google",
          joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          watershedAccess: ["Upper Bhima Basin", "Ghod River Catchment"],
        };
        setUser(authedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authedUser));
        setShowAuthModal(false);
        setIsLoading(false);
        // Direct redirect to the main application dashboard upon sign up
        router.push("/dashboard");
        resolve();
      }, 700);
    });
  };

  const loginWithEmail = async (email: string, name?: string): Promise<void> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const authedUser: AuthUser = {
          id: `usr_em_${Date.now()}`,
          name: name || email.split("@")[0] || "User",
          email,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
          role: "Hydrological Analyst",
          provider: "email",
          joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          watershedAccess: ["Upper Bhima Basin"],
        };
        setUser(authedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authedUser));
        setShowAuthModal(false);
        setIsLoading(false);
        router.push("/dashboard");
        resolve();
      }, 600);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push("/");
  };

  const updateUser = (data: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        showAuthModal,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        signupWithGoogle,
        loginWithEmail,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
