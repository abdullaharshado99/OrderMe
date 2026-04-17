import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { useTranslation } from 'react-i18next';
import getStyles from './Style';
import { Routes } from '../../navigation/Routes';
const CustomHeader = ({
  title,
  onBackPress,
  back = false,
  white = true, // ✅ new prop
  style = {},
  textStyle = {},
  backgroundColor,

}) => {
  const navigation = useNavigation();
  const styles = getStyles();
  // const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        style,
        backgroundColor && { backgroundColor },
      ]}
    >
      {/* Left section - Back button or empty space for balance */}
      <View style={styles.leftSection}>
        {back && (
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{ name: Routes.BOTTOMSTACK }],
                });
              }
            }}
            style={styles.backButton}
          >
            <View style={{ width: 24, height: 24 }} />
          </TouchableOpacity>

        )}
      </View>

      {/* Center section - Title */}
      <View style={styles.centerSection}>
        <Text style={[white ? styles.title : styles.title2, textStyle]}>{title}</Text>
      </View>

      {/* Right section - Empty space for balance */}
      <View style={styles.rightSection} />
    </View>
  );
};

export default CustomHeader;
