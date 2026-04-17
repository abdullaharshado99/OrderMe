import React from 'react';
import { Text, View } from 'react-native';

// Importing styles and theme settings
import styles from './style';
import { Theme } from '../../libs';

/**
 * HeadingText Component
 * 
 * This component displays a heading text with an optional secondary text.
 * It is useful for titles or headings that require an additional subtitle or supporting text.
 *
 * Props:
 * - headingStyle: Custom style for the main heading text
 * - body: Main text to be displayed as the heading
 * - headingTextWrap: Custom style for the wrapper View
 * - style: Custom style for the secondary text (body2)
 * - body2: Secondary text to be displayed alongside the heading
 * - body2Color: Custom color for the secondary text
 * - numberOfLines: Limit the number of lines for the main heading text
 */
function HeadingText({ headingStyle, body, headingTextWrap, style, body2, body2Color, numberOfLines }) {
  return (
    <View style={[styles.headingTextWrap, headingTextWrap]}>
      
      {/* Main heading text */}
      <Text
        style={[styles.headingTextStyle, headingStyle]}
        numberOfLines={numberOfLines}
      >
        {body}
      </Text>
      
      {/* Secondary text (optional) */}
      <Text
        style={[
          styles.headingTextStyle,
          style,
          { color: body2Color || Theme.colors.plumPurple } // Default color if none provided
        ]}
      >
        {body2}
      </Text>
      
    </View>
  );
}

export default HeadingText;
