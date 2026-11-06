import { Mail } from "lucide-react";
import Link from "next/link";
import { QuickFormLogoWhite } from "@/components/icons/QuickFormLogoWhite";

export const Footer = () => {
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center">
                <QuickFormLogoWhite className="h-8 w-auto" />
              </div>
              <p className="mt-4 text-gray-400 max-w-md">
                The modern resume builder that helps job seekers create
                professional resumes quickly and easily.
              </p>
              <div className="mt-6 flex space-x-4">
                <Link
                    href="mailto:hamzaamry009@gmail.com"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Product
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                      href="#features"
                      onClick={(e) => handleSmoothScroll(e, 'features')}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                      href="#testimonials"
                      onClick={(e) => handleSmoothScroll(e, 'testimonials')}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Reviews
                  </a>
                </li>
                <li>
                  <a
                      href="#pricing"
                      onClick={(e) => handleSmoothScroll(e, 'pricing')}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                      href="#blogs"
                      onClick={(e) => handleSmoothScroll(e, 'blogs')}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Blogs
                  </a>
                </li>
                <li>
                  <a
                      href="#faq"
                      onClick={(e) => handleSmoothScroll(e, 'faq')}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Support
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                      href="mailto:hamzaamry009@gmail.com"
                      className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                      href="/auth/signup"
                      className="text-gray-400 hover:text-white transition-colors"
                  >
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 QuickForm CV. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0 flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
  );
};