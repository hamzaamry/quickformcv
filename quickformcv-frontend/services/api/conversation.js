import api from "./axiosConfig";

export const conversationService = {
  // Chat with Clara
  chat: (data) => api.post("/ai/clara/chat", data),

  // Get all conversations
  getAll: (params = { skip: 0, limit: 20 }) =>
    api.get("/ai/clara/conversations", { params }),

  // Get a specific conversation by ID
  getById: (conversationId) =>
    api.get(`/ai/clara/conversations/${conversationId}`),

  // Update conversation title
  updateTitle: (conversationId, data) =>
    api.patch(`/ai/clara/conversations/${conversationId}`, data),

  // Delete a conversation
  delete: (conversationId) =>
    api.delete(`/ai/clara/conversations/${conversationId}`),

  // Extract resume data from a conversation
  extractResumeData: (conversationId) =>
    api.get(`/ai/clara/conversations/${conversationId}/extract-resume`),

  // Generate a resume from a conversation
  generateResumeFromConversation: (conversationId) =>
    api.post(`/ai/clara/conversation/${conversationId}/to-resume`),
};
