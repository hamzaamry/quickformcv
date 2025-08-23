import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumeScanService } from "@/services/api/resumeScan";
import { useRouter } from "next/navigation";

const resumeScanKeys = {
  all: ["resume-scans"],
  single: (id) => ["resume-scan", id],
};

export const useResumeScans = () => {
  return useQuery({
    queryKey: resumeScanKeys.all,
    queryFn: resumeScanService.getAll,
  });
};

export const useResumeScan = (id) => {
  return useQuery({
    queryKey: resumeScanKeys.single(id),
    queryFn: () => resumeScanService.getById(id),
    enabled: !!id,
    staleTime: Infinity, // Keep data fresh indefinitely
  });
};

export const useUploadResumeScan = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (file) => resumeScanService.upload(file),
    onSuccess: (response) => {
      // Make sure we're getting the correct data structure from the API
      const data = response.data || response;
      const scanId = data.id;

      // Invalidate and refetch scans list
      queryClient.invalidateQueries({ queryKey: resumeScanKeys.all });

      // Optimistically add the new scan to the cache
      queryClient.setQueryData(resumeScanKeys.single(scanId), data);
    },
    onError: (error) => {
      console.error("Failed to upload resume scan:", error);
      // You might want to add toast notification here
    },
  });
};

export const useDeleteResumeScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => resumeScanService.delete(id),
    onSuccess: (_, id) => {
      // Remove from scans list
      queryClient.invalidateQueries({ queryKey: resumeScanKeys.all });

      // Remove individual scan cache
      queryClient.removeQueries({ queryKey: resumeScanKeys.single(id) });
    },
    onError: (error) => {
      console.error("Failed to delete resume scan:", error);
    },
  });
};
