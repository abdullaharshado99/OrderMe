import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

// Importing images, and theme-related files
import { Theme } from '../../libs';
import { images } from '../../assets/images';
import combineStyle from '../../libs/combineStyle';
import Responsive from '../../libs/responsive';
import HapticFeedback from 'react-native-haptic-feedback';

// Importing custom text components
import NativeText from '../AppTexts/NativeText';
import HeadingText from '../AppTexts/HeadingText';

const { getWidth, getHeight } = Responsive;

/**
 * ChatHeader Component
 * 
 * This component renders a header with a back button, user avatar, heading label, and an optional right icon.
 * It is typically used in chat screens.
 *
 * Props:
 * - RightIcon: Optional icon component for additional actions (e.g., settings or menu)
 * - onPressRightIcon: Function to handle press events on the right icon
 * - navigation: Navigation prop for handling back button navigation
 * - headingLabel: Main title text to be displayed
 * - label: Subtitle text to be displayed below the main title
 */

// Define the haptic feedback options
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};


function ChatHeader({
  RightIcon,
  onPressRightIcon,
  navigation,
  headingLabel,
  label,
  groupImage
}) {
  
  return (
    <View style={combineStyle.headerContainer}>
      
      {/* Back Button and User Information Section */}
      <View style={styles.flexDWrap}>
        
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            HapticFeedback.trigger('soft', hapticOptions); // Trigger haptic feedback
            navigation.goBack();
          }}
        >
          <View style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        
        {/* User Avatar and Text Section */}
        <View style={[styles.flexDWrap, { paddingLeft: getWidth('3') }]}>
          {groupImage ? (
            <View style={styles.ImageWrap}>
            <Image style={styles.gridWhite} source={typeof groupImage === 'string' ? {uri:groupImage} : images.userAvatar } />
          </View>
          ) : (
            <View style={styles.ImageWrap}>
            <Image style={styles.gridWhite} source={images.userAvatar} />
          </View>
          )}
          <View>
            <HeadingText body={headingLabel} />
            <NativeText style={styles.labelStyle}>{label}</NativeText>
          </View>
        </View>
        
      </View>

      {/* Optional Right Icon */}
      {RightIcon && (
        <TouchableOpacity onPress={onPressRightIcon} style={[combineStyle.notificationBtn]}>
          <RightIcon
            size={AppFont.commonFont.large}
            color={Theme.colors.darkBlue}
            disabled
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ChatHeader;

/**
 * Styles
 * 
 * Styling for various elements within the ChatHeader component.
 * - headingStyle: Style for the main heading text (not used in JSX directly)
 * - ImageWrap: Styles for wrapping the user avatar image
 * - gridWhite: Styles for the avatar image, including borderRadius for rounded corners
 * - flexDWrap: Flexbox style for row direction and alignment center
 * - labelStyle: Style for the subtitle text below the main title
 */
const styles = StyleSheet.create({
  headingStyle: {
    color: '#35475A',
    fontSize: AppFont.commonFont.mediumSmall,
  },
  ImageWrap: {
    height: getHeight(5),
    width: getHeight(5),
    alignSelf: 'center',
    marginRight: getWidth('2'),
  },
  gridWhite: {
    flex: 1,
    height: undefined,
    width: undefined,
    borderRadius: Theme.borders.maxRadius,
  },
  flexDWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStyle: {
    color: Theme.colors.smokeyGray,
  },
});
