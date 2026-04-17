import React from "react";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { Responsive, Theme } from "../../libs";
import { Routes } from "../../navigation/Routes";
import NativeText from "../AppTexts/NativeText";
import { dispatchUserLogout } from "../../redux/slices/userSlice";
import { setMailConnected, setSocialConnected } from "../../redux/slices/mailsSlice";
import { useLogout } from "../../services/api/hooks/mutations/useAuthMutations";
import { useTasksHook } from "../../hooks/TaskHook/useTasksHook";
import { useMessageHook } from "../../hooks/MessageHook/MessageHook";
const CockpitHeader = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { tasks: tasksData, taskLength, taskLoading, taskRefetch } = useTasksHook();
  const { messages: messagesData, messageLength, unreadMessagesLength, messageLoading, messageRefetch } = useMessageHook();
  const android16 = Platform.Version > 34;
  const user = useSelector((state) => state.userReducer?.user);

  const { mutate: logout } = useLogout();

  const handlePress = () => {
    navigation.navigate(Routes.NotificationsScreen);
  };

  // keep previous file behavior: wire logout cleanup here (even if UI doesn't call it yet)
  const performSessionClear = () => {
    dispatch(dispatchUserLogout());
    dispatch(setMailConnected(false));
    dispatch(setSocialConnected(false));
    queryClient.clear();
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: performSessionClear,
      onError: performSessionClear,
    });
  };

  return (
    <View style={styles.headerContainer}>
      <View
        style={[styles.topRow, { marginTop: android16 ? moderateScale(30) : 0 }]}
      >
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            style={styles.profileImage}
          />
          <View>
            <NativeText style={styles.welcomeText} value="Welcome" />
            <NativeText style={styles.userName} value={user?.name ?? ""} />
          </View>
        </View>

        <Pressable style={styles.bellStyles} onPress={handlePress}>
          <View style={{ width: moderateScale(24), height: moderateScale(24) }} />
        </Pressable>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.card}>
          <View style={{ width: moderateScale(24), height: moderateScale(24) }} />
          <NativeText style={styles.cardText} value={`${unreadMessagesLength} unread`} />
        </View>
        <View style={styles.card}>
          <View style={{ width: moderateScale(24), height: moderateScale(24) }} />
          <NativeText style={styles.cardText} value={`${taskLength} Tasks`} />
        </View>
        <View style={styles.card}>
          <View style={{ width: moderateScale(24), height: moderateScale(24) }} />
          <NativeText style={styles.cardText} value="3 meetings" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Theme.colors.darkNavy,
    padding: moderateScale(16),
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    marginRight: moderateScale(12),
  },
  welcomeText: {
    color: Theme.colors.white,
    fontSize: moderateScale(14),
  },
  userName: {
    color: Theme.colors.white,
    fontSize: moderateScale(18),
    fontFamily: Theme.fontFamily.poppinsSemiBold,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#27314D",
    borderRadius: moderateScale(16),
    padding: moderateScale(10),
    marginHorizontal: moderateScale(4),
    alignItems: "center",
    gap: moderateScale(10),
    width: Responsive.width * 0.28,
    justifyContent: "center",
  },
  cardText: {
    color: Theme.colors.white,
    fontSize: Responsive.AppFonts.t2,
    fontFamily: Theme.fontFamily.poppinsSemiBold,
    textAlign: "center",
  },
  bellStyles: {
    backgroundColor: Theme.borderColor.lightestGray,
    padding: moderateScale(16),
    borderRadius: moderateScale(50),
  },
});

export default CockpitHeader;
