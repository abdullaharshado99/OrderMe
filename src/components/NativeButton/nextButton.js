import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './NativeButtonStyles';
import { Theme } from '../../libs';
import AppLoader from '../AppLoader/Apploader';
import { AppFont } from '../../libs/responsive';
const NextButton = ({
  onPress = () => {},
  containerStyle

}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.button, containerStyle]}
      onPress={onPress}
    >
      <View style={{ width: 24, height: 24 }} />
    </TouchableOpacity>
  );
};

export default NextButton;

NextButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
};
