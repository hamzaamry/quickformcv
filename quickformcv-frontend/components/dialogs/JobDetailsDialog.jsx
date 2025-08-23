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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Building, Users, Clock, FileText } from "lucide-react";

// Seniority levels
const SENIORITY_LEVELS = [
  "INTERN",
  "JUNIOR",
  "MID-LEVEL",
  "SENIOR",
  "LEAD",
  "EXECUTIVE",
];

// Experience years
const EXPERIENCE_YEARS = Array.from({ length: 21 }, (_, i) => i.toString());

export default function JobDetailsDialog({
  open,
  onOpenChange,
  cvFile,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    seniorityLevel: "",
    requiredExperience: "",
    jobDescription: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.jobTitle.trim() &&
      formData.companyName.trim() &&
      formData.seniorityLevel &&
      formData.requiredExperience &&
      formData.jobDescription.trim()
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    onSubmit({
      ...formData,
      cvFile,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-xl">
        <DialogHeader className="pt-8 px-8">
          <DialogTitle className="text-2xl font-bold text-center">
            Job Details
          </DialogTitle>
          <p className="text-center text-gray-500 mt-2">
            Provide information about the position
          </p>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <Label htmlFor="jobTitle" className="font-medium">
                Job Title
              </Label>
            </div>
            <Input
              id="jobTitle"
              placeholder="e.g. Frontend Developer"
              value={formData.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              className="border-gray-300 focus-visible:ring-black"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500" />
              <Label htmlFor="companyName" className="font-medium">
                Company Name
              </Label>
            </div>
            <Input
              id="companyName"
              placeholder="e.g. Acme Inc."
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className="border-gray-300 focus-visible:ring-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <Label htmlFor="seniorityLevel" className="font-medium">
                  Seniority Level
                </Label>
              </div>
              <Select
                value={formData.seniorityLevel}
                onValueChange={(value) => handleChange("seniorityLevel", value)}
              >
                <SelectTrigger className="border-gray-300 focus:ring-black">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {SENIORITY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Label htmlFor="requiredExperience" className="font-medium">
                  Required Experience (years)
                </Label>
              </div>
              <Select
                value={formData.requiredExperience}
                onValueChange={(value) =>
                  handleChange("requiredExperience", value)
                }
              >
                <SelectTrigger className="border-gray-300 focus:ring-black">
                  <SelectValue placeholder="Select years" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year === "0"
                        ? "No experience"
                        : `${year} year${year === "1" ? "" : "s"}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <Label htmlFor="jobDescription" className="font-medium">
                Job Description
              </Label>
            </div>
            <Textarea
              id="jobDescription"
              placeholder="Describe the job responsibilities, requirements, and any specific skills needed..."
              value={formData.jobDescription}
              onChange={(e) => handleChange("jobDescription", e.target.value)}
              className="min-h-[120px] border-gray-300 focus-visible:ring-black"
            />
            <p className="text-xs text-gray-500 text-right">
              {formData.jobDescription.length}/500 characters
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Create Interview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
