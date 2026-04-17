// NativeInputStyles.js
import { StyleSheet } from 'react-native';

import { Theme, Responsive } from '../../libs';
import { moderateScale } from 'react-native-size-matters';

const { AppFonts, getWidth, getHeight } = Responsive;
const { sizeMatter } = Responsive

const styles = StyleSheet.create({

  input: {
    padding: 0,
    margin: 0,
    // fontFamily: body.regular,
    minHeight: sizeMatter.moderateScale(45),
    flex: 1,
    color: Theme.colors.black,
    fontSize: AppFonts.t2,

  },
  errorText: {
    color: Theme.colors.error,
    marginLeft: getWidth(2),
    fontSize: moderateScale(10),
    fontFamily: Theme.fontFamily.poppinRegular,
    lineHeight: moderateScale(13),
  },
  errorTextSlot: {
    height: moderateScale(16),
    marginTop: 0,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: Theme.colors.border,
    borderWidth: sizeMatter.moderateScale(1),
    borderRadius: Theme.borders.miniMediumRadius,
    minHeight: sizeMatter.moderateScale(50),
    paddingHorizontal: sizeMatter.scale(12),
    backgroundColor: Theme.colors.white,

    width: "100%",
    // marginTop: moderateScale(2),
  },
  leftIcon: {
    marginRight: sizeMatter.scale(10),
  },
  inputLabel: {
    fontSize: moderateScale(12),
    fontFamily: Theme.fontFamily.poppinsMedium,
    color: Theme.colors.black,
    paddingHorizontal: moderateScale(4),
  }
});

export default styles;
