import { StyleSheet } from 'react-native';
import { AppFont } from '../../libs/responsive';
import { Theme } from '../../libs';

/**
 * Styles for text components.
 * 
 * This file defines reusable styles for text, including both standard and heading styles, with responsive font sizes and theme-based colors.
 */
const styles = StyleSheet.create({
  // Standard text style for general use
  textStyle: {
    fontSize: AppFont.commonFont.small,
    color: Theme.colors.darkBlue,
    fontFamily: Theme.fontFamily.poppinsRegular,
    includeFontPadding: false,
  },

  // Style for heading text, with slightly different font weight and color
  headingTextStyle: {
    fontSize: AppFont.commonFont.small,
    color: Theme.colors.raisinBlack,
    fontFamily: Theme.fontFamily['Degular-Semibold'],
  },

  // Wrapper for heading text components, aligns items in a row
  headingTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
