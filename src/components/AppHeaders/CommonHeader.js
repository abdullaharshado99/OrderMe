import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Theme } from '../../libs'
import { moderateScale } from 'react-native-size-matters'
import NativeText from '../AppTexts/NativeText'
import { useNavigation } from '@react-navigation/native'

const CommonHeader = ({
  title,
  svg1,
  svg2,
  rightBtn1,
  rightBtn2,
  rightIconPressableStyle,
  rightLeading,
}) => {
    const navigation = useNavigation()
    const android16 = Platform.Version > 35
    return (
        <View  >
            <StatusBar
                backgroundColor={Theme.colors.darkNavy} // or your screen bg color
                barStyle="light-content"
            />
            <View style={[styles.container, { paddingTop: android16 ? moderateScale(30) : Platform.OS === 'ios' ? moderateScale(50) : 0  }]}>
                <View style={styles.subContainer}>
                    <Pressable style={styles.svgContainer} onPress={() => navigation.goBack()}>
                        <View style={{ width: 24, height: 24 }} />
                    </Pressable>
                    <NativeText value={title} style={styles.title} />
                </View>
                <View style={styles.rightSvg}>
                    {rightLeading}
                    {svg1 ? (
                        <Pressable
                            style={rightIconPressableStyle}
                            onPress={typeof rightBtn1 === "function" ? rightBtn1 : undefined}
                        >
                            <View style={{ width: 24, height: 24 }} />
                        </Pressable>
                    ) : null}
                    {svg2 ? (
                        <Pressable
                            onPress={typeof rightBtn2 === "function" ? rightBtn2 : undefined}
                        >
                            <View style={{ width: 24, height: 24 }} />
                        </Pressable>
                    ) : null}
                </View>
            </View>
        </View>
    )
}

export default CommonHeader

const styles = StyleSheet.create({

    container: {
        backgroundColor: Theme.colors.darkNavy,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomLeftRadius: moderateScale(12),
        borderBottomRightRadius: moderateScale(12)
    },
    svgContainer: {
        backgroundColor: Theme.colors.white,
        padding: moderateScale(4),
        borderRadius: moderateScale(50),
    },
    title: {
        color: Theme.colors.white,
        fontFamily: Theme.fontFamily.poppinsSemiBold
    },
    subContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(10),
        padding: moderateScale(20),
    }, rightSvg: {
        // backgroundColor: "red"
        alignItems: "center",
        flexDirection: "row",
        marginRight: moderateScale(20),
        gap: moderateScale(10)
    }
})