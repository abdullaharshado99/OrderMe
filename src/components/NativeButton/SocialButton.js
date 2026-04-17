import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Responsive, Theme} from '../../libs';
import { moderateScale } from 'react-native-size-matters';
import NativeText from '../AppTexts/NativeText';
const {getWidth,getHeight , AppFonts} = Responsive;

function SocialButton({title, onPress, Buttonstyle}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.ImageButtonstyle, Buttonstyle]}>
      <View style={styles.imageView} />
      <NativeText
        value={title}
        style={styles.socialButtonText}
      />
    </TouchableOpacity>
  );
}

export default SocialButton;

const styles = StyleSheet.create({
  ImageButtonstyle: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    borderColor: Theme.borderColor.GrayScale,
    borderWidth: 1,
    gap: moderateScale(10),
    height: moderateScale(50),
    alignItems: 'center',
    borderRadius:Theme.borders.halfRadius,
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    color: Theme.colors.black,
    fontSize: AppFonts.h5,
    fontFamily: Theme.fontFamily.poppinsSemiBold,
    includeFontPadding: false,
  },
});
