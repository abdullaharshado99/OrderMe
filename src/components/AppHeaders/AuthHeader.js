import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { images } from '../../assets/images';
import { Theme } from '../../libs';
import { useNavigation } from '@react-navigation/native';
import NativeText from '../AppTexts/NativeText';
const AuthHeader = ({ title = '', showBack = true }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.wrapper}>
            <ImageBackground source={images.AuthHeader} style={styles.container} imageStyle={styles.imageStyle}>
                <View style={styles.content}>
                    {showBack && (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <View style={{ width: 24, height: 24 }} />
                        </TouchableOpacity>
                    )}
                    <View style={styles.logoContainer}>
                        <View style={{ width: 48, height: 48 }} />
                        {/* <Image source={images.AppLogo} style={styles.logo} /> */}
                    </View>

                    {title && (
                        <NativeText value={title} style={styles.title} />
                    )}
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        overflow: 'hidden',
        borderBottomLeftRadius: Theme.borders.halfRadius,
        borderBottomRightRadius: Theme.borders.halfRadius,
        backgroundColor: Theme.colors.white,
    },
    container: {
        width: '100%',
        height: moderateScale(160),
    },
    imageStyle: {
        borderBottomLeftRadius: Theme.borders.halfRadius,
        borderBottomRightRadius: Theme.borders.halfRadius,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: moderateScale(20),
        top: moderateScale(40),
        zIndex: 10,
    },
    logoContainer: {
        marginTop: moderateScale(10),
    },
    title: {
        fontSize: moderateScale(18),
        color: Theme.colors.white,
        fontFamily: Theme.fontFamily.poppinsSemiBold,
        marginTop: moderateScale(10),
    },
    logo: {
        height: moderateScale(150),
        width: moderateScale(150),
        resizeMode: 'center'
    }
});

export default AuthHeader;
