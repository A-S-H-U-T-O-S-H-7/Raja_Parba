// app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/lib/stores/useAuthStore";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const { signIn, loading } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await signIn(email, password);

    if (result.success) {
      toast.success("Welcome to Raja Parba 2026 🌺");
      router.push("/");
    } else {
      setError(result.error);
      toast.error(result.error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-6 overflow-x-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">

      {/* Subtle Mandala Background */}
      <div className="absolute inset-0 opacity-5 bg-[url('/mandala-pattern.png')] bg-center bg-cover pointer-events-none"></div>

      {/* Decorative Corners */}
      <img
        src="/raja-flower.png"
        className="absolute top-0 left-0 w-24 opacity-60 rotate-180 pointer-events-none"
        alt="flower"
      />
      <img
        src="/raja-flower.png"
        className="absolute bottom-0 right-0 w-24 opacity-60 pointer-events-none"
        alt="flower"
      />

      <div className="relative w-full max-w-md">

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-rose-100">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🌺</div>

            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r 
            from-rose-600 via-red-600 to-orange-500 
            bg-clip-text text-transparent">
              Raja Parba 2026
            </h1>

            <p className="text-xs md:text-sm text-rose-600 italic mt-1">
              Festival of Womanhood • Pride of Odisha
            </p>

            <p className="text-gray-600 mt-2 text-sm">
              Sign in to reserve your celebration experience
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-rose-50 border-2 border-rose-100 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent
                transition-all duration-300 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 bg-rose-50 border-2 border-rose-100 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent
                transition-all duration-300 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm
              bg-gradient-to-r from-rose-600 via-red-600 to-orange-500
              hover:-translate-y-0.5 hover:shadow-xl
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Enter the Celebration"}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-rose-600 hover:text-rose-700 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Decorative Divider */}
          <div className="mt-6 flex items-center justify-center">
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
            <span className="mx-3 text-rose-600 font-semibold text-xs">
              OR
            </span>
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
          </div>

          {/* Google Sign In */}
          <div className="mt-6">
            <GoogleSignInButton />
          </div>

          {/* Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-rose-600 hover:text-rose-700 transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>

          {/* Back Home */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}