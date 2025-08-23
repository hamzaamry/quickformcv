"use client";

import { useState } from "react";
import { BriefcaseBusiness, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import SortableListItem from "../../SortableListItem";
import AddExperience from "@/app/builder/components/dialogs/AddExperience";
import { useParams } from "next/navigation";
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

export default function Experience() {
  const params = useParams();
  const resumeId = params?.id;
  const {
    experienceItems,
    addSectionItem,
    updateSectionItem,
    deleteSectionItem,
  } = useResumeData(resumeId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
      // Handle reordering if needed
      // This would require a reorderExperiences function in the hook
    }
  };

  const handleDelete = async (id) => {
    await deleteSectionItem("experiences", id);
  };

  const handleUpdate = (id) => {
    const experienceToUpdate = experienceItems.find((item) => item.id === id);
    if (experienceToUpdate) {
      setCurrentExperience(experienceToUpdate);
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  const handleSaveExperience = async (experienceData) => {
    if (isEditing && currentExperience) {
      await updateSectionItem(
        "experiences",
        currentExperience.id,
        experienceData,
      );
    } else {
      await addSectionItem("experiences", experienceData);
    }
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentExperience(null);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentExperience(null);
    setIsDialogOpen(true);
  };

  return (
    <Accordion
      type="single"
      defaultValue="experiences"
      collapsible
      className="w-full"
    >
      <AccordionItem value="experiences" className="border-none">
        <AccordionTrigger className="hover:no-underline px-4 py-3">
          <div className="flex items-center gap-4">
            <BriefcaseBusiness className="h-5 w-5" />
            <h2 className="text-primary-style font-medium text-base">
              Experiences
            </h2>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-4 pb-4 space-y-4">
            <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext
                  items={experienceItems.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="w-full">
                    {experienceItems.map((item, index) => (
                      <SortableListItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        description={
                          item.company ||
                          item.description ||
                          `${item.startMonth} ${item.startYear} - ${
                            item.currentlyWorking
                              ? "Present"
                              : `${item.endMonth} ${item.endYear}`
                          }`
                        }
                        isLast={index === experienceItems.length - 1}
                        onDelete={() => handleDelete(item.id)}
                        onUpdate={() => handleUpdate(item.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
            <Button
              variant="ghost"
              className="h-10 flex items-center justify-start gap-2 text-[#6B6B6B]"
              onClick={handleAddNew}
            >
              <Plus className="h-4 w-4" />
              Add new experience
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AddExperience
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveExperience}
        initialData={isEditing ? currentExperience : null}
        isEditing={isEditing}
      />
    </Accordion>
  );
}
