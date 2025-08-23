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

export function CreateResumeDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    title: "",
    jobDescription: "",
  });

  const { mutate: createResume, isPending } = useCreateResume();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateResume = () => {
    createResume(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({ title: "", jobDescription: "" }); // Reset form on success
      },
      onError: (error) => {
        console.error("Failed to create resume:", error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a new resume</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          Start by giving your resume a title and adding a job description to
          tailor your content.
        </p>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Resume title*</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Software Engineer Resume"
              disabled={isPending}
              required
            />
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-xs">💡</span>
              <span>
                Tip: Name your resume based on the position you're applying for.
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Job description</label>
            <p className="text-sm text-muted-foreground">
              Add the job description to help tailor your resume content
              (optional).
            </p>
            <Textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              className="min-h-[120px]"
              placeholder="Paste the job description here..."
              disabled={isPending}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleCreateResume}
            disabled={isPending || !formData.title.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Resume...
              </>
            ) : (
              "Create Resume"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
