import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export const CreateResumeCard = ({ onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-lg h-64 p-6 hover:shadow-md transition-all duration-300 cursor-pointer group w-[140px] sm:w-[160px] relative overflow-hidden"
  >
    <div className="flex flex-col items-center justify-center text-center h-full py-6">
      <motion.div
        whileHover={{ rotate: 90, scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors duration-300"
      >
        <Plus size={24} className="text-white" />
      </motion.div>

      <h3 className="text-sm font-medium text-gray-900 mb-2">Create Resume</h3>
      <p className="text-gray-600 text-xs mb-4">Build a new resume</p>

      <span className="inline-flex items-center text-blue-600 font-medium text-xs group-hover:text-blue-700 transition-colors duration-300">
      Get Started
      <svg
          className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </span>
    </div>

    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-blue-50/80 to-transparent transform -skew-x-12" />
  </motion.div>
);