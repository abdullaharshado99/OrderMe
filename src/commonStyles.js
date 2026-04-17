import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'
import { Theme } from './libs'



export const commonStyles = StyleSheet.create({
    border: {
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(12),
        borderColor: Theme.borderColor.inputBorder,
        margin: moderateScale(20)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
    },
    scrollContent: {
        paddingBottom: moderateScale(120),
    },
})