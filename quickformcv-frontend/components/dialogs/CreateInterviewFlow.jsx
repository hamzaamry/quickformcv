"use client";

import { useState } from "react";
import UploadCVDialog from "./UploadCVDialog";
import JobDetailsDialog from "./JobDetailsDialog";

export default function CreateInterviewFlow({
  open,
  onOpenChange,
  onComplete,
}) {
  const [step, setStep] = useState(1); // 1 = CV upload, 2 = Job details
  const [cvFile, setCvFile] = useState(null);

  const handleCVContinue = (file) => {
    setCvFile(file);
    setStep(2);
  };

  const handleJobDetailsSubmit = (formData) => {
    // Combine CV file and job details
    const interviewData = {
      ...formData,
      cvFile,
    };

    // Call the onComplete callback with the combined data
    onComplete(interviewData);

    // Reset the flow
    resetFlow();
  };

  const resetFlow = () => {
    setStep(1);
    setCvFile(null);
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      resetFlow();
    }
    onOpenChange(isOpen);
  };

  return (
    <>
      <UploadCVDialog
        open={open && step === 1}
        onOpenChange={handleOpenChange}
        onContinue={handleCVContinue}
      />

      <JobDetailsDialog
        open={open && step === 2}
        onOpenChange={handleOpenChange}
        cvFile={cvFile}
        onSubmit={handleJobDetailsSubmit}
      />
    </>
  );
}
