"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const router = useRouter();

  // Accordion state for FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    service: "Watershed GIS Mapping",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Navigate to application or prompt auth
  const handleLaunchApp = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      openAuthModal("signin");
    }
  };

  const handleSignUp = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      openAuthModal("signup");
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({
        name: "",
        email: "",
        phone: "",
        organization: "",
        service: "Watershed GIS Mapping",
        message: "",
      });
    }, 4000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterSubmitted(false);
      setNewsletterEmail("");
    }, 4000);
  };

  const faqs = [
    {
      q: "What can I track with this platform?",
      a: "You can monitor key environmental indicators, understand your catchment footprint, view high-resolution drainage streams, and see how planned civil interventions (such as check dams and contour trenches) influence long-term soil moisture and erosion prevention.",
    },
    {
      q: "Is this suitable for government agencies and field survey teams?",
      a: "Yes. GeoWatershed is built specifically for watershed development authorities, state water resource departments, environmental NGOs, and academic hydrologists who need verifiable GIS data and automated civil dossiers.",
    },
    {
      q: "Do I need GIS technical skills to use the AI analysis?",
      a: "No. The AI analysis studio automatically extracts vegetation indices (NDVI) and slope gradients from Sentinel-2 and SRTM rasters, generating plain-language land use and erosion risk classifications.",
    },
    {
      q: "How does the Google Sign-In and account access work?",
      a: "You can sign in with one click using your Google account. Your custom watershed data, uploaded imagery, and field observations persist securely in your profile with enterprise-grade SSO standards.",
    },
    {
      q: "Can I export data for civil engineering reports?",
      a: "Yes, you can export full GeoJSON boundary layers, CSV training datasets, and automated synthesis PDF dossiers containing structural specs, budget estimations, and watershed health metrics.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#edf7f0] text-[#0b3b24] flex flex-col font-sans selection:bg-[#0b3b24]/15">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#0b3b24] text-[#d4f0df] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span>Newly Launched: GeoWatershed v2.5 Spatial Intelligence Platform for Maharashtra Basins</span>
        <button
          onClick={handleLaunchApp}
          className="underline font-bold hover:text-white cursor-pointer ml-1 inline-flex items-center gap-1"
        >
          <span>Explore Live Demo</span>
          <span>&rarr;</span>
        </button>
      </div>

      {/* 2. Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#edf7f0]/90 backdrop-blur-md border-b border-[#d8edd9]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#0b3b24] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-[#0b3b24]">
              GeoWatershed.
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#1a4f32]">
            <a href="#services" className="hover:text-[#0b3b24] transition-colors">
              Services
            </a>
            <a href="#why-us" className="hover:text-[#0b3b24] transition-colors">
              Why GeoWatershed
            </a>
            <a href="#faq" className="hover:text-[#0b3b24] transition-colors">
              FAQ
            </a>
            <a href="#contact" className="hover:text-[#0b3b24] transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Action / Auth Button */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#1a4f32] hidden sm:inline">
                  Hello, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#0b3b24] hover:bg-[#145334] rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <span>&rarr;</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuthModal("signin")}
                  className="text-xs font-bold text-[#0b3b24] hover:underline px-2 py-1 cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  onClick={handleSignUp}
                  className="px-5 py-2 text-xs font-bold text-[#0b3b24] border-1.5 border-[#0b3b24] hover:bg-[#0b3b24] hover:text-white rounded-full transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
                  <span>Sign Up Free</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Matching Greensign Editorial Layout) */}
      <section className="relative pt-14 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-bold tracking-wider text-[#1e6641] uppercase">
                Our Services
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-bold text-[#0b3b24] leading-[1.1] tracking-tight">
                Clear, practical support for your sustainability &amp; watershed goals
              </h1>

              <p className="text-sm sm:text-base text-[#3d5a49] leading-relaxed max-w-xl">
                We offer structured, easy-to-implement GIS analysis and hydrological services that help organizations understand their impact, plan smarter check dams, and take confident steps toward long-term soil conservation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleLaunchApp}
                  className="px-7 py-3.5 bg-[#0b3b24] hover:bg-[#145334] text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <span>Launch Spatial Platform</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>

                <button
                  onClick={() => openAuthModal("signin")}
                  className="px-6 py-3.5 bg-white/80 hover:bg-white text-[#0b3b24] border border-[#c1dec7] text-xs font-bold rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-2"
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
              </div>
            </div>

            {/* Right Hero Image Card (Organic Blob Shape Mask from Greensign Screenshot) */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Organic Background Blob */}
              <div className="relative w-80 h-96 sm:w-96 sm:h-[420px]">
                {/* Organic Teal Shape */}
                <div
                  className="absolute inset-0 bg-[#0b3b24] animate-blob-morph shadow-2xl"
                  style={{
                    borderRadius: "45% 55% 70% 30% / 40% 50% 50% 60%",
                  }}
                />

                {/* Mustard / Sand Accent Blob */}
                <div
                  className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#e8be66] rounded-full opacity-80 blur-xs animate-float-delayed -z-0"
                  style={{
                    borderRadius: "50% 50% 40% 60% / 40% 60% 50% 50%",
                  }}
                />

                {/* Professional Portrait / Hydrologist Image */}
                <div
                  className="absolute inset-2 overflow-hidden shadow-inner flex items-end justify-center"
                  style={{
                    borderRadius: "45% 55% 68% 32% / 42% 48% 52% 58%",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                    alt="Hydrology and GIS Lead Analyst"
                    className="w-full h-full object-cover object-top scale-105 hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Floating Clay Badges */}
                <div className="absolute -top-3 -left-4 bg-white/95 backdrop-blur-xs border border-[#cbe4d1] px-4 py-2 rounded-2xl shadow-lg animate-float">
                  <p className="text-[10px] font-bold text-[#1e6641] uppercase tracking-wide">
                    Live Telemetry
                  </p>
                  <p className="text-xs font-bold text-[#0b3b24]">Upper Bhima Basin</p>
                </div>

                <div className="absolute -bottom-3 -left-2 bg-white/95 backdrop-blur-xs border border-[#cbe4d1] px-4 py-2.5 rounded-2xl shadow-lg animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <p className="text-xs font-mono font-bold text-[#0b3b24]">96.4% Model Acc</p>
                      <p className="text-[9px] text-[#5c6b62]">GeoNeural Classifier</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Trust Bar / Logos */}
          <div className="pt-16 mt-8 border-t border-[#d2edd6] text-center space-y-4">
            <p className="text-xs font-semibold text-[#4f6b5a]">
              Trusted by over 25,000 businesses &amp; watershed organizations, including
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all text-[#1b442e] font-serif font-bold text-sm tracking-wide">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-current" /> Circle
              </span>
              <span className="font-mono">{`{a} Codelab`}</span>
              <span className="font-sans font-extrabold flex items-center gap-1">
                <span>✦</span> Store
              </span>
              <span className="font-mono tracking-tight font-black uppercase text-xs">
                LOGIPSUM
              </span>
              <span className="font-serif italic font-bold">logoipsum</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Services Section (Warm Sand/Cream Background) */}
      <section id="services" className="py-24 bg-[#f6f4ee] border-b border-[#e5e1d5]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header & Free Consultation Button */}
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0b3b24] tracking-tight">
                Services designed to turn insight into action
              </h2>
              <p className="text-xs sm:text-sm text-[#5a6e60] leading-relaxed">
                From environmental assessment to strategic planning and reporting, our services are built to simplify your sustainability journey at every stage.
              </p>
            </div>

            <button
              onClick={handleLaunchApp}
              className="px-6 py-3 bg-[#0b3b24] hover:bg-[#145334] text-white text-xs font-bold rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Get a free consultation
            </button>
          </div>

          {/* 4 Clean Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-6 border border-[#e5e1d5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#edf7f0] text-[#0b3b24] flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-serif font-bold text-[#0b3b24] leading-tight">
                  Solar &amp; Renewable Energy Advisory
                </h3>
                <p className="text-xs text-[#5c6b62] leading-relaxed">
                  Guidance on scaling solar, wind, and green energy projects alongside catchment land-use.
                </p>
              </div>

              <div className="pt-6">
                <button onClick={handleLaunchApp} className="text-xs font-bold text-[#0b3b24] hover:underline flex items-center gap-1">
                  <span>Read more</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-6 border border-[#e5e1d5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#edf7f0] text-[#0b3b24] flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-base font-serif font-bold text-[#0b3b24] leading-tight">
                  Real-time mission insights
                </h3>
                <p className="text-xs text-[#5c6b62] leading-relaxed">
                  See your runoff and carbon data clearly and make informed engineering decisions faster.
                </p>
              </div>

              <div className="pt-6">
                <button onClick={handleLaunchApp} className="text-xs font-bold text-[#0b3b24] hover:underline flex items-center gap-1">
                  <span>Read more</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-6 border border-[#e5e1d5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#edf7f0] text-[#0b3b24] flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-base font-serif font-bold text-[#0b3b24] leading-tight">
                  Automated sustainability
                </h3>
                <p className="text-xs text-[#5c6b62] leading-relaxed">
                  Generate accurate, audit-ready watershed reports with zero manual paperwork.
                </p>
              </div>

              <div className="pt-6">
                <button onClick={handleLaunchApp} className="text-xs font-bold text-[#0b3b24] hover:underline flex items-center gap-1">
                  <span>Read more</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-3xl p-6 border border-[#e5e1d5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#edf7f0] text-[#0b3b24] flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-base font-serif font-bold text-[#0b3b24] leading-tight">
                  Interactive GIS Topography
                </h3>
                <p className="text-xs text-[#5c6b62] leading-relaxed">
                  Multi-layer pan and zoom mapping, elevation contours, and sub-catchment boundary analytics.
                </p>
              </div>

              <div className="pt-6">
                <button onClick={handleLaunchApp} className="text-xs font-bold text-[#0b3b24] hover:underline flex items-center gap-1">
                  <span>Read more</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contact / Message Split Section (Matching 2nd Column in Greensign Image) */}
      <section id="contact" className="py-24 bg-[#edf7f0] border-b border-[#d8edd9]">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[11px] font-bold tracking-wider text-[#1e6641] uppercase">
              Contact us
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0b3b24] tracking-tight">
              We&apos;re here to help you move forward
            </h2>
            <p className="text-xs sm:text-sm text-[#4a6353] leading-relaxed">
              Reach out to our team for questions, support, or guidance. We&apos;ll get back to you with clear answers and next steps.
            </p>
          </div>

          {/* Split Container */}
          <div className="bg-[#8ee1b1] rounded-3xl p-4 sm:p-6 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left Mint Panel: "Prefer to talk directly?" */}
            <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-8 text-[#0b3b24]">
              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-bold leading-tight">
                  Prefer to talk directly?
                </h3>
                <p className="text-xs text-[#13492e] font-medium leading-relaxed">
                  We&apos;re available and happy to assist.
                </p>

                <div className="pt-4 space-y-2 text-xs">
                  <p className="font-bold">Phone support hours:</p>
                  <p className="text-[#13492e]">Every day, 9am &ndash; 6pm IST</p>
                  <p className="font-bold text-sm pt-1">Toll-free: (800) 123-4567</p>
                </div>

                <div className="pt-4 space-y-1 text-xs">
                  <p className="font-bold">Replies within 2 business days:</p>
                  <p className="font-semibold underline">support@geowatershed.gov.in</p>
                </div>
              </div>

              <div className="text-[10px] text-[#13492e]/80 leading-relaxed pt-6 border-t border-[#0b3b24]/10">
                If you&apos;re experiencing a flood or severe erosion emergency in Maharashtra basins, please contact your local district disaster management services immediately.
              </div>
            </div>

            {/* Right White Form Panel: "Send us a message" */}
            <div className="md:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-md">
              <h4 className="text-lg font-serif font-bold text-[#0b3b24] mb-4">
                Send us a message
              </h4>

              {contactSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center space-y-2">
                  <p className="font-bold text-sm">Thank you for your message!</p>
                  <p className="text-xs">Our watershed engineering team will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4a5e50] mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2dcd4] rounded-lg text-[#0b3b24] focus:outline-none focus:border-[#0b3b24]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4a5e50] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="email@organization.org"
                        className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2dcd4] rounded-lg text-[#0b3b24] focus:outline-none focus:border-[#0b3b24]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#4a5e50] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2dcd4] rounded-lg text-[#0b3b24] focus:outline-none focus:border-[#0b3b24]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#4a5e50] mb-1">
                      Organization / Agency
                    </label>
                    <input
                      type="text"
                      value={contactForm.organization}
                      onChange={(e) => setContactForm({ ...contactForm, organization: e.target.value })}
                      placeholder="e.g. Maharashtra Groundwater Authority"
                      className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2dcd4] rounded-lg text-[#0b3b24] focus:outline-none focus:border-[#0b3b24]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#4a5e50] mb-1">
                      Choose Services...
                    </label>
                    <select
                      value={contactForm.service}
                      onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2dcd4] rounded-lg text-[#0b3b24] focus:outline-none focus:border-[#0b3b24]"
                    >
                      <option>Watershed GIS Mapping &amp; Topography</option>
                      <option>AI Soil Erosion Modeling</option>
                      <option>Check Dam &amp; Trench Synthesis Report</option>
                      <option>Drone &amp; Satellite Raster Processing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#4a5e50] mb-1">
                      Write your message here...
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe your catchment basin or project scope..."
                      className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2dcd4] rounded-lg text-[#0b3b24] focus:outline-none focus:border-[#0b3b24]"
                    />
                  </div>

                  <p className="text-[10px] text-[#7c8b82]">
                    We only use your details to respond to your request.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0b3b24] hover:bg-[#145334] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions (Accordion) */}
      <section id="faq" className="py-24 bg-white border-b border-[#e5e8e3]">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0b3b24] tracking-tight">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#fcfdfc] border border-[#d8e8dc] rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#0b3b24] hover:bg-[#edf7f0]/50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <svg
                      className={`w-4 h-4 text-[#1a4f32] transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs text-[#4a6353] leading-relaxed border-t border-[#e8f2ea] animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Dark Forest Green Footer (Matching 3rd Column in Greensign Image) */}
      <footer className="mt-auto bg-[#0b3b24] text-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Top Newsletter CTA */}
          <div className="bg-[#12452c] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-md">
              <h3 className="text-2xl font-serif font-bold text-white">
                Subscribe to our newsletter
              </h3>
              <p className="text-xs text-[#a9d6bb] leading-relaxed">
                Stay ahead with the latest insights, updates, and expert tips delivered straight to your inbox.
              </p>
            </div>

            <div className="w-full md:w-auto">
              {newsletterSubmitted ? (
                <p className="text-xs font-bold text-[#a9d6bb]">✓ Subscribed to GeoWatershed bulletin.</p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="px-4 py-2.5 text-xs bg-white text-[#0b3b24] rounded-full focus:outline-none placeholder-[#7c8b82] w-full sm:w-64"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0b3b24] hover:bg-[#072617] text-white text-xs font-bold rounded-full transition-colors shrink-0 shadow-xs cursor-pointer border border-[#1b6849]"
                  >
                    Submit Request
                  </button>
                </form>
              )}
              <p className="text-[10px] text-[#7fae92] mt-1.5">
                By subscribing you agree with our Privacy Policy
              </p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pt-4">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white text-[#0b3b24] flex items-center justify-center font-bold text-xs">
                  ✦
                </div>
                <span className="font-serif font-bold text-lg text-white">GeoWatershed.</span>
              </div>
              <p className="text-xs text-[#9fc7af] max-w-xs">
                Built for modern watershed analysis and sustainability needs.
              </p>
              <div className="flex items-center gap-3 text-[#9fc7af]">
                <span className="w-7 h-7 rounded-full bg-[#145334] flex items-center justify-center text-xs">𝕏</span>
                <span className="w-7 h-7 rounded-full bg-[#145334] flex items-center justify-center text-xs">in</span>
                <span className="w-7 h-7 rounded-full bg-[#145334] flex items-center justify-center text-xs">f</span>
                <span className="w-7 h-7 rounded-full bg-[#145334] flex items-center justify-center text-xs">yt</span>
              </div>
            </div>

            {/* Nav Columns */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <p className="font-bold text-white uppercase text-[10px] tracking-wider">Company</p>
              <ul className="space-y-2 text-[#9fc7af]">
                <li><button onClick={handleLaunchApp} className="hover:text-white cursor-pointer">About Us</button></li>
                <li><button onClick={handleLaunchApp} className="hover:text-white cursor-pointer">Services</button></li>
                <li><button onClick={handleLaunchApp} className="hover:text-white cursor-pointer">Pricing</button></li>
                <li><button onClick={handleLaunchApp} className="hover:text-white cursor-pointer">Blogs</button></li>
                <li><a href="#contact" className="hover:text-white">Contact us</a></li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3 text-xs">
              <p className="font-bold text-white uppercase text-[10px] tracking-wider">Platform &amp; Utility</p>
              <ul className="space-y-2 text-[#9fc7af]">
                <li><button onClick={handleLaunchApp} className="hover:text-white cursor-pointer">Interactive GIS Map</button></li>
                <li><button onClick={handleLaunchApp} className="hover:text-white cursor-pointer">AI Hydrology Studio</button></li>
                <li><button onClick={() => openAuthModal("signin")} className="hover:text-white cursor-pointer">Google Sign In / SSO</button></li>
                <li><button onClick={() => openAuthModal("signup")} className="hover:text-white cursor-pointer">Sign Up Free</button></li>
                <li><a href="#faq" className="hover:text-white">Instructions &amp; FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#7fae92]">
            <p>© {new Date().getFullYear()} GeoWatershed. All rights reserved.</p>
            <p>Designed for Upper Bhima Basin &amp; Western Ghats hydrological conservation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
