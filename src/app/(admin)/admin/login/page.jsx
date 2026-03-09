"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import { toast } from "react-hot-toast";
import {
  Store,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Sun,
  Moon,
  Cloud,
} from "lucide-react";

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <motion.button
      type="button"
      onClick={() => setDarkMode((prev) => !prev)}
      className={`relative h-8 w-14 rounded-full p-1 ${darkMode ? "bg-slate-700" : "bg-amber-100"}`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          darkMode ? "bg-amber-300 text-slate-900" : "bg-amber-500 text-white"
        }`}
        animate={{ x: darkMode ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {darkMode ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </motion.div>
    </motion.button>
  );
}

function AnimatedBackground({ darkMode }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          darkMode
            ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            : "bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50"
        }`}
      />

      {darkMode ? (
        <>
          {[...Array(28)].map((_, i) => (
            <motion.span
              key={`star-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: Math.random() * 2 + 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </>
      ) : (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute text-sky-300/50"
              style={{ left: `${12 + i * 20}%`, top: `${10 + (i % 2) * 14}%` }}
              animate={{ x: [0, 30, 0], y: [0, -8, 0] }}
              transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Cloud className="h-14 w-14" />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  const { adminLogin, loading, error, isAuthenticated, clearError } = useAdminAuthStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    setShowTransition(true);
    const result = await adminLogin(username, password);

    if (result.success) {
      toast.success("Welcome back, Admin!");
      router.push("/admin/dashboard");
      return;
    }

    toast.error(result.error || "Login failed");
    setShowTransition(false);
  };

  const imageSrc = darkMode ? "/seller-login4.png" : "/seller-login5.png";

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8">
      <AnimatedBackground darkMode={darkMode} />

      <AnimatePresence>
        {(loading || showTransition) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center gap-4 text-white">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400/30 border-t-amber-400" />
              <p className="text-sm font-semibold tracking-wide">Verifying Credentials</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <div className="mx-auto mb-4 h-72 w-72 max-w-full lg:mx-0 lg:h-80 lg:w-80">
            <Image src={imageSrc} alt="Login visual" width={320} height={320} className="h-full w-full object-contain" priority />
          </div>

          <h1 className={`text-3xl font-bold lg:text-4xl ${darkMode ? "text-white" : "text-slate-800"}`}>Raja Parba</h1>
          <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Admin access for festival management</p>
          <div className="mt-5 flex items-center justify-center gap-2 text-amber-500 lg:justify-start">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm">Secure access for authorized team members only.</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <div className="mx-auto mb-4 flex w-full max-w-md justify-end">
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>

          <div
            className={`mx-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl ${
              darkMode ? "border-white/10 bg-white/10" : "border-slate-200/60 bg-white/85"
            }`}
          >
            <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
            <div className="p-6 lg:p-8">
              <div className="mb-6 text-center">
                <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Admin Login</h2>
                <p className={`mt-1 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Sign in to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <div>
                  <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>Username</label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full rounded-lg border-2 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 ${
                        darkMode
                          ? "border-slate-600 bg-slate-900/60 text-white placeholder-slate-500"
                          : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                      }`}
                      placeholder="Enter your username"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full rounded-lg border-2 py-2.5 pl-10 pr-12 text-sm outline-none transition focus:border-amber-500 ${
                        darkMode
                          ? "border-slate-600 bg-slate-900/60 text-white placeholder-slate-500"
                          : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                      }`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                        darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Access Admin Panel
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="relative my-6">
                <div className={`absolute inset-0 flex items-center ${darkMode ? "border-slate-700" : "border-slate-300"}`}>
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center">
                  <span className={`bg-transparent px-3 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Admin Access</span>
                </div>
              </div>

              <div className="space-y-3 text-center">
                <Link href="/" className={`block text-xs font-medium transition ${darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"}`}>
                  Back to Main Site
                </Link>
                <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>Secure Admin Access - Authorized Personnel Only</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}