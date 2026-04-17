import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Theme } from "../../../libs";
import { AppFont } from "../../../libs/responsive";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.darkNavy,
    padding: moderateScale(20),
    paddingBottom: moderateScale(16),
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(16),
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
  },

  title: {
    fontSize: AppFont.h4,
    fontFamily: Theme.fontFamily.poppinsSemiBold,
    color: Theme.colors.white,
  },

  addBtn: {
    padding: moderateScale(4),
  },

  tabRow: {
    flexDirection: "row",
    // backgroundColor: Theme.colors.LightWhite,
    borderRadius: moderateScale(30),
    padding: moderateScale(4),
    marginBottom: moderateScale(16),
    gap: moderateScale(10),
  },

  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: moderateScale(8),

    // borderRadius: moderateScale(30),
  },

  tabBtnActive: {
    backgroundColor: Theme.colors.AuraBlue,
    borderRadius: moderateScale(8),
  },

  tabLabel: {
    fontSize: AppFont.t1,
    fontFamily: Theme.fontFamily.poppinsMedium,
    color: Theme.colors.white,
  },

  tabLabelActive: {
    color: Theme.colors.white,
    fontFamily: Theme.fontFamily.poppinsSemiBold,
  },

  dateNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(12),
  },

  arrowBtn: {
    padding: moderateScale(8),
  },

  arrowLeft: {
  },

  dateLabel: {
    fontSize: AppFont.t1,
    fontFamily: Theme.fontFamily.poppinsSemiBold,
    color: Theme.colors.white,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  statsText: {
    fontSize: AppFont.t2,
    fontFamily: Theme.fontFamily.poppinsRegular,
    color: Theme.colors.white,
  },

  statsDot: {
    fontSize: AppFont.t2,
    color: Theme.colors.white,
  },
  tabBtnInactive: {
    backgroundColor: Theme.colors.LightWhite,
    borderRadius: moderateScale(8),
  },
});
