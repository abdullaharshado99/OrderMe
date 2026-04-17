import {
    ActivityIndicator,
    Animated,
    Easing,
    Modal,
    StyleSheet,
    View,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale } from 'react-native-size-matters';
import { Theme } from '../../libs';
import NativeText from '../AppTexts/NativeText';

// ─── Bouncing Dot ────────────────────────────────────────────────────────────
function BouncingDot({ delay, color }) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(anim, {
                    toValue: -moderateScale(10),
                    duration: 350,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 350,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.delay(600),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    return (
        <Animated.View
            style={[
                styles.dot,
                { backgroundColor: color, transform: [{ translateY: anim }] },
            ]}
        />
    );
}

// ─── Full-Screen Overlay Loader ───────────────────────────────────────────────
/**
 * AppLoader
 *
 * Pass `visible` to show/hide the full-screen overlay during API calls.
 * Without `visible` prop it renders the compact inline spinner (used inside NativeButton).
 *
 * Usage as overlay:
 *   <AppLoader visible={isPending} message="Logging you in…" />
 *
 * Usage inline (NativeButton internal):
 *   <AppLoader />
 */
function AppLoader({ visible, message }) {
    // ── Inline spinner (inside NativeButton) ──────────────────────────────────
    if (visible === undefined) {
        return (
            <ActivityIndicator
                color={Theme.colors.white}
                style={styles.inlineSpinner}
            />
        );
    }

    // ── Full-screen overlay ───────────────────────────────────────────────────
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            statusBarTranslucent
        >
            <View style={styles.backdrop}>
                <LinearGradient
                    colors={[Theme.colors.purpleBlue, Theme.colors.AuroraBlue]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    {/* Bouncing dots */}
                    <View style={styles.dotsRow}>
                        <BouncingDot delay={0}   color="rgba(255,255,255,0.5)" />
                        <BouncingDot delay={150} color="rgba(255,255,255,0.8)" />
                        <BouncingDot delay={300} color={Theme.colors.skuBlue}  />
                        <BouncingDot delay={150} color="rgba(255,255,255,0.8)" />
                        <BouncingDot delay={0}   color="rgba(255,255,255,0.5)" />
                    </View>

                    <NativeText style={styles.messageText}>
                        {message || 'Please wait…'}
                    </NativeText>
                </LinearGradient>
            </View>
        </Modal>
    );
}

export default AppLoader;

const styles = StyleSheet.create({
    // ── Inline (NativeButton) ──────────────────────────────────────────────
    inlineSpinner: {
        transform: [{ scale: 1.3 }],
    },

    // ── Overlay ────────────────────────────────────────────────────────────
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(11, 30, 60, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: moderateScale(200),
        paddingVertical: moderateScale(32),
        paddingHorizontal: moderateScale(24),
        borderRadius: moderateScale(20),
        alignItems: 'center',
        shadowColor: Theme.colors.purpleBlue,
        shadowOffset: { width: 0, height: moderateScale(8) },
        shadowOpacity: 0.45,
        shadowRadius: moderateScale(16),
        elevation: 12,
    },
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: moderateScale(20),
        gap: moderateScale(8),
    },
    dot: {
        width: moderateScale(11),
        height: moderateScale(11),
        borderRadius: moderateScale(6),
    },
    messageText: {
        color: Theme.colors.white,
        fontSize: moderateScale(13),
        fontFamily: Theme.fontFamily.poppinsMedium,
        textAlign: 'center',
        opacity: 0.9,
    },
});
