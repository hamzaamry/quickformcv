import { MacWindow } from "@/components/LandingPage/MacWindow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center lg:pt-24">
        {/* Beta Badge */}
        <div className="mb-8">
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
          >
            🚀 Beta Version - Limited Time Free Access
          </Badge>
        </div>

        {/* Main Headline */}
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          Resume building{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
              preserveAspectRatio="none"
            >
              <path d="m203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative">made simple</span>
          </span>{" "}
          for job seekers.
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-700">
          Create professional resumes in minutes with our free resume builder.
          AI-powered suggestions, expert templates, and real-time preview -
          completely free during beta.
        </p>

        {/* CTA Buttons  */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-x-6">
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 w-full sm:w-auto"
            >
              Start building free
            </Button>
          </Link>
        </div>

        {/* FOMO Message */}
        <div className="mt-8">
          <p className="text-sm text-gray-600">
            ⚡ <strong>Limited Beta Access:</strong> Join early users building
            resumes for free.
            <span className="text-blue-600 font-medium"> Beta ends soon!</span>
          </p>
        </div>
      </div>

      {/* Product Screenshot in Mac Window */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-5xl">
          <MacWindow title="">
            <Image
              src="/heroScreen.png"
              alt="ClaraHire CV Builder Interface"
              width={1000}
              height={600}
              className="w-full h-auto mb-8"
            />
          </MacWindow>
        </div>
      </div>
    </div>
  );
};
