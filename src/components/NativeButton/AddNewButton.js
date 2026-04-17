import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';

import { AppIcons, Responsive, Theme } from '../../libs';
const { AppFonts, getHeight, getWidth } = Responsive;

const AddNewButton = ({ onPress, buttonTitle }) => {
  return (
    <View>
      <TouchableOpacity style={styles.NewGymWrapper} onPress={onPress}>
        <View style={styles.NewGymBtn}>
          <View style={styles.PlusIconBg}>
            <AppIcons.PlusIcon
              color={Theme.colors.black}
              size={Platform.isPad ? 27 : 17}
              disabled={true}
            />
          </View>
          <View style={styles.AddGymTextWrap}>
            <Text style={styles.AddGymText}>{buttonTitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AddNewButton;

const styles = StyleSheet.create({
  NewGymWrapper: {
    marginVertical: getHeight(1),
    // marginHorizontal: getWidth('4'),
    backgroundColor: Theme.colors.darkGray,
    borderRadius: Theme.borders.maxRadius,
    padding: getWidth(2),
    borderWidth: getWidth('0.3'),
    borderColor: Theme.colors.lightGray,
    borderStyle: 'dashed',
  },
  NewGymBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  PlusIconBg: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.white,
    padding: getWidth(2.5),
    borderRadius: Theme.borders.maxRadius,
  },
  AddGymTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: Responsive.AppFonts.t2,
  },
  AddGymText: {
    fontSize: Responsive.AppFonts.t2,
    fontFamily: Theme.fontFamily['Degular-Regular'],
    color: Theme.colors.white,
    marginLeft: getWidth(2),
    width: getWidth('60'),
  },
});
