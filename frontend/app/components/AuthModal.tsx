"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const router = useRouter();
  const {
    showAuthModal,
    closeAuthModal,
    authModalMode,
    loginWithGoogle,
    signupWithGoogle,
    loginWithEmail,
    isLoading,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(authModalMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [googleAuthenticating, setGoogleAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!showAuthModal) return null;

  const handleGoogleAction = async () => {
    setGoogleAuthenticating(true);
    setErrorMessage("");
    try {
      if (mode === "signin") {
        await loginWithGoogle();
      } else {
        await signupWithGoogle(email || undefined, name || undefined);
      }
      router.push("/dashboard");
    } catch {
      setErrorMessage("Google authentication failed. Please try again.");
    } finally {
      setGoogleAuthenticating(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setErrorMessage("");
    try {
      await loginWithEmail(email, name);
      router.push("/dashboard");
    } catch {
      setErrorMessage("Failed to authenticate. Please check your credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#dce1da] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Accent Header */}
        <div className="bg-[#1a3328] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center shadow-inner">
              <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-bold text-base tracking-tight">GeoWatershed</h3>
              <p className="text-[11px] text-[#9fc7af]">Spatial Intelligence Platform</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-white/70 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Auth Body */}
        <div className="p-6">
          {/* Sign In vs Sign Up Tabs */}
          <div className="flex border-b border-[#e5e8e3] mb-6">
            <button
              onClick={() => { setMode("signin"); setErrorMessage(""); }}
              className={`flex-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer text-center relative ${
                mode === "signin"
                  ? "text-[#1e6641] border-b-2 border-[#1e6641]"
                  : "text-[#7c8b82] hover:text-[#1a1f1c]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setErrorMessage(""); }}
              className={`flex-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer text-center relative ${
                mode === "signup"
                  ? "text-[#1e6641] border-b-2 border-[#1e6641]"
                  : "text-[#7c8b82] hover:text-[#1a1f1c]"
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Primary Action: Google Authentication */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleAction}
              disabled={googleAuthenticating || isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#f7f9f6] text-[#2c3e34] border border-[#d2d7d0] rounded-xl font-semibold text-xs flex items-center justify-center gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {googleAuthenticating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#1e6641] border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating with Google...</span>
                </div>
              ) : (
                <>
                  <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
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
                  <span>
                    {mode === "signin" ? "Continue with Google" : "Sign up with Google"}
                  </span>
                </>
              )}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#e5e8e3]"></div>
              <span className="shrink-0 mx-3 text-[10px] uppercase font-bold tracking-wider text-[#8fa396]">
                Or with institutional email
              </span>
              <div className="flex-grow border-t border-[#e5e8e3]"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#4a5850] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kulkarni"
                    className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641] focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#4a5850] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@geowatershed.gov.in"
                  className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641] focus:bg-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-semibold text-[#4a5850]">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => alert("Password reset instructions sent to your email.")}
                      className="text-[10px] text-[#1e6641] hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#1e6641] hover:bg-[#174f33] text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>{mode === "signin" ? "Sign In to Platform" : "Create Hydrologist Account"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3.5 bg-[#f7f9f6] border-t border-[#eef1ed] text-center">
          <p className="text-[10px] text-[#7c8b82]">
            Protected by enterprise spatial SSO. Authorized access for watershed management agencies.
          </p>
        </div>
      </div>
    </div>
  );
}
