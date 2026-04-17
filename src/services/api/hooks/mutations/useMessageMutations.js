import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../../services/messageService";
import { queryKeys } from "../../config/queryKeys";

export const useGetMessages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => messageService.getMessages(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.all });
    },
  });
};

export const useGetThreadsById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId }) => messageService.getThreadsById(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.all });
    },
  });
};

export const useMessageInsights = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text }) => messageService.getMessagesInsights({ text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.all });
    },
  });
};

export const useSendMessageToThread = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => messageService.sendMessage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.all });
    },
  });
};
