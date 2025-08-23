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

const PROFICIENCY_LEVELS = [
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Beginner",
  "Elementary",
];

export default function LanguagesDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
  isEditing,
}) {
  const [formData, setFormData] = useState({
    language: "",
    proficiency: "",
  });

  const [openSelect, setOpenSelect] = useState("");

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        language: initialData.language || "",
        proficiency: initialData.proficiency || "",
      });
    } else if (!open) {
      setFormData({
        language: "",
        proficiency: "",
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
    const languageData = {
      language: formData.language,
      proficiency: formData.proficiency,
    };
    onSave(languageData);
  };

  const isFormValid =
    formData.language.trim() !== "" && formData.proficiency !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Edit language" : "Add a new language"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Provide details about your language skills.
          </p>
        </DialogHeader>

        <div className="grid gap-2 py-1">
          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <Input
              id="language"
              placeholder="ex: English, Spanish, French"
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Proficiency Level *</Label>
            <div className="gap-2">
              <Select
                value={formData.proficiency}
                onValueChange={(value) => handleChange("proficiency", value)}
                open={openSelect === "proficiency"}
                onOpenChange={(isOpen) =>
                  handleSelectOpenChange("proficiency", isOpen)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {PROFICIENCY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
