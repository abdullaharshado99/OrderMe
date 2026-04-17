import {TouchableOpacity, Platform, StyleSheet} from 'react-native';
import React from 'react';
import {AppIcons, Responsive, Theme} from '../../libs';
import { AppFont } from '../../libs/responsive';

const DeleteButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.CrossBtn} onPress={onPress}>
      <AppIcons.CrossIcon
        color={Theme.colors.white}
        size={AppFont.commonFont.lessMedium}
        disabled={true}
      />
    </TouchableOpacity>
  );
};

export default DeleteButton;
const {getWidth, AppFonts, getHeight} = Responsive;

const styles = StyleSheet.create({
  CrossBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.borders.halfRadius,
    position: 'absolute',
    top: getHeight(-1.5),
    right: getWidth(0),
    padding: getWidth(1),
  },
});
