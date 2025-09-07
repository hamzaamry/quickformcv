"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useCreateResume } from "@/hooks/useResume";
import { UpgradeDialog } from "@/components/Dialogs/UpgradeDialog";

export function CreateResumeDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    title: "",
    jobDescription: "",
  });
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [limitInfo, setLimitInfo] = useState({ current: 0, limit: 0 });

  const { mutate: createResume, isPending } = useCreateResume();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateResume = () => {
    createResume(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({ title: "", jobDescription: "" });
      },
      onError: (error) => {

        const errorDetail = error.response?.data?.detail;
        const isLimitError = errorDetail && errorDetail.includes("limit reached");

        if (isLimitError) {
          const match = errorDetail.match(/limit reached \((\d+)\/(\d+)\)/);

          if (match) {
            setLimitInfo({
              current: parseInt(match[1]),
              limit: parseInt(match[2])
            });
          } else {
            setLimitInfo({
              current: 0,
              limit: 0
            });
          }

          onOpenChange(false);
          setFormData({ title: "", jobDescription: "" });
          setUpgradeDialogOpen(true);
        } else {
          console.error("Error creating resume:", errorDetail || "Failed to create resume");
        }
      },
    });
  };

  return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="w-[85vw] max-w-[600px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-lg sm:text-xl">Create a new resume</DialogTitle>
            </DialogHeader>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Start by giving your resume a title and adding a job description to
              tailor your content.
            </p>
            <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Resume title*
                </label>
                <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Software Engineer Resume"
                    disabled={isPending}
                    required
                    className="w-full text-sm sm:text-base py-2.5 sm:py-3"
                />
                <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="text-sm flex-shrink-0">💡</span>
                  <span className="leading-relaxed">
                Tip: Name your resume based on the position you're applying for.
              </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Job description
                </label>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Add the job description to help tailor your resume content
                  (optional).
                </p>
                <Textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-none"
                    placeholder="Paste the job description here..."
                    disabled={isPending}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
              <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                  className="order-2 sm:order-1 text-sm sm:text-base py-2.5 sm:py-3"
              >
                Cancel
              </Button>
              <Button
                  onClick={handleCreateResume}
                  disabled={isPending || !formData.title.trim()}
                  className="order-1 sm:order-2 text-sm sm:text-base py-2.5 sm:py-3"
              >
                {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </>
                ) : (
                    "Create Resume"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <UpgradeDialog
            open={upgradeDialogOpen}
            onOpenChange={setUpgradeDialogOpen}
            currentLimit={limitInfo.limit}
            currentUsage={limitInfo.current}
        />
      </>
  );
}