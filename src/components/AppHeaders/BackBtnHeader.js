import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};


function BackBtnHeader() {
  const navigation = useNavigation();

  return (
    <View style={[
      styles.settingContainer,
    ]}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        activeOpacity={0.7}
        style={styles.backBtn}>
        <View style={{ width: 40, height: 40 }} />
      </TouchableOpacity>
    </View>
  );
}

export default BackBtnHeader;
