import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import NativeText from '../AppTexts/NativeText';
import { Theme } from '../../libs';

const OutlineButton = ({
    title,
    onPress,
    color = '#3478F6',
    containerStyle,
    textStyle,
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                styles.button,
                { borderColor: color },
                containerStyle,
            ]}
        >
            <NativeText
                value={title}
                style={[styles.text, { color }, textStyle]}
            />
        </TouchableOpacity>
    );
};

export default OutlineButton;

const styles = StyleSheet.create({
    button: {
        height: moderateScale(48),
        borderWidth: moderateScale(1.5),
        borderRadius: moderateScale(14),
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.poppinsSemiBold,

    },
});