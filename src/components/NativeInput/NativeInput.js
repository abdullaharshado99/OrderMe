import React, { forwardRef } from 'react';
import { TextInput, View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Theme } from '../../libs';
import NativeText from '../AppTexts/NativeText';
import styles from './NativeInputStyle';
import { useIsFocused } from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';

const NativeInput = forwardRef(({
  ContainerStyle,
  isApply = true,
  label = '',           // new label prop
  labelStyle = {},      // new labelStyle prop
  title,
  onChangeText,
  placeholder,
  inputContainerStyle,
  inputStyle,
  placeholderTextColor = "#808080",
  value,
  keyboardType,
  autoFocus,
  blurOnSubmit,
  dataDetectorTypes,
  editable,
  enterKeyHint,
  focusable,
  keyboardAppearance,
  maxLength,
  multiline,
  onBlur,
  onEndEditing,
  onFocus,
  onSubmitEditing,
  returnKeyType,
  secureTextEntry,
  textAlignVertical,
  errorText,
  /** When true, keeps a fixed-height row under the field so errors don’t shift layout (use on login/signup). */
  reserveErrorSlot = false,
  leftComponent,
  rightComponent,
  scrollEnabled,
  isLeftIcon = true,
  isLink = false, // New prop to check if the input should be a link
}, ref) => {

  const focuse = useIsFocused();

  // Function to validate URL
  const validateURL = (input) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(input);
  };

  // Handle onChangeText validation if isLink is true
  const handleChange = (text) => {
    if (isLink && !validateURL(text)) {
      return; // Do nothing if the input is not a valid link
    }
    onChangeText(text); // Otherwise, update the state
  };

  return (
    <View style={[ContainerStyle]}>
      {/* Label above input */}
      {label !== '' && (
        <NativeText style={[styles.inputLabel, labelStyle]}>
          {label}
        </NativeText>
      )}

      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          errorText && { borderColor: "red" }, // border red if error
        ]}
      >
        {leftComponent && <View style={styles.leftIcon}>{leftComponent}</View>}
        {title && <NativeText style={styles.inputTitle}>{title}</NativeText>}

        <TextInput
          ref={ref}
          scrollEnabled={scrollEnabled}
          style={[styles.input, inputStyle, { }]}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          selectionColor={Theme.colors.inputSelection}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          blurOnSubmit={blurOnSubmit}
          dataDetectorTypes={dataDetectorTypes}
          editable={editable}
          enterKeyHint={enterKeyHint}
          focusable={focusable}
          keyboardAppearance={keyboardAppearance}
          maxLength={maxLength || 5000}
          multiline={multiline}
          onBlur={onBlur}
          onEndEditing={onEndEditing}
          onFocus={onFocus}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          textAlignVertical={textAlignVertical}
          autoCorrect={false}
          autoComplete="off"
          spellCheck={false}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        />

        {rightComponent && <View>{rightComponent}</View>}
      </View>

      {reserveErrorSlot ? (
        <View style={styles.errorTextSlot}>
          {errorText ? (
            <NativeText
              style={styles.errorText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {errorText}
            </NativeText>
          ) : null}
        </View>
      ) : (
        errorText ? (
          <NativeText style={[styles.errorText, { marginTop: moderateScale(4) }]}>
            {errorText}
          </NativeText>
        ) : null
      )}
    </View>
  );
});

NativeInput.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  inputStyle: PropTypes.object,
  inputContainerStyle: PropTypes.object,
  placeholderTextColor: PropTypes.string,
  value: PropTypes.string,
  keyboardType: PropTypes.string,
  autoFocus: PropTypes.bool,
  blurOnSubmit: PropTypes.bool,
  dataDetectorTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  editable: PropTypes.bool,
  enterKeyHint: PropTypes.string,
  focusable: PropTypes.bool,
  keyboardAppearance: PropTypes.string,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  onBlur: PropTypes.func,
  onEndEditing: PropTypes.func,
  onFocus: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  returnKeyType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  errorText: PropTypes.string,
  reserveErrorSlot: PropTypes.bool,
  leftComponent: PropTypes.element,
  rightComponent: PropTypes.element,
  isLeftIcon: PropTypes.bool,
  title: PropTypes.string,
  isLink: PropTypes.bool,
};

NativeInput.defaultProps = {
  label: '',
  labelStyle: {},
  placeholder: '',
  inputStyle: {},
  inputContainerStyle: {},
  placeholderTextColor: null,
  value: '',
  keyboardType: 'default',
  autoFocus: false,
  blurOnSubmit: true,
  dataDetectorTypes: 'none',
  editable: true,
  enterKeyHint: 'done',
  focusable: true,
  keyboardAppearance: 'default',
  maxLength: 5000,
  multiline: false,
  onBlur: () => { },
  onEndEditing: () => { },
  onFocus: () => { },
  onSubmitEditing: () => { },
  returnKeyType: 'done',
  secureTextEntry: false,
  textAlignVertical: 'auto',
  errorText: null,
  reserveErrorSlot: false,
  leftComponent: null,
  rightComponent: null,
  isLeftIcon: true,
  title: '',
  isLink: false,
};

export default NativeInput;
