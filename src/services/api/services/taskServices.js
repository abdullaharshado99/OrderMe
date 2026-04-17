import { EndPoints } from "../../EndPoints";
import axiosInstance from "../client/axiosInstance";

export const taskService = {
    getTasks: async () => {
        const {data} = await axiosInstance.get(EndPoints.getTasks);
        return data;
    },
    createTask: async (taskData) => {
        const {data} = await axiosInstance.post(EndPoints.createTask, taskData);
        return data;
    },
    getAiSuggestedTasks:async()=>{
        const {data} = await axiosInstance.get(EndPoints.getAiTasks);
        return data;
    },
    updateTask: async (taskId, updateData) => {
        const {data} = await axiosInstance.put(EndPoints.updateTask(taskId), updateData);
        return data;
    }

}