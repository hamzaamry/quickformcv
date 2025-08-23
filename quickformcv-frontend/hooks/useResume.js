import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "@/services/api/resume";

export const useResumes = () => {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: resumeService.getAll,
  });
};

export const useResume = (id) => {
  return useQuery({
    queryKey: ["resume", id],
    queryFn: () => resumeService.getById(id),
    enabled: !!id,
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resumeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["resumes"]);
    },
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resumeService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["resumes"]);
      queryClient.setQueryData(["resume", data.data.id], data);
      return data?.data?.id;
    },
  });
};
