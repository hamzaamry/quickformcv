import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QuickFormLogo } from "@/components/icons/QuickFormLogo";
import { QuickFormLogoBlue } from "@/components/icons/QuickFormLogoBlue";
import { trackCTAClick, trackNavigation } from "@/utils/analytics";

export const Header = () => {
  const handleCTAClick = () => {
    trackCTAClick('header', 'Start building free');
  };

  const handleNavClick = (linkText, linkTarget) => {
    trackNavigation(linkText, linkTarget);
  };

  return (
      <header className="relative z-50 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link
                href="/"
                className="flex items-center cursor-pointer"
                onClick={() => handleNavClick('Logo', '/')}
            >
              {/* Desktop Logo */}
              <QuickFormLogo className="hidden md:block h-10 w-auto" />
              {/* Mobile Logo */}
              <QuickFormLogoBlue className="block md:hidden h-8 w-auto" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                  href="#features"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => handleNavClick('Features', '#features')}
              >
                Features
              </Link>
              <Link
                  href="#testimonials"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => handleNavClick('Reviews', '#testimonials')}
              >
                Reviews
              </Link>
              <Link
                  href="#blogs"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => handleNavClick('Blogs', '#blogs')}
              >
                Blogs
              </Link>
              <Link
                  href="#faq"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => handleNavClick('FAQ', '#faq')}
              >
                FAQ
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center">
              <Link href="/auth/signup">
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-sm font-medium"
                    onClick={handleCTAClick}
                >
                  Start building free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
  );
};
