"use client";

import { useState } from "react";
import { useWatershed } from "../context/WatershedContext";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Header() {
  const { watersheds, selectedWatershed, setSelectedWatershed } = useWatershed();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const year = new Date().getFullYear();
  const [dateRange] = useState(`Jan 01 – Dec 31, ${year}`);
  const [searchQuery, setSearchQuery] = useState("");

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "GW";

  return (
    <header className="h-16 bg-white border-b border-[#e5e7e4] px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left: Watershed Selector & Navigation to Home */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <label className="block text-[10px] font-semibold text-[#7c8b82] tracking-wider uppercase leading-none mb-1">
            Current watershed
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-sm font-bold text-[#1a1f1c] hover:text-[#1e6641] transition-colors cursor-pointer py-0.5"
            >
              <span>{selectedWatershed || "Select Watershed"}</span>
              <svg
                className={`w-4 h-4 text-[#7c8b82] transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#d8dcd6] py-1.5 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#7c8b82] uppercase tracking-wider border-b border-[#f0f3ef]">
                  Available Watershed Basins
                </div>
                {watersheds.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelectedWatershed(ws.name);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#f7f8f6] transition-colors cursor-pointer ${
                      selectedWatershed === ws.name
                        ? "font-bold text-[#1e6641] bg-[#f0f7f3]"
                        : "text-[#2d3831]"
                    }`}
                  >
                    <span>{ws.name}</span>
                    <span className="text-[10px] text-[#7c8b82]">{ws.area}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-7 w-[1px] bg-[#e5e7e4]" />

        {/* Global Search Bar */}
        <div className="relative w-80 lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8fa396]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations, observations, layers..."
            className="w-full pl-9 pr-10 py-1.5 text-xs bg-[#f7f8f6] border border-[#e2e5e1] rounded-lg text-[#1a1f1c] placeholder-[#8fa396] focus:outline-none focus:border-[#1e6641] focus:bg-white transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="text-[10px] font-semibold font-mono bg-white border border-[#d8dcd6] text-[#7c8b82] px-1.5 py-0.5 rounded shadow-2xs">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Date filter, Alerts, Authentication / Profile */}
      <div className="flex items-center gap-4">
        {/* Link to Landing Page */}
        <Link
          href="/"
          className="text-xs font-semibold text-[#5c6b62] hover:text-[#1e6641] px-2.5 py-1.5 rounded-lg hover:bg-[#f7f8f6] transition-colors hidden md:inline-flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Landing Page</span>
        </Link>

        {/* Date Range Picker */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#2d3831] bg-white border border-[#d8dcd6] rounded-lg hover:bg-[#f7f8f6] transition-colors shadow-2xs">
          <svg className="w-4 h-4 text-[#5c6b62]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{dateRange}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => alert("Hydrological Alert: North Ridge Gully erosion rate increased by 2.4% following seasonal rainfall.")}
          className="relative p-2 text-[#5c6b62] hover:text-[#1a1f1c] hover:bg-[#f7f8f6] rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#1e6641] rounded-full" />
        </button>

        {/* User Auth Section */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 pl-2 border-l border-[#e5e7e4] hover:opacity-85 transition-opacity cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#1b4d36] text-white flex items-center justify-center font-bold text-xs shadow-2xs overflow-hidden border border-emerald-600/30">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#1a1f1c] leading-tight flex items-center gap-1">
                  <span>{user.name}</span>
                  {user.provider === "google" && (
                    <span className="text-[9px] bg-blue-50 text-blue-700 px-1 py-0.2 rounded font-semibold border border-blue-200">
                      Google
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-[#7c8b82] font-medium leading-tight">{user.role}</p>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-[#8fa396] transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#d8dcd6] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#f0f3ef]">
                  <p className="text-xs font-bold text-[#1a1f1c]">{user.name}</p>
                  <p className="text-[11px] text-[#7c8b82] truncate">{user.email}</p>
                  <p className="text-[10px] text-[#1e6641] font-semibold mt-0.5">
                    Role: {user.role}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs text-[#2d3831] hover:bg-[#f7f8f6] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-[#7c8b82]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>Platform Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      openAuthModal("signin");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#2d3831] hover:bg-[#f7f8f6] flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#7c8b82]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Switch Account</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[#f0f3ef]">
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal("signin")}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#1a1f1c] bg-white border border-[#d2d7d0] hover:bg-[#f7f9f6] rounded-lg transition-colors cursor-pointer shadow-2xs"
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
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
