import api from "./axiosConfig";

export const resumeService = {
  create: (data) => api.post("/resumes", data),
  getAll: () => api.get("/resumes"),
  getById: (id) => api.get(`/resumes/${id}`),
  updateMetadata: (id, metadata) =>
    api.patch(`/resumes/${id}/metadata`, metadata),
  updateBasics: (id, basics) => api.patch(`/resumes/${id}/basics`, basics),
  updateSummary: (id, content) =>
    api.post(`/resumes/${id}/summary`, { content }),
  addSectionItem: (resumeId, sectionType, itemData) =>
    api.post(`/resumes/${resumeId}/sections/${sectionType}/items`, itemData),
  updateSectionItem: (resumeId, sectionType, itemId, itemData) =>
    api.put(
      `/resumes/${resumeId}/sections/${sectionType}/items/${itemId}`,
      itemData,
    ),
  updatePages: (id, pages) => api.patch(`/resumes/${id}/pages`, pages),
  getPages: (id) => api.get(`/resumes/${id}/pages`),
  delete: (id) => api.delete(`/resumes/${id}`),
  deleteSectionItem: (resumeId, sectionType, itemId) =>
    api.delete(`/resumes/${resumeId}/sections/${sectionType}/items/${itemId}`),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/resumes/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAISummarySuggestion: (resumeId, resumeData) =>
    api.post(`/resumes/ai/suggest-summary`, { resume_data: resumeData }),
};
