import { CreateResumeCard } from "@/app/(dashboard)/resumes/components/CreateResumeCard";
import { motion } from "framer-motion";
import { ResumeCard } from "@/app/(dashboard)/resumes/components/ResumeCard";
import { formatLastEdited } from "@/lib/utils";

export const ResumeGrid = ({ resumes, onCreateClick }) => {
    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex justify-center w-full"
            >
                <CreateResumeCard onClick={onCreateClick} />
            </motion.div>

            {resumes.map((resume, index) => (
                <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + (index + 1) * 0.05 }}
                    whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex justify-center w-full"
                >
                    <ResumeCard
                        id={resume.id}
                        title={resume.title}
                        lastEdited={formatLastEdited(resume.updated_at)}
                        templateName={resume.template_name}
                    />
                </motion.div>
            ))}
        </div>
    );
};
