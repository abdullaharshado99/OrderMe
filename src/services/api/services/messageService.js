import { EndPoints } from "../../EndPoints";
import axiosInstance from "../client/axiosInstance";

export const messageService = {
  getMessages: async (params = {}) => {
    const { data } = await axiosInstance.get(EndPoints.getMessages, { params });
    return data;
  },
  getThreadsById: async (threadId) => {
    const { data } = await axiosInstance.get(
      EndPoints.getThreadsById(threadId),
    );
    return data;
  },
  getMessagesInsights: async ({ text }) => {
    const payload = {
      text,
    };
    const { data } = await axiosInstance.post(
      EndPoints.getMessagesInsights,
      payload,
    );
    return data;
  },
  sendMessage: async (payload = {}) => {
    const { data } = await axiosInstance.post(EndPoints.sendMessage, payload);
    return data;
  },
};
