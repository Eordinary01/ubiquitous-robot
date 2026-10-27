import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import Header from "@/components/Header";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "FitConnect — The White-Label App for Modern Gyms",
  description:
    "White-label infrastructure for fitness studios. Give your members a branded portal to track their diet, workouts, and progress.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-[4px] focus:outline-none"
        >
          Skip to content
        </a>
        <AuthProvider>
          <Header />
          <main id="main-content">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
