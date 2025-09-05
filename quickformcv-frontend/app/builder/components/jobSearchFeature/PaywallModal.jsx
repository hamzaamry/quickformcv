import React, { useState } from 'react';
import { Crown, Sparkles } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const PaywallModal = ({ onClose }) => {
    const [open, setOpen] = useState(true);

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="w-[95vw] max-w-md p-8 overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>Upgrade to Premium</DialogTitle>
                </DialogHeader>

                <div className="text-center space-y-6 relative z-10">
                    {/* Crown icon with gradient and glow */}
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <Crown className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Unlock All{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                Job Matches
                            </span>
                        </h3>
                        <p className="text-gray-600">
                            Get access to all job opportunities matched to your profile, plus advanced features.
                        </p>
                    </div>

                    {/* Features list with enhanced styling */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                        <div className="space-y-4">
                            {[
                                'View all job matches (unlimited)',
                                'Direct application links',
                                'Company insights & culture fit',
                                'Salary negotiation tips',
                                'Interview preparation guides'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 group">
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-300">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-xl">
                            {/* Shine effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700">
                                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>

                            <span className="relative z-10">Upgrade to Premium - $19/month</span>

                            {/* Outer glow */}
                            <div className="absolute -inset-2 bg-blue-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </button>

                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-500" />
                            Cancel anytime. 7-day free trial.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaywallModal;