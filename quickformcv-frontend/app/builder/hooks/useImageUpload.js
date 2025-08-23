import { useMutation } from "@tanstack/react-query";
import { resumeService } from "@/services/api/resume";
import { useCallback } from "react";

export const useImageUpload = () => {
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
        );
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 5MB.");
      }

      const response = await resumeService.uploadImage(file);
      return response.data;
    },
    onError: (error) => {
      console.error("Image upload failed:", error);
    },
  });

  const uploadImage = useCallback(
    (file) => {
      return uploadMutation.mutateAsync(file);
    },
    [uploadMutation],
  );

  return {
    uploadImage,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    isSuccess: uploadMutation.isSuccess,
    reset: uploadMutation.reset,
  };
};
