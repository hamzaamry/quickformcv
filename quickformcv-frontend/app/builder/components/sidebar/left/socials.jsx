import { useState } from "react";
import { Globe, Plus } from "lucide-react";
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
import AddSocial from "../../dialogs/AddSocial";
import { useResumeData } from "@/hooks/useResumeData";
import { useParams } from "next/navigation";

export default function Socials() {
  const params = useParams();
  const resumeId = params?.id;
  const { socialItems, addSectionItem, updateSectionItem, deleteSectionItem } =
    useResumeData(resumeId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSocial, setCurrentSocial] = useState(null);
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
      // Handle reordering when implemented on the API
      // const oldIndex = socialItems.findIndex((item) => item.id === active.id);
      // const newIndex = socialItems.findIndex((item) => item.id === over.id);
    }
  };

  const handleDelete = async (id) => {
    await deleteSectionItem("socials", id);
  };

  const handleUpdate = (id) => {
    const socialToUpdate = socialItems.find((item) => item.id === id);
    if (socialToUpdate) {
      setCurrentSocial(socialToUpdate);
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  const handleSaveNewSocial = async (socialData) => {
    if (isEditing && currentSocial) {
      await updateSectionItem("socials", currentSocial.id, socialData);
    } else {
      await addSectionItem("socials", socialData);
    }
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentSocial(null);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentSocial(null);
    setIsDialogOpen(true);
  };

  return (
    <Accordion
      type="single"
      defaultValue="socials"
      collapsible
      className="w-full"
    >
      <AccordionItem value="socials" className="border-none">
        <AccordionTrigger className="hover:no-underline px-4 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Globe className="h-5 w-5" />
              <h2 className="text-primary-style font-medium text-base">
                Socials
              </h2>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-4 pb-4 space-y-4">
            <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext
                  items={(socialItems || []).map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {(socialItems || []).map((item, index) => (
                    <SortableListItem
                      key={item.id}
                      id={item.id}
                      title={item.network}
                      description={item.url}
                      isLast={index === socialItems.length - 1}
                      onDelete={() => handleDelete(item.id)}
                      onUpdate={() => handleUpdate(item.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
            <Button
              variant="ghost"
              className="h-10 flex items-center justify-start gap-2 text-[#6B6B6B]"
              onClick={handleAddNew}
            >
              <Plus className="h-4 w-4" />
              Add Social Link
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AddSocial
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveNewSocial}
        initialData={isEditing ? currentSocial : null}
        isEditing={isEditing}
      />
    </Accordion>
  );
}
