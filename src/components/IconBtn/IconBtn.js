
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'

const IconBtn = ({ onPress, loading = false }) => {
    return (
        <Pressable onPress={onPress} style={styles.btn}>
            {loading ? <ActivityIndicator /> : <View style={styles.placeholder} />}
        </Pressable>
    )
}
export default IconBtn

const styles = StyleSheet.create({
    btn: {
        backgroundColor: "white",
        borderColor: "#DBDBDB",
        width: '30%',
        height: moderateScale(50),
        width: moderateScale(110),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        borderWidth: 1
    },
    placeholder: {
        width: moderateScale(24),
        height: moderateScale(24),
        alignSelf: 'center',
    },
})