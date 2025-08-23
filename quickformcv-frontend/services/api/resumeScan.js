import api from "./axiosConfig";

export const resumeScanService = {
  getAll: () => api.get("/resume-scan"),
  getById: (id) => api.get(`/resume-scan/${id}`),
  upload: (file) => {
    const formData = new FormData();
    formData.append("resume_file", file);
    return api.post("/resume-scan/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
