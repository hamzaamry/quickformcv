"use client";

import { useState } from "react";
import { Plus, Target } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import SortableListItem from "../../SortableListItem";
import { SkillsDialog } from "../../dialogs/skillsDialog";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useResumeData } from "@/hooks/useResumeData";
import { useParams } from "next/navigation";

export default function Skills() {
  const params = useParams();
  const resumeId = params?.id;
  const { skillItems, deleteSectionItem, toggleItemVisibility } = useResumeData(resumeId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      // We're keeping drag-and-drop visual ordering functionality
      // currently ordering the skills should remain static
    }
  };

  const handleDelete = async (id) => {
    await deleteSectionItem("skills", id);
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleItemVisibility("skills", id);
    } catch (error) {
      console.error("Failed to toggle skill visibility:", error);
    }
  };

  return (
      <>
        <Accordion
            type="single"
            defaultValue="skills"
            collapsible
            className="w-full"
        >
          <AccordionItem value="skills" className="border-none">
            <AccordionTrigger className="hover:no-underline px-4 py-3">
              <div className="flex items-center gap-4">
                <Target className="h-5 w-5" />
                <h2 className="text-primary-style font-medium text-base">
                  Skills
                </h2>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 space-y-4">
                <div className="rounded-lg bg-white shadow-sm">
                  <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                  >
                    <SortableContext
                        items={skillItems.map((skill) => skill.id)}
                        strategy={verticalListSortingStrategy}
                    >
                      {skillItems.map((skill, index) => (
                          <SortableListItem
                              key={skill.id}
                              id={skill.id}
                              title={skill.skill}
                              hidden={skill?.hidden || false}
                              isLast={index === skillItems.length - 1}
                              onDelete={() => handleDelete(skill.id)}
                              onToggleVisibility={() => handleToggleVisibility(skill.id)}
                              hideEdit={true}
                          />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
                <Button
                    variant="ghost"
                    className="h-10 flex items-center justify-start gap-2 text-[#6B6B6B]"
                    onClick={() => setDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add new Skill
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <SkillsDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </>
  );
}
