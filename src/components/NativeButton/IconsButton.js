import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { Responsive, Theme } from '../../libs';
import { AppFont } from '../../libs/responsive';

const { getWidth } = Responsive;

const IconButton = ({ item, onPress,color,isfavorite }) => {
  
  const iconSource = item.label === 'Favorite' && isfavorite ? item.heartImage : item.image;

  return (
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
      <Image
        source={iconSource}
        style={styles.notificationBtn}
        resizeMode="contain"
        tintColor={color}
      />
      <Text style={[styles.label,{color:color}]}>{item?.label}</Text>
    </TouchableOpacity>
  );
};

export default IconButton;

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
