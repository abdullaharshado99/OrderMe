import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import styles from './NativeButtonStyles';
import { Theme } from '../../libs';
import AppLoader from '../AppLoader/Apploader';
import { AppFont } from '../../libs/responsive';
import NativeText from '../AppTexts/NativeText';

const NativeButton = ({
  onPress = () => { },
  title,
  title2,
  containerStyle = {},
  titleStyle = {},
  title2Style = {},
  disabled = false,
  LeftIcon,
  AlbumIcon,
  isPending = false,

  /* 🔹 GRADIENT PROPS */
  useGradient = false,
  gradientColors = [],
  gradientSide = 'full', // 'left' | 'right' | 'full'
}) => {

  const renderGradient = () => {
    if (!useGradient || gradientColors.length === 0) return null;

    if (gradientSide === 'full') {
      return null;
    }

    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.halfGradient,
          gradientSide === 'left'
            ? styles.leftGradient
            : styles.rightGradient,
        ]}
      />
    );
  };

  const buttonContent = (
    <View style={styles.titlswrap}>
      {LeftIcon && (
        <Image
          source={LeftIcon}
          style={styles.notificationBtn}
          resizeMode="contain"
        />
      )}
      {AlbumIcon && (
        <AlbumIcon
          color={Theme.colors.darkBlue}
          size={AppFont.commonFont.medium}
          disabled
        />
      )}

      {isPending ? (
        <AppLoader />
      ) : (
        <NativeText value={title} style={[styles.buttonText, titleStyle]} />
      )}

      {title2 && (
        <View style={styles.title2Wrap}>
          <Text style={[styles.buttonText, title2Style]}>{title2}</Text>
        </View>
      )}
    </View>
  );

  if (useGradient && gradientColors.length > 0 && gradientSide === 'full') {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, containerStyle]}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          disabled={disabled}
          style={styles.gradientInnerTouchable}
          onPress={onPress}
        >
          {buttonContent}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={disabled}
      style={[styles.button, containerStyle]}
      onPress={onPress}
    >
      <View style={styles.gradientContainer}>
        {renderGradient()}

        {buttonContent}
      </View>
    </TouchableOpacity>
  );
};

export default NativeButton;

NativeButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  title2: PropTypes.string,
  containerStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  title2Style: PropTypes.object,
  disabled: PropTypes.bool,
  LeftIcon: PropTypes.any,
  AlbumIcon: PropTypes.any,
  isPending: PropTypes.bool,

  useGradient: PropTypes.bool,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  gradientSide: PropTypes.oneOf(['left', 'right', 'full']),
};

NativeButton.defaultProps = {
  useGradient: false,
  gradientColors: [],
  gradientSide: 'full',
};
