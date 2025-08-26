import { Inter } from "next/font/google";
import Script from "next/script";
import Providers from "./providers";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { NavigationLoaderProvider } from "@/hooks/useNavigationLoader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QuickFormCV",
  description: "Create professional, ATS-friendly resumes in minutes. 15+ expert templates, AI-powered suggestions, real-time preview & PDF export. Join 10,000+ job seekers - completely free during beta.",
  keywords: "free resume builder, professional resume templates, ATS resume, online CV maker, resume generator, resume builder free, AI resume builder",
  robots: "index, follow",
  canonical: "https://quickformcv.com",
  icons: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/favicon.svg',
    },
  ],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </head>
        <body className={inter.className}>
        {/* Google Analytics */}
        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-HQ39WTN17K"
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-HQ39WTN17K');
              `}
        </Script>

        <Providers>
            <AuthProvider>
                <NavigationLoaderProvider>{children}</NavigationLoaderProvider>
            </AuthProvider>
        </Providers>
        </body>
        </html>
    );
}