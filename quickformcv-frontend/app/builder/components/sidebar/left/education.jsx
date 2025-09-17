"use client";

import { useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import SortableListItem from "../../SortableListItem";
import AddEducation from "@/app/builder/components/dialogs/AddEducation";
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

export default function Education() {
  const params = useParams();
  const resumeId = params?.id;
  const {
    educationItems,
    addSectionItem,
    updateSectionItem,
    deleteSectionItem,
    toggleItemVisibility,
  } = useResumeData(resumeId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState(null);
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
      // This would require a reorderEducations function in the hook
    }
  };

  const handleDelete = async (id) => {
    await deleteSectionItem("education", id);
  };

  const handleUpdate = (id) => {
    const educationToUpdate = educationItems.find((item) => item.id === id);
    if (educationToUpdate) {
      setCurrentEducation(educationToUpdate);
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleItemVisibility("education", id);
    } catch (error) {
      console.error("Failed to toggle education visibility:", error);
    }
  };

  const handleSaveEducation = async (educationData) => {
    if (isEditing && currentEducation) {
      await updateSectionItem("education", currentEducation.id, educationData);
    } else {
      await addSectionItem("education", educationData);
    }
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentEducation(null);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentEducation(null);
    setIsDialogOpen(true);
  };

  return (
      <>
        <Accordion
            type="single"
            defaultValue="education"
            collapsible
            className="w-full"
        >
          <AccordionItem value="education" className="border-none">
            <AccordionTrigger className="hover:no-underline px-4 py-3">
              <div className="flex items-center gap-4">
                <GraduationCap className="h-5 w-5" />
                <h2 className="text-primary-style font-medium text-base">
                  Education
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
                        items={educationItems.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                      <div className="w-full">
                        {educationItems.map((item, index) => (
                            <SortableListItem
                                key={item.id}
                                id={item.id}
                                title={item.institution}
                                description={
                                    item.fieldOfStudy ||
                                    item.description ||
                                    `${item.startMonth} ${item.startYear} - ${
                                        item.currentlyStudying
                                            ? "Present"
                                            : `${item.endMonth} ${item.endYear}`
                                    }`
                                }
                                hidden={item?.hidden || false}
                                isLast={index === educationItems.length - 1}
                                onDelete={() => handleDelete(item.id)}
                                onUpdate={() => handleUpdate(item.id)}
                                onToggleVisibility={() => handleToggleVisibility(item.id)}
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
                  Add new Education
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <AddEducation
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSave={handleSaveEducation}
            initialData={isEditing ? currentEducation : null}
            isEditing={isEditing}
        />
      </>
  );
}
