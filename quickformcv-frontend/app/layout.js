import { Inter } from "next/font/google";
import Providers from "./providers";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { NavigationLoaderProvider } from "@/hooks/useNavigationLoader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title:
    "Free Resume Builder Online - Professional ATS Templates 2025 | ClaraHire",
  description:
    "Create professional, ATS-friendly resumes in minutes. 15+ expert templates, AI-powered suggestions, real-time preview & PDF export. Join 10,000+ job seekers - completely free during beta.",
  keywords:
    "free resume builder, professional resume templates, ATS resume, online CV maker, resume generator, resume builder free, AI resume builder",
  robots: "index, follow",
  canonical: "https://clarahire.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <NavigationLoaderProvider>{children}</NavigationLoaderProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
