"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Zap, CheckCircle, Star, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function UpgradeDialog({ open, onOpenChange, currentLimit, currentUsage }) {
    const router = useRouter();

    // Focus on the most relevant benefits for someone who hit the resume limit
    const keyBenefits = [
        "Unlimited resume creation",
        "Unlimited AI suggestions",
        "Enhanced job search results"
    ];

    const handleUpgradeClick = () => {
        // Close dialog and redirect to pricing page using Next.js router
        onOpenChange(false);
        router.push('/pricing');
    };

    const handlePlanClick = (planHref) => {
        // Close dialog and redirect to specific plan signup
        onOpenChange(false);
        router.push(planHref);
    };

    const plans = [
        {
            name: "Pro",
            price: "$9.99",
            period: "month",
            description: "Perfect for active job seekers",
            icon: Star,
            popular: true,
            href: "/pricing"
        },
        {
            name: "Premium",
            price: "$19.99",
            period: "month",
            description: "For power users and professionals",
            icon: Crown,
            popular: false,
            href: "/pricing"
        }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-amber-100 p-3 rounded-full">
                            <Crown className="h-8 w-8 text-amber-600" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl font-semibold">
                        Resume Limit Reached
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        You've created {currentUsage} out of {currentLimit} free resumes.
                        Upgrade to create unlimited resumes and unlock premium features.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Key Benefits - focused on solving their immediate problem */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            What you'll get instantly:
                        </h3>
                        <ul className="space-y-2">
                            {keyBenefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Plan Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                onClick={() => handlePlanClick(plan.href)}
                                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                                    plan.popular
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center">
                                    <plan.icon className={`h-8 w-8 mx-auto mb-2 ${
                                        plan.popular ? "text-blue-600" : "text-purple-600"
                                    }`} />
                                    <h4 className="font-semibold text-lg">{plan.name}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                                    <div className="text-2xl font-bold">
                                        {plan.price}
                                        <span className="text-sm text-gray-500">/{plan.period}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        onClick={handleUpgradeClick}
                    >
                        <Crown className="h-5 w-5 mr-2" />
                        View All Plans & Features
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Maybe Later
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}