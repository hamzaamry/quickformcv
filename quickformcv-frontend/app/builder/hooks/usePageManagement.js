"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RESUME_SECTIONS } from "../constants/constants";
import { createNewPage, getAssignedSections } from "../utils/pageUtils";
import { resumeService } from "@/services/api/resume";
import { useParams } from "next/navigation";
import { debounce } from "lodash";

export const usePageManagement = () => {
  const params = useParams();
  const resumeId = params?.id;

  const [pages, setPages] = useState([
    {
      id: 1,
      name: "Page 1",
      sections: ["basics", "summary", "experience", "education"],
    },
  ]);
  const [activePageId, setActivePageId] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadPages = async () => {
      if (!resumeId) return;

      try {
        setIsLoading(true);
        const response = await resumeService.getPages(resumeId);

        if (response?.data?.pages?.length > 0) {
          setPages(response?.data?.pages);
          setActivePageId(
            response?.data?.activePageId || response?.data?.pages[0].id,
          );
        }
      } catch (error) {
        console.error("Failed to load pages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPages();
  }, [resumeId]);

  // Save pages to backend whenever pages change
  const savePages = useCallback(
    async (newPages, newActivePageId = activePageId) => {
      if (!resumeId || isLoading) return;

      try {
        setIsSaving(true);
        await resumeService.updatePages(resumeId, {
          pages: newPages,
          activePageId: newActivePageId,
        });
      } catch (error) {
        console.error("Failed to save pages:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [resumeId, activePageId, isLoading],
  );

  const debouncedSave = useMemo(
    () =>
      debounce((pages, activePageId) => savePages(pages, activePageId), 1000),
    [savePages],
  );

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId),
    [pages, activePageId],
  );

  const unassignedSections = useMemo(() => {
    const assignedSections = getAssignedSections(pages);
    return RESUME_SECTIONS.filter(
      (section) => !assignedSections.has(section.id),
    );
  }, [pages]);

  const addPage = useCallback(() => {
    const newPage = createNewPage(pages);
    const newPages = [...pages, newPage];
    setPages(newPages);
    setActivePageId(newPage.id);
    debouncedSave(newPages, newPage.id);
  }, [pages, debouncedSave]);

  const removePage = useCallback(
    (pageId) => {
      if (pages.length <= 1) return;

      setPages((prev) => {
        const updatedPages = prev.filter((p) => p.id !== pageId);
        const newActivePageId =
          activePageId === pageId ? updatedPages[0].id : activePageId;

        if (activePageId === pageId) {
          setActivePageId(newActivePageId);
        }

        debouncedSave(updatedPages, newActivePageId);
        return updatedPages;
      });
    },
    [pages.length, activePageId, debouncedSave],
  );

  const toggleSectionOnPage = useCallback(
    (pageId, sectionId) => {
      setPages((prevPages) => {
        const newPages = prevPages.map((page) => {
          if (page.id === pageId) {
            const hasSection = page.sections.includes(sectionId);
            return {
              ...page,
              sections: hasSection
                ? page.sections.filter((s) => s !== sectionId)
                : [...page.sections, sectionId],
            };
          }
          return {
            ...page,
            sections: page.sections.filter((s) => s !== sectionId),
          };
        });

        debouncedSave(newPages, activePageId);
        return newPages;
      });
    },
    [activePageId, debouncedSave],
  );

  const updateActivePageId = useCallback(
    (newActivePageId) => {
      setActivePageId(newActivePageId);
      debouncedSave(pages, newActivePageId);
    },
    [pages, debouncedSave],
  );

  return {
    pages,
    activePageId,
    activePage,
    unassignedSections,
    setActivePageId: updateActivePageId,
    addPage,
    removePage,
    toggleSectionOnPage,
    setPages,
    isLoading,
    isSaving,
  };
};
