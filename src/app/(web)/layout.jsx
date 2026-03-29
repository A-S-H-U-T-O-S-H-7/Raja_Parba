"use client"
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import FloatingShareButton from "@/components/home/FloatingShareButton";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/lib/stores/useAuthStore";

function layout({ children }) {
    const { user, logout ,loading} = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    
    const handleLogout = async () => {
      try {
        await logout();
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    const backButtonAllowedPaths = [
      "/raja-kumari",
      "/drawing",
      "/raja-queen",
      "/poda-pitha",
      "/award",
      "/performer",
      "/sponsor",
    ];
    const shouldShowBackButton = backButtonAllowedPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    const handleBack = () => {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
        return;
      }
      router.push("/");
    };
   
   
  return (
    <div>
      <Header 
        user={user} 
        handleLogout={handleLogout} 
      />

      {shouldShowBackButton && (
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-14 top-12 sm:left-6 md:top-38 lg:left-88 z-40 inline-flex items-center gap-2 rounded-full
           border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700
           shadow-sm transition-all hover:-translate-x-0.5 hover:bg-gray-100 hover:shadow-md "
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}

      {children}

      <FloatingShareButton />
      
      <Footer/>
      
      
    </div>
  );
}

export default layout;
