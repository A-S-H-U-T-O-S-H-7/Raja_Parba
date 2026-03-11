import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { BookingProvider } from "@/context/BookingContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from 'react-hot-toast';
import AuthDebugger from '@/components/AuthDebugger';

export const metadata = {
  metadataBase: new URL("https://rajaparba.svsamiti.com"),
  title: "Odisha Raja Parba 2026 | SV Samiti",
  description:
    "Celebrate Odisha Raja Parba 2026 with cultural shows, free passes, stalls, donations, and vibrant community events.",
  openGraph: {
    title: "Odisha Raja Parba 2026 | SV Samiti",
    description:
      "Celebrate Odisha Raja Parba 2026 with cultural shows, free passes, stalls, donations, and vibrant community events.",
    url: "https://rajaparba.svsamiti.com",
    siteName: "SV Samiti",
    images: [
      {
        url: "https://rajaparba.svsamiti.com/raja-celebration.png",
        width: 1200,
        height: 630,
        alt: "Odisha Raja Parba 2026 celebration",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Odisha Raja Parba 2026 | SV Samiti",
    description:
      "Celebrate Odisha Raja Parba 2026 with cultural shows, free passes, stalls, donations, and vibrant community events.",
    images: ["https://rajaparba.svsamiti.com/raja-celebration.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {/* COMMENTED OUT OLD PROVIDERS */}
          {/* <AuthProvider> */}
          {/* <AdminProvider> */}
          
          {/* Only BookingProvider is active now */}
          <BookingProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            {/* <AuthDebugger /> */}
          </BookingProvider>
          
          {/* </AdminProvider> */}
          {/* </AuthProvider> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
