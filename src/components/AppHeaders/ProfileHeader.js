import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native'
import NativeText from '../AppTexts/NativeText'
import { Theme } from '../../libs'

const ProfileHeader = ({ title = 'profile.headerTitle' }) => {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
                hitSlop={10}
            >
                <View style={{ width: moderateScale(36), height: moderateScale(36) }} />
            </TouchableOpacity>

            <NativeText value={title} style={styles.title} />

            {/* Spacer keeps title centered */}
            <View style={styles.spacer} />
        </View>
    )
}

export default ProfileHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.darkNavy,
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(16),
        paddingTop: moderateScale(50),
    },
    backBtn: {
        width: moderateScale(36),
        height: moderateScale(36),
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: moderateScale(18),
        fontFamily: Theme.fontFamily.poppinsSemiBold,
        color: Theme.colors.white,
    },
    spacer: {
        width: moderateScale(36),
    },
})
