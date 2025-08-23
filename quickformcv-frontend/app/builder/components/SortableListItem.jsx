import { GripVertical, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableListItem = ({
  id,
  isLast,
  title,
  description,
  onDelete,
  onUpdate,
  hideEdit = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="relative flex items-center justify-between py-3"
      >
        <div className="absolute left-2">
          <Button
            variant="ghost"
            className="cursor-grab h-8 w-8 p-0 hover:bg-gray-100"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        <div className="flex flex-col ml-12 max-w-[calc(100%-5rem)] overflow-hidden">
          <div className="text-sm font-medium text-gray-700 truncate">
            {title}
          </div>
          {description && (
            <div className="text-sm text-gray-500 truncate">{description}</div>
          )}
        </div>

        <div className="ml-auto mr-2 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!hideEdit && (
                <DropdownMenuItem onClick={() => onUpdate?.(id)}>
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete?.(id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {!isLast && <Separator className="w-[calc(100%-2rem)] mx-auto" />}
    </>
  );
};

export default SortableListItem;
