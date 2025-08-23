"use client";

import { useRouter } from "next/navigation";
import { Calendar, Edit, Loader2, MoreVertical, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ResumeDeleteConfirmation from "./Dialogs/ResumeDeleteConfirmation";
import { useDeleteResume } from "@/hooks/useResume";
import { templates } from "@/app/builder/templates";
import test from "./test.png";

export function ResumeCard({ id, title, lastEdited, templateName }) {
  const router = useRouter();
  const deleteResumeMutation = useDeleteResume();
  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    isDeleting: false,
  });
  const previewImage = useMemo(
    () => templates[templateName]?.image || test.src,
    [templateName],
  );

  const handleNavigation = useCallback(() => {
    if (!deleteState.isOpen && !deleteState.isDeleting) {
      router.push(`/builder/${id}`);
    }
  }, [id, deleteState.isOpen, deleteState.isDeleting, router]);

  const handleDelete = useCallback(async () => {
    setDeleteState((prev) => ({ ...prev, isDeleting: true }));
    try {
      await deleteResumeMutation.mutateAsync(id);
      setDeleteState({ isOpen: false, isDeleting: false });
    } catch (error) {
      console.error("Failed to delete resume:", error);
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
    }
  }, [id, deleteResumeMutation]);

  const handleDeleteDialog = useCallback((isOpen) => {
    setDeleteState((prev) => ({
      ...prev,
      isOpen,
      isDeleting: isOpen ? prev.isDeleting : false,
    }));
  }, []);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    setDeleteState({ isOpen: true, isDeleting: false });
  }, []);

  return (
    <div
      className="relative w-[140px] sm:w-[160px] h-64 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
      onClick={handleNavigation}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={previewImage}
          alt={`${title} - ${templateName || "Default"} template preview`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = test.src;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70" />
      </div>
      <div className="px-2 py-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-xs line-clamp-1 flex-1 mr-1">
            {title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/builder/${id}`);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Resume</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center text-xs text-gray-400 mt-0.5">
          <Calendar size={10} className="mr-1" />
          <span className="text-[10px] line-clamp-1">{lastEdited}</span>
        </div>
      </div>
      {(deleteState.isDeleting || deleteState.isOpen) && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 rounded-lg">
          {deleteState.isDeleting ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <div className="text-xs text-gray-500"></div>
          )}
        </div>
      )}

      <ResumeDeleteConfirmation
        open={deleteState.isOpen}
        onOpenChange={handleDeleteDialog}
        onDelete={handleDelete}
      />
      <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent transform -skew-x-12" />
    </div>
  );
}
