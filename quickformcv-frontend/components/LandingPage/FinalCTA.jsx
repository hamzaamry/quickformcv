import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";

export const FinalCTA = () => {
  return (
    <div className="bg-blue-600">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to build your professional resume?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join thousands of job seekers who are already using QuickForm CV.
          </p>
          <div className="mt-8">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8"
              >
                <Zap className="mr-2 h-4 w-4" />
                Start building now - It's free!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
