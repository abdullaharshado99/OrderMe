import React, { useState } from 'react';
import { TextInput, Text, View, Alert } from 'react-native';

import PropTypes from 'prop-types';

import { Theme } from '../../libs';
import styles from './NativeRightIconInputStyle';
import NativeText from '../AppTexts/NativeText';
import { AppFont } from '../../libs/responsive';
import toastUtils from '../../utils/toastUtil';

const NativeRightIconInput = ({
  onChangeText,
  placeholder = '',
  inputStyle = {},
  placeholderTextColor = 'gray',
  value = '',
  keyboardType = 'default',
  autoFocus = false,
  ref = null,
  blurOnSubmit = true,
  dataDetectorTypes = 'none',
  editable = true,
  enterKeyHint = 'done',
  focusable = true,
  keyboardAppearance = 'default',
  maxLength = 200,
  multiline = false,
  onBlur = () => { },
  onEndEditing = () => { },
  onFocus = () => { },
  onSubmitEditing = () => { },
  returnKeyType = 'done',
  secureTextEntry = false,
  textAlignVertical = 'auto',
  errorText = null,
  inputContainerStyle,
  rightIcon: RightIcon,
  rightIconIconColor,
  leftIcon: LeftIcon,
  leftIconColor,
  onRightIconPress = () => { },
  bottomView,
  onPressLeftIcon = () =>{},
  perHoureText,
  setFunc=()=>{ }
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  

  const handleFocus = () => {
    setIsFocused(true);
    onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
  };

  const handleChangeText = text => {
    setInputValue(text);
    onChangeText(text);
  };

  const handleSubmitEditing = () => {
    setFunc(prevItems => {
      if (prevItems.length >= 3) {
        setInputValue('');
        toastUtils.showError("You can add only three skills.")
        return prevItems;
      }
      if (inputValue.trim() !== '') {
        const newSkill = {
          id: Date.now().toString(),
          tag: inputValue.trim(),
        };
        setInputValue('');
        return [...prevItems, newSkill];
      }
      
      return prevItems;
    });
  
    onSubmitEditing();
  };

  return (
    <>
      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          {
            borderColor: isFocused || inputValue
              ? Theme.colors.darkBlue
              : Theme.colors.lightMist,
          },
        ]}>
        <View style={styles.leftContainer}>
          {LeftIcon && (
            <LeftIcon
              size={AppFont.commonFont.medium}
              color={
                isFocused || inputValue
                  ? Theme.colors.darkBlue
                  : leftIconColor || Theme.colors.coolGray
              }
              onPress={onPressLeftIcon}
            />
          )}
          <TextInput

            style={[styles.input, inputStyle, { paddingLeft: LeftIcon && 10 }]}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            value={value}
            keyboardType={keyboardType}
            autoFocus={autoFocus}
            ref={ref}
            blurOnSubmit={blurOnSubmit}
            dataDetectorTypes={dataDetectorTypes}
            editable={editable}
            enterKeyHint={enterKeyHint}
            focusable={focusable}
            keyboardAppearance={keyboardAppearance}
            maxLength={maxLength}
            multiline={multiline}
            onBlur={handleBlur}
            onEndEditing={onEndEditing}
            onFocus={handleFocus}
            onSubmitEditing={ handleSubmitEditing}
            returnKeyType={returnKeyType}
            secureTextEntry={secureTextEntry}
            textAlignVertical={textAlignVertical}
          />
        </View>
        {RightIcon && (
          <RightIcon
            size={AppFont.commonFont.lessMedium}
            color={
              isFocused || inputValue
                ? Theme.colors.darkBlue
                : rightIconIconColor || Theme.colors.coolGray
            }
            onPress={onRightIconPress}
          />
        )}
        {bottomView && (
          <View style={styles.bottomViewWrap}>
            <NativeText style={styles.counterTxt}> {inputValue.length}/{maxLength}</NativeText>
            {/* <BottomIcon
              size={AppFont.commonFont.small}
              color={Theme.colors.coolGray}
              onPress={() => { }}
            /> */}
          </View>
        )}
        {perHoureText && (
          <View style={[styles.perHourWrap,{ borderLeftWidth: 1, borderLeftColor: Theme.colors.coolGray,}]}>
            <NativeText style={styles.perHoureText}>per month</NativeText>
          </View>
        )}
      </View>
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </>
  );
};

NativeRightIconInput.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  inputStyle: PropTypes.object,
  placeholderTextColor: PropTypes.string,
  value: PropTypes.string,
  keyboardType: PropTypes.string,
  autoFocus: PropTypes.bool,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
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
  rightIcon: PropTypes.elementType,
  leftIcon: PropTypes.elementType,
  onRightIconPress: PropTypes.func,
  setFunc: PropTypes.func,
};

export default NativeRightIconInput;
