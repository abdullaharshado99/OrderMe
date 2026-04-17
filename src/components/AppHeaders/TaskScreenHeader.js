import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import { Responsive, Theme } from "../../libs";
import { Routes } from "../../navigation/Routes";
import NativeText from "../AppTexts/NativeText";
import { AppFont } from "../../libs/responsive";


const TaskScreenHeader = ({ tasks = [] }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const android16 = Platform.Version > 34;

  const handlePress = () => {
    navigation.navigate(Routes.EditTaskScreen, { name: "add" });
  };

  const { urgentCount, todoCount, inProgressCount } = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    const urgentCountLocal = safeTasks.filter(
      (task) => `${task?.priority ?? ""}`.toLowerCase() === "urgent",
    ).length;

    const todoCountLocal = safeTasks.filter(
      (task) => `${task?.status ?? ""}`.toLowerCase() === "todo",
    ).length;

    const inProgressCountLocal = safeTasks.filter((task) => {
      const status = `${task?.status ?? ""}`.toLowerCase();
      return status === "inprogress" || status === "in_progress";
    }).length;

    return {
      urgentCount: urgentCountLocal,
      todoCount: todoCountLocal,
      inProgressCount: inProgressCountLocal,
    };
  }, [tasks]);

  return (
    <View style={styles.headerContainer}>
      <View
        style={[
          styles.topRow,
          {
            marginTop: android16
              ? moderateScale(30)
              : Platform.OS === "ios"
                ? moderateScale(40)
                : 0,
          },
        ]}
      >
        <View style={styles.profileContainer}>
          <View style={{ width: 40, height: 40 }} />
          <View>
            <NativeText value={"Tasks"} style={styles.welcomeText} />
          </View>
        </View>
        <Pressable style={styles.bellStyles} onPress={handlePress}>
          <View style={{ width: 24, height: 24 }} />
        </Pressable>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.card}>
          <NativeText style={styles.numberText} value={urgentCount} />
          <NativeText style={styles.cardText} value={"Urgent"} />
        </View>
        <View style={styles.card}>
          <NativeText style={styles.numberText} value={todoCount} />
          <NativeText style={styles.cardText} value={"To Do"} />
        </View>
        <View style={styles.card}>
          <NativeText style={styles.numberText} value={inProgressCount} />
          <NativeText style={styles.cardText} value={"In Progress"} />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(20),
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10)
    },
    profileImage: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(24),
        marginRight: moderateScale(12),
    },
    welcomeText: {
        color: Theme.colors.white,
        fontSize: AppFont.t1,
        fontFamily: Theme.fontFamily.poppinsSemiBold
    },
    userName: {
        color: '#fff',
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: moderateScale(10)
    },
    card: {
        backgroundColor: '#27314D',
        borderRadius: moderateScale(16),
        padding: moderateScale(10),
        marginHorizontal: moderateScale(4),
        // flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
        width: Responsive.width * 0.28,
        alignItems: "center",
        justifyContent: "center"
    },
    cardText: {
        color: Theme.colors.white,
        fontSize: Responsive.AppFonts.t2,
        // marginLeft: moderateScale(8),
        fontFamily: Theme.fontFamily.poppinsSemiBold,
        textAlign: "center"
    },
    bellStyles: {
        // backgroundColor: Theme.borderColor.lightestGray,
        // padding: moderateScale(16),
        borderRadius: moderateScale(50)
    },
    numberText: {
        fontSize: Responsive.AppFonts.h3,
        color: Theme.colors.white,
        fontFamily: Theme.fontFamily.poppinsSemiBold
    }
});

export default TaskScreenHeader;
