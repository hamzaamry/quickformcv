import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import Link from "next/link";

export const Pricing = () => {
    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "forever",
            description: "Perfect for getting started",
            icon: Zap,
            iconBg: "bg-gray-100",
            iconColor: "text-gray-600",
            popular: false,
            features: [
                "Basic resume builder",
                "1 resume maximum",
                "3 AI suggestions per month",
                "3 job searches per month",
                "First 3 results visible (rest blurred)",
                "Community support"
            ],
            buttonText: "Get Started Free",
            buttonVariant: "outline",
            href: "/auth/signup?plan=free"
        },
        {
            name: "Pro",
            price: "$9.99",
            period: "month",
            yearlyPrice: "99",
            description: "For serious job seekers",
            icon: Star,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            popular: true,
            features: [
                "Unlimited resumes",
                "Unlimited AI suggestions",
                "3 job searches per week",
                "70% of results visible (30% blurred)",
                "Priority email support",
            ],
            buttonText: "Start Pro Trial",
            buttonVariant: "default",
            href: "/auth/signup?plan=pro"
        },
        {
            name: "Premium",
            price: "$19.99",
            period: "month",
            yearlyPrice: "199",
            description: "For power users and professionals",
            icon: Crown,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            popular: false,
            features: [
                "Everything in Pro",
                "Daily job searches",
                "100% of results visible",
                "Smart job matching",
                "Premium support"
            ],
            buttonText: "Go Premium",
            buttonVariant: "default",
            href: "/auth/signup?plan=premium"
        }
    ];

    return (
        <div id="pricing" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                        Choose the perfect{" "}
                        <span className="relative whitespace-nowrap text-blue-600">
              <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
                  preserveAspectRatio="none"
              >
                <path d="m203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">plan</span>
            </span>{" "}
                        for you
                    </h2>
                    <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                        Start free and upgrade as you grow. All plans include our core resume builder
                        with professional templates.
                    </p>
                </div>

                {/* Pricing Toggle */}
                <div className="mt-12 flex justify-center">
                    <div className="bg-gray-100 p-1 rounded-lg">
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
                            Monthly
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                            Yearly <span className="text-green-600">(Save 20%)</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative ${
                                plan.popular
                                    ? "border-blue-500 border-2 shadow-xl scale-105"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                                    Most Popular
                                </Badge>
                            )}

                            <CardHeader className="text-center pb-4">
                                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${plan.iconBg} mx-auto mb-4`}>
                                    <plan.icon className={`h-6 w-6 ${plan.iconColor}`} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                                <p className="text-gray-600">{plan.description}</p>

                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-600">/{plan.period}</span>
                                    {plan.yearlyPrice && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            or ${plan.yearlyPrice}/year (save 20%)
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4">
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href={plan.href}>
                                    <Button
                                        className={`w-full ${
                                            plan.buttonVariant === "outline"
                                                ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                : plan.popular
                                                    ? "bg-blue-600 hover:bg-blue-700"
                                                    : "bg-purple-600 hover:bg-purple-700"
                                        }`}
                                        variant={plan.buttonVariant}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};