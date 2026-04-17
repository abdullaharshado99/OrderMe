import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { Responsive, Theme } from '../../libs';
import { AppFont } from '../../libs/responsive';

const { getWidth } = Responsive;

const FavoriteIconBtn = ({ item, onPress,color }) => {


  return (
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
      <Image
        source={item?.image}
        style={styles.notificationBtn}
        resizeMode="contain"
        tintColor={color}
      />
      <Text style={[styles.label,{color:color}]}>{item?.label}</Text>
    </TouchableOpacity>
  );
};

export default FavoriteIconBtn;

const styles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
  },
  label: {
    color: '#fff', // Set label color
    fontSize: AppFont.commonFont.smallest,
    fontFamily: Theme.fontFamily['Degular-Regular']
  },
  notificationBtn: {
    height: getWidth('5'),
    width: getWidth('5'),
  },
});
