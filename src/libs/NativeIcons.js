/**
 * Placeholder “icons” — no vector/SVG libraries. Keeps touch targets and layout
 * without rendering pictograms. Replace with real assets later if needed.
 */
import React from 'react';
import { View, Pressable } from 'react-native';

function sizeBox(size) {
  return { width: size, height: size };
}

function StubIcon({ size = 24, style, ...rest }) {
  return <View style={[sizeBox(size), style]} {...rest} />;
}

function CrossIcon(props) {
  return <StubIcon {...props} />;
}

function PlusIcon(props) {
  return <StubIcon {...props} />;
}

function ArrowLeft(props) {
  return <StubIcon {...props} />;
}

function MessageIcon(props) {
  return <StubIcon {...props} />;
}

function CheckBox({ size = 20, onPress, style, ...rest }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} {...rest}>
      <View style={[sizeBox(size), style]} />
    </Pressable>
  );
}

function CheckBoxOutLine({ size = 20, onPress, style, ...rest }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} {...rest}>
      <View style={[sizeBox(size), style]} />
    </Pressable>
  );
}

export default {
  CrossIcon,
  PlusIcon,
  ArrowLeft,
  MessageIcon,
  CheckBox,
  CheckBoxOutLine,
};
