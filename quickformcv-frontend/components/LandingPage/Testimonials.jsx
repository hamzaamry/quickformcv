import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Manager",
      initial: "S",
      bgColor: "bg-blue-500",
      content:
        "QuickFormCV made creating my resume so easy! The templates are beautiful and the real-time preview saved me hours.",
    },
    {
      name: "Michael Rodriguez",
      role: "Software Developer",
      initial: "M",
      bgColor: "bg-green-500",
      content:
        "The AI suggestions helped me write better descriptions for my experience. Got 3 interviews in the first week!",
    },
    {
      name: "Amanda Foster",
      role: "UX Designer",
      initial: "A",
      bgColor: "bg-purple-500",
      content:
        "Finally, a resume builder that doesn't look like everyone else's. The ColorCraft template is stunning!",
    },
  ];

  return (
    <div id="testimonials" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by job seekers everywhere
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See what our beta users are saying about QuickForm CV
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div
                    className={`h-10 w-10 rounded-full ${testimonial.bgColor} flex items-center justify-center text-white font-semibold`}
                  >
                    {testimonial.initial}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
