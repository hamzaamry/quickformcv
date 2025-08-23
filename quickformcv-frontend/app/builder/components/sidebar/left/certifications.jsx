"use client";

import { useState } from "react";
import { FileBadge, Plus } from "lucide-react";
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
import CertificationsDialog from "../../dialogs/CertificationsDialog";
import { useResumeData } from "@/hooks/useResumeData";
import { useParams } from "next/navigation";

export default function Certification() {
  const params = useParams();
  const resumeId = params?.id;
  const {
    certificationItems,
    addSectionItem,
    updateSectionItem,
    deleteSectionItem,
  } = useResumeData(resumeId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCertification, setCurrentCertification] = useState(null);
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
      // This would require a reorderCertifications function in the hook
    }
  };

  const handleDelete = async (id) => {
    await deleteSectionItem("certifications", id);
  };

  const handleUpdate = (id) => {
    const certificationToUpdate = certificationItems.find(
      (item) => item.id === id,
    );
    if (certificationToUpdate) {
      setCurrentCertification(certificationToUpdate);
      setIsEditing(true);
      setDialogOpen(true);
    }
  };

  const handleSaveCertification = async (certificationData) => {
    if (isEditing && currentCertification) {
      await updateSectionItem(
        "certifications",
        currentCertification.id,
        certificationData,
      );
    } else {
      await addSectionItem("certifications", certificationData);
    }
    setDialogOpen(false);
    setIsEditing(false);
    setCurrentCertification(null);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentCertification(null);
    setDialogOpen(true);
  };

  return (
    <>
      <Accordion
        type="single"
        defaultValue="certifications"
        collapsible
        className="w-full"
      >
        <AccordionItem value="certifications" className="border-none">
          <AccordionTrigger className="hover:no-underline px-4 py-3">
            <div className="flex items-center gap-4">
              <FileBadge className="h-5 w-5" />
              <h2 className="text-primary-style font-medium text-base">
                Certifications
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
                    items={certificationItems.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="w-full">
                      {certificationItems.map((item, index) => (
                        <SortableListItem
                          key={item.id}
                          id={item.id}
                          title={item.name || item.title}
                          description={
                            item.issuer ||
                            item.description ||
                            `${item.month} ${item.year}`
                          }
                          isLast={index === certificationItems.length - 1}
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
                Add new Certification
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <CertificationsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveCertification}
        initialData={isEditing ? currentCertification : null}
        isEditing={isEditing}
      />
    </>
  );
}
