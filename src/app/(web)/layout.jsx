"use client"
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/stores/useAuthStore";

function layout({ children }) {
    const { user, logout ,loading} = useAuthStore();
    const router = useRouter();
    
    const handleLogout = async () => {
      try {
        await logout();
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    
   
  return (
    <div>
      <Header 
        user={user} 
        handleLogout={handleLogout} 
      />

      {children}
      
      <Footer/>
      
      
    </div>
  );
}

export default layout;
