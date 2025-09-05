import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QuickFormLogo } from "@/components/icons/QuickFormLogo";
import { QuickFormLogoBlue } from "@/components/icons/QuickFormLogoBlue";
import { useState, useEffect } from "react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header
          className={`fixed w-full z-50 transition-all duration-300 ${
              isScrolled
                  ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
                  : 'bg-white'
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center cursor-pointer">
              {/* Desktop Logo */}
              <QuickFormLogo className="hidden md:block h-10 w-auto" />
              {/* Mobile Logo */}
              <QuickFormLogoBlue className="block md:hidden h-8 w-auto" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, 'features')}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Features
              </a>
              <a
                  href="#testimonials"
                  onClick={(e) => handleSmoothScroll(e, 'testimonials')}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Reviews
              </a>
              <a
                  href="#pricing"
                  onClick={(e) => handleSmoothScroll(e, 'pricing')}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Pricing
              </a>
              <a
                  href="#blogs"
                  onClick={(e) => handleSmoothScroll(e, 'blogs')}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Blogs
              </a>
              <a
                  href="#faq"
                  onClick={(e) => handleSmoothScroll(e, 'faq')}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                FAQ
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center">
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors">
                  Start building free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
  );
};
