import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "@/services/api/resume";
import { debounce } from "lodash";
import { useCallback, useMemo, useRef } from "react";
import { getTemplateByName, templates } from "@/app/builder/templates";

const resumeKeys = {
  single: (id) => ["resume", id],
};

// Main hook
export const useResumeData = (resumeId) => {
  const queryClient = useQueryClient();
  const debouncedUpdatesRef = useRef({});

  const {
    data: resumeResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: resumeKeys.single(resumeId),
    queryFn: () => resumeService.getById(resumeId),
    enabled: !!resumeId,
    staleTime: 0,
    refetchOnMount: true,
  });

  const resumeData = resumeResponse?.data || {};

  // Metadata getters
  const metadata = useMemo(
    () => resumeData?.metadata || {},
    [resumeData?.metadata],
  );
  const pageData = useMemo(() => metadata?.page || {}, [metadata?.page]);
  const themeData = useMemo(() => metadata?.theme || {}, [metadata?.theme]);
  const typographyData = useMemo(
    () => metadata?.typography || {},
    [metadata?.typography],
  );

  // Template data
  const templateName = metadata?.template || "colorcraft";
  const templateConfig = useMemo(
    () => getTemplateByName(templateName),
    [templateName],
  );

  const getSectionData = useCallback(
    (sectionType) => {
      const section = resumeData.sections?.find(
        (s) => s.section_type === sectionType,
      );
      return section?.section_data || {};
    },
    [resumeData.sections],
  );

  const updateCache = useCallback(
    (updateFn) => {
      queryClient.setQueryData(resumeKeys.single(resumeId), (oldData) => {
        if (!oldData) return oldData;
        return updateFn(oldData);
      });
    },
    [queryClient, resumeId],
  );

  const updateMutation = useMutation({
    mutationFn: async ({ type, data, sectionType, itemId }) => {
      switch (type) {
        case "basics":
          return resumeService.updateBasics(resumeId, data);
        case "summary":
          return resumeService.updateSummary(resumeId, data.content);
        case "metadata":
          return resumeService.updateMetadata(resumeId, data);
        case "addItem":
          return resumeService.addSectionItem(resumeId, sectionType, data);
        case "updateItem":
          return resumeService.updateSectionItem(
            resumeId,
            sectionType,
            itemId,
            data,
          );
        case "deleteItem":
          return resumeService.deleteSectionItem(resumeId, sectionType, itemId);
        default:
          throw new Error(`Unknown update type: ${type}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(resumeKeys.single(resumeId));
    },
    onError: (error) => {
      console.error("Update failed:", error);
      queryClient.invalidateQueries(resumeKeys.single(resumeId));
    },
  });

  const createDebouncedUpdate = useCallback((key, fn, delay = 800) => {
    if (!debouncedUpdatesRef.current[key]) {
      debouncedUpdatesRef.current[key] = debounce(fn, delay);
    }
    return debouncedUpdatesRef.current[key];
  }, []);

  const updateMetadata = useCallback(
    (updates) => {
      updateCache((oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          metadata: { ...oldData.data.metadata, ...updates },
        },
      }));

      const debouncedFn = createDebouncedUpdate(
        "metadata",
        (data) => {
          const currentData = queryClient.getQueryData(
            resumeKeys.single(resumeId),
          );
          const currentMetadata = currentData?.data?.metadata || {};
          const completeMetadata = { ...currentMetadata, ...data };
          updateMutation.mutate({ type: "metadata", data: completeMetadata });
        },
        800,
      );
      debouncedFn(updates);
    },
    [updateCache, createDebouncedUpdate, updateMutation, queryClient, resumeId],
  );

  const updatePage = useCallback(
    (pageUpdates) => {
      updateMetadata({
        page: { ...pageData, ...pageUpdates },
      });
    },
    [updateMetadata, pageData],
  );

  const updateTheme = useCallback(
    (themeUpdates) => {
      updateMetadata({
        theme: { ...themeData, ...themeUpdates },
      });
    },
    [updateMetadata, themeData],
  );

  const updateTypography = useCallback(
    (typographyUpdates) => {
      updateMetadata({
        typography: { ...typographyData, ...typographyUpdates },
      });
    },
    [updateMetadata, typographyData],
  );

  const changeTemplate = useCallback(
    async (newTemplateName) => {
      if (!resumeId || templateName === newTemplateName) return;

      try {
        const template = templates[newTemplateName];
        if (!template) {
          throw new Error(`Template "${newTemplateName}" not found`);
        }

        const currentMetadata = metadata || {};

        // Preserve user customizations, only apply template defaults for missing values
        const newMetadata = {
          ...template.defaultMetadata,
          ...currentMetadata,
          template: newTemplateName,
          layout: template.defaultMetadata?.layout || [],
        };

        // Use the synchronous mutation for template changes to ensure immediate update
        await updateMutation.mutateAsync({
          type: "metadata",
          data: newMetadata,
        });
      } catch (error) {
        console.error("Failed to change template:", error);
        throw error;
      }
    },
    [resumeId, templateName, metadata, updateMutation],
  );

  const updateBasics = useCallback(
    (newBasics) => {
      updateCache((oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          basics: { ...oldData.data.basics, ...newBasics },
        },
      }));

      const debouncedFn = createDebouncedUpdate("basics", (updates) => {
        // Get the current fresh data from React Query cache
        const currentData = queryClient.getQueryData(
          resumeKeys.single(resumeId),
        );
        const currentBasics = currentData?.data?.basics || {};
        const completeBasics = { ...currentBasics, ...updates };
        updateMutation.mutate({ type: "basics", data: completeBasics });
      });
      debouncedFn(newBasics);
    },
    [updateCache, createDebouncedUpdate, updateMutation, queryClient, resumeId],
  );

  const updateSummary = useCallback(
    (content) => {
      updateCache((oldData) => {
        const sections = oldData.data.sections || [];
        const updatedSections = sections.map((section) =>
          section.section_type === "summary"
            ? { ...section, section_data: { ...section.section_data, content } }
            : section,
        );

        return {
          ...oldData,
          data: { ...oldData.data, sections: updatedSections },
        };
      });

      const debouncedFn = createDebouncedUpdate(
        "summary",
        (data) => updateMutation.mutate({ type: "summary", data }),
        800,
      );
      debouncedFn({ content });
    },
    [updateCache, createDebouncedUpdate, updateMutation],
  );

  const aiSummaryMutation = useMutation({
    mutationFn: ({ resumeId, resumeData }) =>
      resumeService.getAISummarySuggestion(resumeId, resumeData),
  });

  const addSectionItem = useCallback(
    async (sectionType, itemData) => {
      return updateMutation.mutateAsync({
        type: "addItem",
        sectionType,
        data: itemData,
      });
    },
    [updateMutation],
  );

  const updateSectionItem = useCallback(
    async (sectionType, itemId, itemData) => {
      return updateMutation.mutateAsync({
        type: "updateItem",
        sectionType,
        itemId,
        data: itemData,
      });
    },
    [updateMutation],
  );

  const deleteSectionItem = useCallback(
    async (sectionType, itemId) => {
      return updateMutation.mutateAsync({
        type: "deleteItem",
        sectionType,
        itemId,
      });
    },
    [updateMutation],
  );

  return {
    resumeData,
    basics: resumeData.basics || {},
    sections: resumeData.sections || [],

    // Metadata
    metadata,
    page: pageData,
    theme: themeData,
    typography: typographyData,
    templateName,
    templateConfig,

    // Section-specific data getters
    getSectionData,
    summaryContent: getSectionData("summary").content || "",
    experienceItems: getSectionData("experiences").items || [],
    educationItems: getSectionData("education").items || [],
    skillItems: getSectionData("skills").items || [],
    certificationItems: getSectionData("certifications").items || [],
    socialItems: getSectionData("socials").items || [],
    languageItems: getSectionData("languages").items || [],

    // State
    isLoading,
    error,
    isUpdating: updateMutation.isPending,

    // Resume data operations
    updateBasics,
    updateSummary,
    addSectionItem,
    updateSectionItem,
    deleteSectionItem,

    // Metadata operations
    updateMetadata,
    updatePage,
    updateTheme,
    updateTypography,
    changeTemplate,
    getAISummarySuggestion: aiSummaryMutation.mutateAsync,
    isAILoading: aiSummaryMutation.isPending,
  };
};
