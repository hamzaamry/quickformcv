import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">QuickForm CV</span>
            </div>
            <p className="mt-4 text-gray-400 max-w-md">
              The modern resume builder that helps job seekers create
              professional resumes quickly and easily.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link
                href="mailto:support@QuickFormCV.com"
                className="text-gray-400 hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-gray-400 hover:text-white"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="text-gray-400 hover:text-white"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white"
                >
                  Pricing
                </Link>
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
                  href="mailto:support@QuickFormCV.com"
                  className="text-gray-400 hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                {/*                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>*/}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 QuickForm CV. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
