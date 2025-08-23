import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { conversationService } from "@/services/api/conversation";
import { useRouter } from "next/navigation";

// Shared query key creator
const conversationKeys = {
  all: ["clara-conversations"],
  single: (id) => ["clara-conversation", id],
  resumeExtract: (id) => ["clara-conversation", id, "resume-extract"],
};

// Hook to fetch all conversations
export const useConversations = (params = { skip: 0, limit: 20 }) => {
  return useQuery({
    queryKey: conversationKeys.all,
    queryFn: () => conversationService.getAll(params),
  });
};

// Hook to fetch a single conversation
export const useConversation = (conversationId) => {
  return useQuery({
    queryKey: conversationKeys.single(conversationId),
    queryFn: () => conversationService.getById(conversationId),
    enabled: !!conversationId,
    staleTime: Infinity, // Keep data fresh indefinitely
  });
};

// Hook to delete a conversation
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (conversationId) => conversationService.delete(conversationId),
    onSuccess: () => {
      // Invalidate and refetch the conversations list
      queryClient.invalidateQueries(conversationKeys.all);
      // Optionally redirect to conversations list
      router.push("/conversations");
    },
    onError: (error) => {
      console.error("Failed to delete conversation:", error);
    },
  });
};

// Hook to update conversation title
export const useUpdateConversationTitle = (conversationId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (titleData) =>
      conversationService.updateTitle(conversationId, titleData),
    onSuccess: (data) => {
      // Update the cache manually
      queryClient.setQueryData(
        conversationKeys.single(conversationId),
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            title: data.title,
            updated_at: data.updated_at,
          };
        },
      );

      // Invalidate the conversations list to refresh
      queryClient.invalidateQueries(conversationKeys.all);
    },
    onError: (error) => {
      console.error("Failed to update conversation title:", error);
    },
  });
};

// Hook to extract resume data from a conversation
export const useExtractResumeData = (conversationId) => {
  return useQuery({
    queryKey: conversationKeys.resumeExtract(conversationId),
    queryFn: () => conversationService.extractResumeData(conversationId),
    enabled: !!conversationId,
  });
};

// Hook to generate resume from a conversation
export const useGenerateResumeFromConversation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (conversationId) =>
      conversationService.generateResumeFromConversation(conversationId),
    onSuccess: (data) => {
      // Optionally redirect to the newly created resume
      if (data.resume_id) {
        router.push(`/resume/${data.resume_id}`);
      }
    },
    onError: (error) => {
      console.error("Failed to generate resume from conversation:", error);
    },
  });
};

// Hook for sending a chat message
export const useChatWithClara = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatData) => conversationService.chat(chatData),
    onSuccess: (response, variables) => {
      // If this is part of an existing conversation, invalidate its data
      if (variables.conversation_id) {
        queryClient.invalidateQueries(
          conversationKeys.single(variables.conversation_id),
        );
      } else {
        // If it's a new conversation, invalidate the conversations list
        queryClient.invalidateQueries(conversationKeys.all);
      }
    },
    onError: (error) => {
      console.error("Failed to send message to Clara:", error);
    },
  });
};
