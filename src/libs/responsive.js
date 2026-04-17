import { Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage as rf } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
export const normalized = { hp, wp };
export const normalizedFont = { rf };
const getResponsiveFontSize = (baseFontSize, windowWidth) => {
  const baseScreenWidth = 375;
  const widthRatio = windowWidth / baseScreenWidth;
  const responsiveFontSize = baseFontSize * widthRatio;
  return responsiveFontSize;
};
// export const AppFont = {
//   commonFont: {
//     extraExtraSmall: rf(1),
//     smallest: rf(1.5),
//     mediumSmall: rf(1.7),
//     small: rf(2),
//     lessMedium: rf(2.2),
//     medium: rf(2.5),
//     large: rf(3),
//     mediumLarge: rf(4),
//     extraLarge: rf(5),
//     custom48: rf(6)
//   },
// };

export const AppFont = {
  commonFont: {
    smallest: 12,  // Directly in pixels
    mediumSmall: 14,
    small: 16,     // 16 pixels
    lessMedium: 18,
    medium: 20,
    large: 24,
    mediumLarge: 28,
    extraLarge: 32,
  },
  splach: getResponsiveFontSize(34, width),
  h1: moderateScale(28),
  h2: moderateScale(26),
  h3: moderateScale(24),
  h4: moderateScale(20),
  h5: moderateScale(18),
  h6: moderateScale(16),
  t1: moderateScale(14),
  t2: moderateScale(13),
  t3: moderateScale(12),
  t4: moderateScale(10),
};
const Responsive = {
  width,
  height,
  getWidth: value => {
    let responsiveWidth = 0;
    responsiveWidth = width * (value / 100);
    return responsiveWidth;
  },
  getHeight: value => {
    let responsiveHeight = 0;
    responsiveHeight = height * (value / 100);
    return responsiveHeight;
  },
  AppFonts: {
    splach: getResponsiveFontSize(34, width),
    h1: moderateScale(28),
    h2: moderateScale(26),
    h3: moderateScale(24),
    h4: moderateScale(20),
    h5: moderateScale(18),
    h6: moderateScale(16),
    t1: moderateScale(14),
    t2: moderateScale(13),
    t3: moderateScale(12),
    t4: moderateScale(10),
  },
  sizeMatter: {
    scale: (value) => scale(value), // Width
    verticalScale: (value) => verticalScale(value), // Height
    moderateScale: (value) => moderateScale(value), // Text
  },
};

export default Responsive;
