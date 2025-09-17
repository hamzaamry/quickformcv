"use client";

import { useState } from "react";
import { LanguagesIcon, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import SortableListItem from "../../SortableListItem";
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
import LanguagesDialog from "../../dialogs/LanguagesDialog";
import { useParams } from "next/navigation";
import { useResumeData } from "@/hooks/useResumeData";

export default function Languages() {
  const params = useParams();
  const resumeId = params?.id;
  const {
    languageItems,
    addSectionItem,
    updateSectionItem,
    deleteSectionItem,
    toggleItemVisibility,
  } = useResumeData(resumeId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(null);
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
      // This would require a reorderLanguages function in the hook
    }
  };

  const handleDelete = async (id) => {
    await deleteSectionItem("languages", id);
  };

  const handleUpdate = (id) => {
    const languageToUpdate = languageItems.find((item) => item.id === id);
    if (languageToUpdate) {
      setCurrentLanguage(languageToUpdate);
      setIsEditing(true);
      setDialogOpen(true);
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleItemVisibility("languages", id);
    } catch (error) {
      console.error("Failed to toggle language visibility:", error);
    }
  };

  const handleSaveLanguage = async (languageData) => {
    if (isEditing && currentLanguage) {
      await updateSectionItem("languages", currentLanguage.id, languageData);
    } else {
      await addSectionItem("languages", languageData);
    }
    setDialogOpen(false);
    setIsEditing(false);
    setCurrentLanguage(null);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentLanguage(null);
    setDialogOpen(true);
  };

  return (
      <>
        <Accordion
            type="single"
            defaultValue="languages"
            collapsible
            className="w-full"
        >
          <AccordionItem value="languages" className="border-none">
            <AccordionTrigger className="hover:no-underline px-4 py-3">
              <div className="flex items-center gap-4">
                <LanguagesIcon className="h-5 w-5" />
                <h2 className="text-primary-style font-medium text-base">
                  Languages
                </h2>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 space-y-4">
                <div className="rounded-lg bg-white shadow-sm overflow-hidden">
                  <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                  >
                    <SortableContext
                        items={languageItems.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                      <div className="w-full">
                        {languageItems.map((item, index) => (
                            <SortableListItem
                                key={item.id}
                                id={item.id}
                                title={item.language}
                                description={item.proficiency}
                                hidden={item?.hidden || false}
                                isLast={index === languageItems.length - 1}
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
                  Add new Language
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <LanguagesDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={handleSaveLanguage}
            initialData={isEditing ? currentLanguage : null}
            isEditing={isEditing}
        />
      </>
  );
}
