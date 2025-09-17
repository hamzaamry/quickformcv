"use client"

import { GripVertical, MoreVertical, Eye, EyeOff } from "lucide-react";
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
import DOMPurify from "dompurify";

function truncateHTMLText(html, maxLength = 80) {
    if (!html) return "";
    const sanitized = DOMPurify.sanitize(html);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitized;
    const text = tempDiv.textContent || "";
    const cleanText = text.trim();

    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.slice(0, maxLength).trim() + "…";
}

const SortableListItem = ({
                              id,
                              isLast,
                              title,
                              description,
                              hidden = false,
                              onDelete,
                              onUpdate,
                              onToggleVisibility,
                              hideEdit = false,
                          }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const truncatedDescription = truncateHTMLText(description, 80);

    const handleToggleVisibility = () => {
        onToggleVisibility?.(id);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className={`relative flex items-center justify-between py-3 ${
                    hidden ? 'opacity-50' : ''
                }`}
            >
                {/* Drag Handle */}
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

                {/* Title & Truncated Description */}
                <div className="flex flex-col ml-12 max-w-[calc(100%-8rem)] overflow-hidden">
                    <div className="text-sm font-medium text-gray-700 truncate">
                        {title}
                    </div>
                    {truncatedDescription && (
                        <div className="text-sm text-gray-500">{truncatedDescription}</div>
                    )}
                </div>

                {/* Visibility Toggle & Dropdown Menu */}
                <div className="ml-auto mr-2 flex-shrink-0 flex items-center gap-1">
                    {/* Visibility Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={handleToggleVisibility}
                    >
                        {!hidden ? (
                            <Eye className="h-4 w-4 text-gray-600" />
                        ) : (
                            <EyeOff className="h-4 w-4 text-gray-600" />
                        )}
                    </Button>

                    {/* Dropdown Menu */}
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

            {/* Separator */}
            {!isLast && <Separator className="w-[calc(100%-2rem)] mx-auto" />}
        </>
    );
};

export default SortableListItem;