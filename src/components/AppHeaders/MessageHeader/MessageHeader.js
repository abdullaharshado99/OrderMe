import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Theme } from "../../../libs";
import NativeText from "../../AppTexts/NativeText";
const MessageHeader = ({
  title = "Inbox",
  iconName = "email-outline",
  onIconPress,
  containerStyle = {},
}) => {
  return (
    <View style={[styles.safeArea, containerStyle, {paddingTop: Platform.OS === 'ios' ? moderateScale(50) : moderateScale(60),  }]}>
      <View style={styles.headerContainer}>
        {/* Circular Icon Container */}
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={onIconPress}
          disabled={!onIconPress}
        >
          <View style={{ width: 24, height: 24 }} />
        </TouchableOpacity>

        {/* Header Title */}
        <NativeText value={title} style={styles.headerTitle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Theme.colors.darkNavy,
    paddingBottom: moderateScale(20),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
    backgroundColor: Theme.colors.darkNavy,
  },
  iconCircle: {
    width: moderateScale(45),
    height: moderateScale(45),
    borderRadius: moderateScale(22.5),
    backgroundColor: "#FFFFFF", // White circle
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(15),
  },
  headerTitle: {
    fontSize: moderateScale(16),
    fontFamily: Theme.fontFamily.poppinsSemiBold,
    color: Theme.colors.white, // White text
  },
});

export default MessageHeader;
