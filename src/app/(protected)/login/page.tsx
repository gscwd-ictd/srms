"use client";

import Logo2BigSvg from "@srms/components/ui-custom/Svg/logo2Big/logo2BigSvg";
import MapBackgroundSvg from "@srms/components/ui-custom/Svg/mapBackground/mapBackgroundSvg";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setLoading(true);
    // simulate login
    setTimeout(() => setLoading(false), 800);
  }

  return (
    <div className="font-inter relative min-h-screen w-full bg-white">
      {/* Animated GIS-style SVG background */}
      <MapBackgroundSvg />

      {/* Centered login modal */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-3xl grid-cols-1 items-center gap-8 md:grid-cols-2">
          {/* left: info / branding */}
          <aside className="hidden flex-col justify-center pr-6 pl-8 md:flex">
            <div className="mb-6">
              <div className="inline-flex items-center gap-3">
                {/* <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" fill="#2b85ff" />
                  <path
                    d="M7 14c2-3 6-3 8 0"
                    stroke="#fff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg> */}
                <Logo2BigSvg />
                <div>
                  <h1 className="text-2xl font-semibold text-[#0b2340]">2BIG</h1>
                  <p className="text-sm text-[#0b2340]/70">Operations Monitoring & Management System</p>
                </div>
              </div>
            </div>

            <h2 className="mb-3 text-3xl leading-tight font-bold text-[#0b2340]">Welcome back</h2>
            <p className="text-[#0b2340]/70">
              Sign in to access GSCWD data loggers, vehicles, and pipelines.
            </p>

            <ul className="mt-4 space-y-3 text-sm whitespace-nowrap text-[#0b2340]/70">
              <li>• Data loggers</li>
              <li>• Vehicle locations</li>
              <li>• Pipeline layout</li>
            </ul>
          </aside>

          {/* right: form */}
          <section className="rounded-2xl border border-[#2b85ff]/8 bg-white/95 p-8 shadow-2xl backdrop-blur-md md:p-10 dark:bg-white/90">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#0b2340]">Log In</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0b2340]/80">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#2b85ff]/20 px-4 py-3 text-black focus:ring-2 focus:ring-[#2b85ff]/30 focus:outline-none"
                  placeholder="first&lastname@gscwd.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0b2340]/80">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#2b85ff]/20 px-4 py-3 text-black focus:ring-2 focus:ring-[#2b85ff]/30 focus:outline-none"
                  placeholder="Enter your password"
                />
              </div>

              {/* <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-[#0b2340]/70">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#2b85ff]" />
                  Remember me
                </label>
                <a href="#" className="text-[#2b85ff]">
                  Forgot password?
                </a>
              </div> */}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-lg bg-gradient-to-tr from-blue-600/80 via-blue-400/80 to-sky-400/80 py-3 font-semibold text-white transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            {/* <p className="mt-6 text-xs text-[#0b2340]/60">
              By signing in you agree to our{" "}
              <a href="#" className="text-[#2b85ff]">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#2b85ff]">
                Privacy
              </a>
              .
            </p> */}
          </section>
        </div>
      </main>

      {/* small footer */}
      <footer className="absolute bottom-4 left-6 z-10 text-xs text-[#0b2340]/60">
        © {new Date().getFullYear()} OMMS
      </footer>
    </div>
  );
}
