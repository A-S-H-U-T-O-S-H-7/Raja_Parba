// app/register/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/lib/stores/useAuthStore";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const { signUp, loading } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const result = await signUp(email, password, name);

    if (result.success) {
      toast.success("Welcome to Raja Celebration 🌺");
      router.push("/");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8
    bg-gradient-to-br from-rose-50 via-orange-50 to-amber-100">

      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl 
        border border-rose-100 p-7">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🌺</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r 
            from-rose-600 to-amber-600 bg-clip-text text-transparent">
              Join Raja Celebration
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Create your account to book sacred seats
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <p className="text-xs text-gray-500">
              Minimum 6 characters required
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white rounded-xl 
              bg-gradient-to-r from-rose-500 to-amber-500 
              hover:from-rose-600 hover:to-amber-600
              transition-all duration-300 shadow-md"
            >
              {loading ? "Creating Account..." : "Create Account 🌺"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-3 text-sm text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          {/* Google */}
          <GoogleSignInButton text="Sign up with Google" />

          {/* Footer */}
          <div className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-rose-600 font-medium hover:text-rose-700"
            >
              Log in
            </Link>
          </div>

          <div className="mt-2 text-center">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              ← Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}