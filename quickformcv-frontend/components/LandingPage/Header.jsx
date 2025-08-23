import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QuickFormLogo } from "@/components/icons/QuickFormLogo";

export const Header = () => {
  return (
    <header className="relative z-50 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center cursor-pointer">
            <QuickFormLogo className="h-10 w-auto" />
          </Link>
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Reviews
            </Link>
            <Link
              href="#blogs"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Blogs
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              FAQ
            </Link>
          </nav>
          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm font-medium">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-sm font-medium">
                Start building free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
