import { taskService } from "../../services/taskServices";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../config/queryKeys";

  export const useGetTasks = () => {
    return useQuery({
      queryKey: queryKeys.tasks.all,
      queryFn: () => taskService.getTasks(),
    });
  };


  export const useGetAiSuggestedTasks = () => {
    return useQuery({
      queryKey: queryKeys.tasks.aiSuggestions,
      queryFn: () => taskService.getAiSuggestedTasks(),
    });
  };