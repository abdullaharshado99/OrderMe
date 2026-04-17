import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';

// Importing custom text components and responsive utilities
import HeadingText from './HeadingText';
import NativeText from './NativeText';
import Responsive, { normalized } from '../../libs/responsive';
import { Theme } from '../../libs';

const { getWidth, getHeight } = Responsive;

/**
 * ClickUpText Component
 * 
 * This component displays a prompt text alongside clickable text.
 * It can be used for linking to other screens, such as sign-in prompts or OTP-related actions.
 *
 * Props:
 * - promptTex: Text to be displayed as the prompt
 * - clickText: Text that is clickable and triggers an action
 * - onPress: Function to handle press events on the clickable text
 * - otpText: Boolean to control the layout, aligning text vertically if true
 */
function ClickUpText({ promptTex, clickText, onPress, otpText = false }) {
  return (
    <View style={[
      styles.ClickUpView,
      { flexDirection: otpText ? 'column' : 'row' } // Vertical layout for OTP text
    ]}>
      
      {/* Display the prompt text */}
      <NativeText style={styles.promptTextStyle}>
        {promptTex}
      </NativeText>
      
      {/* Clickable text with HeadingText styling */}
      <Pressable onPress={onPress}>
        <HeadingText
          body={clickText}
          headingStyle={[
            styles.clickTextStyle,
            otpText && { marginTop: getHeight(0.5) } // Margin for vertical alignment
          ]}
        />
      </Pressable>
      
    </View>
  );
}

export default ClickUpText;

/**
 * Styles
 * 
 * Styles for layout alignment and text color.
 */
const styles = StyleSheet.create({
  ClickUpView: {
    marginTop: normalized.hp('2'),
    marginBottom: normalized.hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptTextStyle: {
    color: Theme.colors.slatGray,
  },
  clickTextStyle: {
    textDecorationLine: 'underline',
  },
});
