"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { CHARATERS_LIMIT, MONTHS, YEARS } from "../../constants/constants";

export default function CertificationsDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
  isEditing,
}) {
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    website: "",
    month: "",
    year: "",
    description: "",
  });

  const [openSelect, setOpenSelect] = useState("");

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        name: initialData.name || initialData.title || "",
        issuer: initialData.issuer || "",
        website: initialData.website || "",
        month: initialData.month || "",
        year: initialData.year || "",
        description: initialData.description || "",
      });
    } else if (!open) {
      setFormData({
        name: "",
        issuer: "",
        website: "",
        month: "",
        year: "",
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

  const handleSave = () => {
    const certificationData = {
      ...formData,
      title: formData.name,
    };
    onSave(certificationData);
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.month !== "" &&
    formData.year !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Edit certification" : "Add a new certification"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Provide details about your certification.
          </p>
        </DialogHeader>

        <div className="grid gap-2 py-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="ex: AWS Certified Solutions Architect"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Input
                id="issuer"
                placeholder="ex: Amazon Web Services"
                value={formData.issuer}
                onChange={(e) => handleChange("issuer", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="ex: https://aws.amazon.com/certification/  "
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Month *</Label>
              <div className="gap-2">
                <Select
                  value={formData.month}
                  onValueChange={(value) => handleChange("month", value)}
                  open={openSelect === "month"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("month", isOpen)
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
              </div>
            </div>
            <div className="space-y-2">
              <Label>Year *</Label>
              <div className="gap-2">
                <Select
                  value={formData.year}
                  onValueChange={(value) => handleChange("year", value)}
                  open={openSelect === "year"}
                  onOpenChange={(isOpen) =>
                    handleSelectOpenChange("year", isOpen)
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <RichTextEditor
              id="description"
              value={formData.description}
              onChange={(content) => handleChange("description", content)}
              placeholder="Describe the certification, skills acquired, or relevant achievements..."
              maxLength={CHARATERS_LIMIT}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Discard
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
