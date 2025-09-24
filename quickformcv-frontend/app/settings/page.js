"use client"

import { useUser } from "@/hooks/useUser"
import { useSubscription } from "@/hooks/useSubscription"
import { subscriptionService } from "@/services/api/subscription"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UsageCard } from "@/components/settings/UsageCard";
import { SubscriptionNotAvailable } from "@/components/settings/SubscriptionNotAvailable"
import { Crown, Zap, CreditCard, AlertCircle, User, Mail, Clock, Calendar, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { getTierIcon, getDisplayName } from "@/lib/utils";

export default function SettingsPage() {
    const { data: user } = useUser()
    const { data: subscription } = useSubscription()

    if (!subscription) {
        <SubscriptionNotAvailable />
    }

    const tierInfo = subscriptionService.getTierInfo(subscription);
    const usage = subscriptionService.getUsage(subscription);
    const permissions = subscriptionService.getPermissions(subscription);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50/30">
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10 opacity-30" />

            <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center sm:text-left space-y-4"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                        Your{" "}
                        <span className="relative whitespace-nowrap text-blue-600">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 418 42"
                                className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
                                preserveAspectRatio="none"
                            >
                                <path d="m203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                            </svg>
                            <span className="relative">Account Dashboard</span>
                        </span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl">
                        Manage your subscription, monitor usage, and explore premium features
                    </p>
                </motion.div>

                {/* Current Plan Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden">
                        <div className="h-2 bg-blue-600"></div>
                        <CardHeader className="pb-6">
                            <CardTitle className="flex items-center gap-4 text-xl font-bold">
                                <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg">
                                    {getTierIcon(tierInfo?.tier)}
                                </div>
                                <div>
                                    <div className="text-gray-900">{getDisplayName(tierInfo?.tier)} Plan</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <p className="text-sm text-gray-600 font-normal">
                                            Resets in {tierInfo?.days_until_reset} days
                                        </p>
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <UsageCard
                                    title="AI Credits"
                                    icon={<TrendingUp className="h-4 w-4" />}
                                    usage={usage?.ai_credits}
                                    warning={!permissions?.can_use_ai}
                                />

                                <UsageCard
                                    title="Job Searches"
                                    icon={<Calendar className="h-4 w-4" />}
                                    usage={usage?.job_searches}
                                    warning={!permissions?.can_search_jobs}
                                />

                                <UsageCard
                                    title="Resumes"
                                    icon={<User className="h-4 w-4" />}
                                    usage={usage?.resumes}
                                    warning={!permissions?.can_create_resume}
                                />
                            </div>

                            {/* Upgrade CTA for Free Plan */}
                            {tierInfo?.tier === "free" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-blue-600/10 rounded-2xl"></div>
                                    <div className="relative p-8 bg-blue-50/80 rounded-2xl border border-blue-200/50 backdrop-blur-sm">
                                        <div className="flex items-start gap-6">
                                            <motion.div
                                                whileHover={{ rotate: 10, scale: 1.1 }}
                                                className="p-3 bg-blue-600 rounded-2xl shadow-lg"
                                            >
                                                <Crown className="h-6 w-6 text-white" />
                                            </motion.div>
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                        Unlock Premium Features
                                                    </h4>
                                                    <p className="text-gray-600 text-base leading-relaxed">
                                                        Get unlimited AI credits, create unlimited resumes, access premium templates,
                                                        and enjoy priority support with our Pro and Premium plans.
                                                    </p>
                                                </div>
                                                    <Button
                                                        size="lg"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                                    >
                                                        <Crown className="h-5 w-5 mr-2" />
                                                        Upgrade Your Plan
                                                    </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Account Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-4 text-xl font-bold">
                                <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg">
                                    <User className="h-5 w-5" />
                                </div>
                                Account Information
                            </CardTitle>
                            <CardDescription className="text-gray-600 text-base">
                                Your personal details and account preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                        <div className="p-2 rounded-lg bg-blue-100">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        Username
                                    </div>
                                    <p className="text-base text-gray-900 bg-gradient-to-r from-gray-50 to-blue-50/30 px-4 py-3 rounded-xl border border-gray-200/50 font-medium">
                                        {user?.username || "Not set"}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                        <div className="p-2 rounded-lg bg-green-100">
                                            <Mail className="h-4 w-4 text-green-600" />
                                        </div>
                                        Email Address
                                    </div>
                                    <p className="text-base text-gray-900 bg-gradient-to-r from-gray-50 to-green-50/30 px-4 py-3 rounded-xl border border-gray-200/50 font-medium">
                                        {user?.email || "Not available"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}