"use client";

import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f6f4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#1e6641] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#5c6b62]">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#edf7f0] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#d2e4d6] rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0b3b24] text-white flex items-center justify-center mx-auto shadow-md">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-[#0b3b24]">
              Authentication Required
            </h2>
            <p className="text-xs text-[#5c6b62] leading-relaxed">
              To access the GeoWatershed spatial dashboard, interactive GIS maps, and AI analysis models, please sign in or register with your Google account.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal("signin")}
              className="w-full py-3 px-4 bg-white hover:bg-[#f7fbf8] text-[#0b3b24] border border-[#c1d9c7] rounded-xl font-bold text-xs flex items-center justify-center gap-3 shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Sign In with Google</span>
            </button>

            <button
              onClick={() => openAuthModal("signup")}
              className="w-full py-3 px-4 bg-[#0b3b24] hover:bg-[#124b30] text-white rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              Create Free Account
            </button>

            <Link
              href="/"
              className="inline-block text-xs font-semibold text-[#5c6b62] hover:text-[#0b3b24] pt-2"
            >
              &larr; Back to Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
