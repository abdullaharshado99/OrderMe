import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

import { Theme } from '../../libs';
import styles from './NativeImageStyle';
// import { devImage } from '../../utils/exports';

export default function NativeImage({
  onPress,
  containerStyle,
  disabled,
  source,
  imageStyles = {},
  resizeMode = ""
}) {
  const { buttonOpacity } = Theme;

  // ✅ Fix: Handle both local require(...) and remote string URLs
  const resolvedSource =
    typeof source === 'number' ? source : { uri: source };

  return (
    <TouchableOpacity
      // activeOpacity={buttonOpacity.opacity70}
      onPress={onPress}
      disabled={disabled}
      style={[styles.imageWrapper, containerStyle]}
    >
      <Image
        source={resolvedSource}
        style={[styles.image, { borderRadius: containerStyle?.borderRadius }, imageStyles]}
        resizeMode={resizeMode ? resizeMode : "cover"}
      />
    </TouchableOpacity>
  );
}

NativeImage.propTypes = {
  onPress: PropTypes.func,
  containerStyle: PropTypes.object,
  disabled: PropTypes.bool,
  source: PropTypes.oneOfType([
    PropTypes.number, // local require('./img.png')
    PropTypes.string, // remote URL
  ]),
};

// ✅ Default props
NativeImage.defaultProps = {
  disabled: false,
  onPress: () => null,
  containerStyle: {},
  // source: devImage,
};
