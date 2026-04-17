import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppIcons, Theme} from '../../libs';
import NativeText from '../AppTexts/NativeText';
import HeadingText from '../AppTexts/HeadingText';
import {AppFont, normalized} from '../../libs/responsive';

const KeepMeLoggedInButton = ({
  onPress,
  isChecked,
  forgetPassword = false,
  termsAndPolicy = false,
  TermsButton,
  PrivacyPolicyButton,
  onpressForgotPassword,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonView}>
        {isChecked ? (
          <AppIcons.CheckBox
          size={AppFont.commonFont.medium}
            color={Theme.colors.raisinBlack}
            onPress={onPress}
          />
        ) : (
          <AppIcons.CheckBoxOutLine
          size={AppFont.commonFont.medium}
            color={Theme.colors.raisinBlack}
            onPress={onPress}
          />
        )}
        {termsAndPolicy ? (
          <Text
            style={[
              styles.termsandPolicyTextStyle,
              {color: Theme.colors.slatGray, textDecorationLine: 'none'},
            ]}>
            I agree to the {''}
            <Text style={styles.termsandPolicyTextStyle} onPress={TermsButton}>
              Terms
            </Text>{' '}
            and {''}
            <Text
              style={styles.termsandPolicyTextStyle}
              onPress={PrivacyPolicyButton}>
              Privacy Policy.
            </Text>
          </Text>
        ) : (
          <NativeText style={styles.textStyle}>Keep me logged in</NativeText>
        )}
      </View>
      {forgetPassword && (
        <Pressable onPress={onpressForgotPassword}>
          <HeadingText
            body="Forget Password?"
            headingStyle={[styles.textStyle, styles.forgetPasswordText]}
          />
        </Pressable>
      )}
    </View>
  );
};

export default KeepMeLoggedInButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: normalized.hp(0.5),
    paddingTop: normalized.hp('1.5'),
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    color: Theme.colors.raisinBlack,
    fontFamily:Theme.fontFamily['Degular-Regular'],
    fontSize:AppFont.commonFont.small
  },
  forgetPasswordText: {
    textDecorationLine: 'underline',
  },
  termsandPolicyTextStyle: {
    textDecorationLine: 'underline',
    color: Theme.colors.raisinBlack,
    fontSize:AppFont.commonFont.mediumSmall,
    fontFamily:Theme.fontFamily['Degular-Regular']

  },
});
