"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useResumeData } from "@/hooks/useResumeData";
import { SKILLS } from "@/app/builder/constants/constants";
import { useParams } from "next/navigation";

export function SkillsDialog({ open, onOpenChange }) {
  const params = useParams();
  const resumeId = params?.id;
  const { skillItems, addSectionItem, deleteSectionItem } =
    useResumeData(resumeId);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Initialize selected skills from store
  useEffect(() => {
    if (open) {
      setSelectedSkills(skillItems);
    }
  }, [open, skillItems]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = SKILLS.filter(
        (skill) =>
          skill.skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedSkills.some((selected) => selected.skill === skill.skill),
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, selectedSkills]);

  const handleSelectSkill = (skillName) => {
    const skill = SKILLS.find((s) => s.skill === skillName);
    if (
      skill &&
      !selectedSkills.some((selected) => selected.skill === skill.skill)
    ) {
      setSelectedSkills((prev) => [...prev, { skill: skill.skill }]);
    }
    setSearchTerm("");
  };

  const handleAddCustomSkill = (skillName) => {
    const trimmedSkill = skillName.trim();
    if (trimmedSkill) {
      const customSkill = {
        skill: trimmedSkill,
      };
      if (!selectedSkills.some((selected) => selected.skill === trimmedSkill)) {
        setSelectedSkills((prev) => [...prev, customSkill]);
      }
    }
    setSearchTerm("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm) {
      e.preventDefault();

      // If there are suggestions, select the first one
      if (suggestions.length > 0) {
        handleSelectSkill(suggestions[0].skill);
      } else {
        // If no suggestions, add as custom skill
        handleAddCustomSkill(searchTerm);
      }
    }
  };

  const handleSave = async () => {
    // Auto-add any typed skill before saving
    if (searchTerm.trim()) {
      handleAddCustomSkill(searchTerm);
    }

    // Use the most current selectedSkills (including the one we just added)
    const finalSkills = searchTerm.trim()
      ? [...selectedSkills, { skill: searchTerm.trim() }].filter(
          (skill, index, arr) =>
            arr.findIndex((s) => s.skill === skill.skill) === index,
        )
      : selectedSkills;

    for (const skill of finalSkills) {
      if (
        !skillItems.some((existingSkill) => existingSkill.skill === skill.skill)
      ) {
        await addSectionItem("skills", { skill: skill.skill });
      }
    }
    handleDiscard();
  };

  const handleDiscard = () => {
    setSelectedSkills(skillItems);
    setSearchTerm("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add skills</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">List your skills!</p>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill.id || skill.skill}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {skill.skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type to search or press Enter to add skill..."
                className="w-full"
              />
              {suggestions.length > 0 && searchTerm && (
                <div className="absolute w-full mt-1 bg-white rounded-md border shadow-lg z-50">
                  <Command className="rounded-lg border shadow-md">
                    <CommandList>
                      <CommandGroup>
                        {suggestions.map((skill) => (
                          <CommandItem
                            key={skill.id}
                            value={skill.skill}
                            onSelect={handleSelectSkill}
                            className="cursor-pointer"
                          >
                            {skill.skill}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleDiscard}>
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={selectedSkills.length === 0 && !searchTerm.trim()}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
