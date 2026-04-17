import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NativeText from '../AppTexts/NativeText'
import { moderateScale } from 'react-native-size-matters'
import { Theme } from '../../libs'

const SocialHeader = ({ title, description, step }) => {
    const android16 = Platform.Version > 34
    return (
        <View style={styles.container}>
            <View style={[styles.row, { marginTop: android16 ? moderateScale(30) : Platform.OS == 'ios' ? moderateScale(35) : 0 }]}>
                <View style={styles.btn}>
                    <View style={{ width: 24, height: 24 }} />
                </View>
                <NativeText style={{ color: Theme.colors.white }} value={`Step ${step} of 2`} />
            </View>
            <NativeText style={styles.title} value={title} />
            <NativeText style={{ color: Theme.colors.white, marginBottom: moderateScale(12) }} value={description} />
        </View>
    )
}

export default SocialHeader

const styles = StyleSheet.create({
    container: {
        padding: moderateScale(20),
        backgroundColor: Theme.colors.darkNavy,
        borderBottomLeftRadius: moderateScale(24),
        borderBottomRightRadius: moderateScale(24)
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(10),
        marginBottom: moderateScale(15)
    }, btn: {
        padding: moderateScale(10),
        backgroundColor: Theme.colors.white,
        borderRadius: moderateScale(50)
    },
    title: {
        color: Theme.colors.white,
        fontFamily: Theme.fontFamily.poppinsSemiBold,
        marginVertical: moderateScale(10)
    }


})