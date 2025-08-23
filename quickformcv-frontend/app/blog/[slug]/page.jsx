import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { getAllBlogSlugs, getBlogPost } from "@/app/data/blogPosts";

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-100 hover:text-white font-medium transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center text-sm text-blue-100 mb-6 gap-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <time>{post.date}</time>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post.readTime}</span>
            </div>
            <button className="flex items-center hover:text-white transition-colors ml-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Content Body */}
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="prose prose-lg prose-blue max-w-none">
              <div className="text-gray-700 leading-relaxed text-lg">
                {post.content}
              </div>
            </div>
          </div>
        </article>

        {/* Related/Navigation */}
        <div className="mt-12 mb-16">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enjoyed this article?
                </h3>
                <p className="text-gray-600">
                  Check out more posts on our blog
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                View All Posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
