import { EndPoints } from "../../EndPoints";
import axiosInstance from "../client/axiosInstance";

export const profileServices = {
  editProfile: async (profileData) => {
    const { data } = await axiosInstance.put(EndPoints.editProfile, profileData);
    return data;
  }
}