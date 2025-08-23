import { Download, Eye, FileText, Sparkles } from "lucide-react";

export const Features = () => {
  return (
    <div
      id="features"
      className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200&text=pattern')] opacity-10"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Everything you need to build your{" "}
            <span className="relative whitespace-nowrap">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/40"
                preserveAspectRatio="none"
              >
                <path d="m203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative text-white">perfect resume</span>
            </span>
          </h2>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Professional templates, real-time editing, and seamless export - all
            free during our beta phase.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 mx-auto">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Professional Templates
            </h3>
            <p className="mt-2 text-sm text-blue-100">
              Expert-designed templates for every industry
            </p>
          </div>

          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 mx-auto">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Real-time Preview
            </h3>
            <p className="mt-2 text-sm text-blue-100">
              See changes instantly as you type
            </p>
          </div>

          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 mx-auto">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              One-Click Export
            </h3>
            <p className="mt-2 text-sm text-blue-100">
              Download high-quality PDFs instantly
            </p>
          </div>

          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 mx-auto">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              AI-Powered
            </h3>
            <p className="mt-2 text-sm text-blue-100">
              Smart suggestions and content enhancement
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 border-t border-white/20 pt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="mt-2 text-blue-100">Free during beta</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">5 Min</div>
              <div className="mt-2 text-blue-100">Average build time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">No Limits</div>
              <div className="mt-2 text-blue-100">Unlimited downloads</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
