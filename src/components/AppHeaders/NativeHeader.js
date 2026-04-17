import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '../../libs';
import { moderateScale } from 'react-native-size-matters';
import NativeText from '../AppTexts/NativeText';
import { useNavigation } from '@react-navigation/native';

function NativeHeader({
  title,
  back = false,
  style,
  showInfo = false,
  leftAlign = false,
  onPressInfo,
  isCenter = true,
}) {
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.headerContainer,
        isCenter && styles.headerCenter,
        leftAlign && styles.headerLeftAlign,
        style,
      ]}
    >
      {back ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={leftAlign ? styles.backButtonLeft : styles.backButton}
        >
          <View style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      ) : null}
      <NativeText style={[styles.title, leftAlign && styles.titleLeft]}>
        {title}
      </NativeText>
      {back && showInfo ? (
        <TouchableOpacity activeOpacity={0.7} style={leftAlign ? styles.infoButtonLeft : styles.infoButton} onPress={onPressInfo}>
          <View style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default NativeHeader;

const styles = StyleSheet.create({
  headerContainer: {
    // height: moderateScale(110),
    alignItems: 'center',
    flexDirection: 'row',
    gap: moderateScale(15),
    padding: moderateScale(10),
    justifyContent: 'center',
  },
  headerLeftAlign: {
    justifyContent: 'flex-start',
    paddingLeft: moderateScale(15),
  },
  title: {
    fontSize: moderateScale(19),
    fontFamily: Theme.fontFamily.poppinsSemiBold,
    color: Theme.colors.primary,
    textAlign: 'center',
  },
  titleLeft: {
    textAlign: 'left',
    marginLeft: moderateScale(10),
  },
  backButton: {
    top: moderateScale(13),
    position: 'absolute',
    left: moderateScale(15),
  },
  backButtonLeft: {
    // No absolute positioning for left-aligned header
  },
  infoButton: {
    top: moderateScale(13),
    position: 'absolute',
    right: moderateScale(15),
  },
  infoButtonLeft: {
    position: 'absolute',
    right: moderateScale(15),
  },
 
});
