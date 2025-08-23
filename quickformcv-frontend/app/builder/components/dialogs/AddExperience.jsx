"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Input, Label, Switch } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//import { Sparkles } from "lucide-react";
import RichTextEditor from "@/components/shared/RichTextEditor";
import {
  CHARATERS_LIMIT,
  EMPLOYMENT_TYPES,
  MONTHS,
  WORK_TYPES,
  YEARS,
} from "../../constants/constants";

export default function AddExperience({
  open,
  onOpenChange,
  onSave,
  initialData,
  isEditing,
}) {
  const [formData, setFormData] = useState({
    title: "",
    employmentType: "Full-time",
    companyName: "",
    location: "",
    workType: "Hybrid",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    currentlyWorking: false,
    description: "",
  });

  const [openSelect, setOpenSelect] = useState("");

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        title: initialData.title || "",
        employmentType: initialData.employmentType || "Full-time",
        companyName: initialData.companyName || "",
        location: initialData.location || "",
        workType: initialData.workType || "Hybrid",
        startMonth: initialData.startMonth || "",
        startYear: initialData.startYear || "",
        endMonth: initialData.endMonth || "",
        endYear: initialData.endYear || "",
        currentlyWorking: initialData.currentlyWorking || false,
        description: initialData.description || "",
      });
    } else if (!initialData && open) {
      // Reset form when opening for a new entry
      setFormData({
        title: "",
        employmentType: "Full-time",
        companyName: "",
        location: "",
        workType: "Hybrid",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        currentlyWorking: false,
        description: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleSelectOpenChange = (selectId, isOpen) => {
    if (isOpen) {
      setOpenSelect(selectId);
    } else {
      setOpenSelect("");
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() &&
      formData.companyName.trim() &&
      formData.startMonth &&
      formData.startYear &&
      (formData.currentlyWorking || (formData.endMonth && formData.endYear))
    );
  };

  const handleSave = () => {
    if (!isFormValid()) {
      return;
    }

    // Format the data for the API
    const experienceData = {
      title: formData.title,
      companyName: formData.companyName,
      employmentType: formData.employmentType,
      location: formData.location,
      workType: formData.workType,
      startMonth: formData.startMonth,
      startYear: formData.startYear,
      endMonth: formData.currentlyWorking ? "" : formData.endMonth,
      endYear: formData.currentlyWorking ? "" : formData.endYear,
      currentlyWorking: formData.currentlyWorking,
      description: formData.description,
      dateRange: `${formData.startMonth} ${formData.startYear} - ${
        formData.currentlyWorking
          ? "Present"
          : `${formData.endMonth} ${formData.endYear}`
      }`,
    };

    if (isEditing && initialData) {
      experienceData.id = initialData.id;
    }

    onSave(experienceData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Update experience" : "Add a new experience"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Edit your experience details."
              : "Provide details about your experience."}
          </p>
        </DialogHeader>

        <div className="grid gap-2 py-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="ex: Senior Frontend Developer"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment type</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => handleChange("employmentType", value)}
                open={openSelect === "employmentType"}
                onOpenChange={(isOpen) =>
                  handleSelectOpenChange("employmentType", isOpen)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company name *</Label>
              <Input
                id="company"
                placeholder="ex: Google Inc."
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Work type</Label>
                <Select
                  value={formData.workType}
                  onValueChange={(value) => handleChange("workType", value)}
                  open={openSelect === "workType"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("workType", isOpen)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Tunis, Tunisia"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start date *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={formData.startMonth}
                  onValueChange={(value) => handleChange("startMonth", value)}
                  open={openSelect === "startMonth"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("startMonth", isOpen)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {MONTHS.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.startYear}
                  onValueChange={(value) => handleChange("startYear", value)}
                  open={openSelect === "startYear"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("startYear", isOpen)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>End date {!formData.currentlyWorking && "*"}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={formData.endMonth}
                  onValueChange={(value) => handleChange("endMonth", value)}
                  disabled={formData.currentlyWorking}
                  open={openSelect === "endMonth"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("endMonth", isOpen)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {MONTHS.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.endYear}
                  onValueChange={(value) => handleChange("endYear", value)}
                  disabled={formData.currentlyWorking}
                  open={openSelect === "endYear"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("endYear", isOpen)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="current-role"
              checked={formData.currentlyWorking}
              onCheckedChange={(checked) =>
                handleChange("currentlyWorking", checked)
              }
            />
            <Label htmlFor="current-role">
              I am currently working in this role
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <RichTextEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              maxLength={CHARATERS_LIMIT}
              placeholder="List your major duties and successes, highlighting specific projects"
            />
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <div className="flex justify-end gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {isEditing ? "Cancel" : "Discard"}
            </Button>
            <Button onClick={handleSave} disabled={!isFormValid()}>
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
