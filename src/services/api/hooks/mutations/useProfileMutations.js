import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileServices } from "../../services/profileServices";
import { queryKeys } from "../../config/queryKeys";

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileServices.editProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.profile, data);
    },
  });
};
