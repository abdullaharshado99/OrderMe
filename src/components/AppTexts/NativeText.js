import React from 'react';
import { Text } from 'react-native';
// import { useTranslation } from 'react-i18next';
import styles from './style';
import { Theme } from '../../libs';

function NativeText({
  style,
  children,
  numberOfLines,
  value,
  valueOptions,
  heading = false,
  ...props
}) {
  // const { t } = useTranslation();

  // const content =
  //   value !== undefined && value !== null ? t(`${value}`, valueOptions) : children;


  return (
    <Text
      style={[
        styles.textStyle,
        style,
        heading && { fontFamily: Theme.fontFamily.poppinsSemiBold },
      ]}
      numberOfLines={numberOfLines}
      {...props}
    >
      {value || children}
    </Text>
  );
}

export default NativeText;
