import React from 'react';
import { View, TouchableOpacity } from 'react-native';

// Importing styles, icons, and theme
import styles from './style';
import { Theme } from '../../libs';
import HapticFeedback from 'react-native-haptic-feedback';

// Importing custom text components
import HeadingText from '../AppTexts/HeadingText';
import NativeText from '../AppTexts/NativeText';

/**
 * AppHeader Component
 * 
 * This component renders a header with a title, subtitle, and two icons (Notification and Message).
 * The icons are wrapped in TouchableOpacity components to enable onPress actions.
 *
 * Props:
 * - onPress: Function to handle press events on the Message icon
 * - onPressBell: Function to handle press events on the Notification Bell icon
 * - headingLabel: Title text to be displayed in the header
 * - label: Subtitle text to be displayed under the title
 */

// Define the haptic feedback options
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

function AppHeader({ onPress, onPressBell, headingLabel, label }) {
  return (
    <View style={styles.homeHeaderContainer}>
      {/* Header text section with title and subtitle */}
      <View>
        <HeadingText
          body={headingLabel}
          headingStyle={styles.homeHeaderLabel}
        />
        <NativeText style={styles.labelStyle}>
          {label}
        </NativeText>
      </View>
      
      {/* Button section with Notification Bell and Message icons */}
      <View style={styles.btnWrap}>
        {/* Notification Bell Icon */}
        <TouchableOpacity
          onPress={() => {
            HapticFeedback.trigger('soft', hapticOptions); // Trigger haptic feedback
            onPressBell && onPressBell();
          }}
          style={styles.notificationBtn}
        >
          <View style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        
        {/* Message Icon */}
        <TouchableOpacity
          onPress={() => {
            HapticFeedback.trigger('soft', hapticOptions); // Trigger haptic feedback
            onPress && onPress();
          }}
          style={styles.notificationBtn}
        >
          <View style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AppHeader;
