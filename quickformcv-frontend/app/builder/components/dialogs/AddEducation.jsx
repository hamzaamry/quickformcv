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
import RichTextEditor from "@/components/shared/RichTextEditor";
import { CHARATERS_LIMIT, MONTHS, YEARS } from "../../constants/constants";

export default function AddEducation({
  open,
  onOpenChange,
  onSave,
  initialData,
  isEditing,
}) {
  const [formData, setFormData] = useState({
    studyType: "",
    institution: "",
    fieldOfStudy: "",
    location: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    currentlyStudying: false,
    description: "",
  });

  const [openSelect, setOpenSelect] = useState("");

  // Load initial data when editing
  useEffect(() => {
    if (initialData && open) {
      setFormData({
        studyType: initialData.studyType || "",
        institution: initialData.institution || "",
        fieldOfStudy: initialData.fieldOfStudy || "",
        location: initialData.location || "",
        startMonth: initialData.startMonth || "",
        startYear: initialData.startYear || "",
        endMonth: initialData.endMonth || "",
        endYear: initialData.endYear || "",
        currentlyStudying: initialData.currentlyStudying || false,
        description: initialData.description || "",
      });
    } else if (!initialData && open) {
      // Reset form when opening for a new entry
      setFormData({
        studyType: "",
        institution: "",
        fieldOfStudy: "",
        location: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        currentlyStudying: false,
        description: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      formData.institution.trim() !== "" &&
      formData.studyType.trim() !== "" &&
      formData.startYear.trim() !== "" &&
      (formData.currentlyStudying ||
        (formData.endYear.trim() !== "" &&
          new Date(
            formData.endYear,
            formData.endMonth ? MONTHS.indexOf(formData.endMonth) : 0,
          ) >=
            new Date(
              formData.startYear,
              formData.startMonth ? MONTHS.indexOf(formData.startMonth) : 0,
            )))
    );
  };

  const handleSave = () => {
    const educationData = {
      studyType: formData.studyType,
      institution: formData.institution,
      fieldOfStudy: formData.fieldOfStudy,
      location: formData.location,
      startMonth: formData.startMonth,
      startYear: formData.startYear,
      endMonth: formData.currentlyStudying ? "" : formData.endMonth,
      endYear: formData.currentlyStudying ? "" : formData.endYear,
      currentlyStudying: formData.currentlyStudying,
      description: formData.description,
    };

    // If we're editing, pass the id as well
    if (isEditing && initialData) {
      educationData.id = initialData.id;
    }

    onSave(educationData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Update education" : "Add a new education"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Edit your education details."
              : "Provide details about your educational background."}
          </p>
        </DialogHeader>
        <div className="grid gap-2 py-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                placeholder="ex: Stanford University"
                value={formData.institution}
                onChange={(e) => handleChange("institution", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studyType">Degree *</Label>
              <Input
                id="studyType"
                placeholder="e.g., Bachelor of Science, Master of Arts, PhD"
                value={formData.studyType}
                onChange={(e) => handleChange("studyType", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input
                id="fieldOfStudy"
                placeholder="ex: Computer Science"
                value={formData.fieldOfStudy}
                onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="ex: New York, NY"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  open={openSelect === "startMonth"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("startMonth", isOpen)
                  }
                  value={formData.startMonth}
                  onValueChange={(value) => handleChange("startMonth", value)}
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
                  open={openSelect === "startYear"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("startYear", isOpen)
                  }
                  value={formData.startYear}
                  onValueChange={(value) => handleChange("startYear", value)}
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
              <Label>End Date {formData.currentlyStudying ? "" : "*"}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  open={openSelect === "endMonth"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("endMonth", isOpen)
                  }
                  value={formData.endMonth}
                  onValueChange={(value) => handleChange("endMonth", value)}
                  disabled={formData.currentlyStudying}
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
                  open={openSelect === "endYear"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("endYear", isOpen)
                  }
                  value={formData.endYear}
                  onValueChange={(value) => handleChange("endYear", value)}
                  disabled={formData.currentlyStudying}
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
              checked={formData.currentlyStudying}
              onCheckedChange={(checked) =>
                handleChange("currentlyStudying", checked)
              }
            />
            <Label htmlFor="current-role">I am currently studying here</Label>
          </div>

          {/* Replace Textarea with RichTextEditor */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <RichTextEditor
              id="description"
              value={formData.description} // Pass the HTML string
              onChange={(content) => handleChange("description", content)} // Receive HTML string
              placeholder="Describe your academic achievements, relevant coursework, or research..."
              maxLength={CHARATERS_LIMIT} // Pass character limit if supported
            />
            {/* Optional: Character count - you might need to calculate text length from HTML if needed */}
            {/* <div className="text-xs text-muted-foreground text-right">
              {getTextLength(formData.description)}/{CHARATERS_LIMIT}
            </div> */}
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
