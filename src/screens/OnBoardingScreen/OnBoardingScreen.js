import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { NativeButton, SafeFlexView } from '@components';
import NativeText from '@NativeText';
import { Routes } from '@Routes';
import { OnboardingData } from '@export';
// import { useTranslation } from 'react-i18next';
import styles from './style';
import { dispatchOnbording } from '@redux/slices/authSlice';

const { width } = Dimensions.get('window');

const OnBordingScreen = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const { t } = useTranslation();

  const onSkip = () => {
    dispatch(dispatchOnbording(true));
    navigation.replace(Routes.ScanScreen);
  };

  const onNext = () => {
    if (currentIndex < OnboardingData.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onSkip();
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <ImageBackground source={item.image} style={styles.background}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(11, 30, 60, 0.3)',
            'rgba(11, 30, 60, 0.7)',
            'rgba(11, 30, 60, 0.95)',
            'rgba(11, 30, 60, 1)',
          ]}
          locations={[0, 0.3, 0.5, 0.7, 1]}
          style={styles.gradient}
        />
      </ImageBackground>
    </View>
  );

  const isLastSlide = currentIndex === OnboardingData.length - 1;

  return (
    <SafeFlexView top={false} islinear={false}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={OnboardingData}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialNumToRender={1}
          windowSize={2}
          removeClippedSubviews
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width,
            );
            setCurrentIndex(index);
          }}
        />

        <View style={styles.card}>
          <NativeText
            style={styles.title}
            value={OnboardingData[currentIndex]?.title}
          />
          <NativeText
            style={styles.subtitle}
            value={OnboardingData[currentIndex]?.subtitle}
          />

          {/* Last slide — Get Started button */}
          {isLastSlide && (
            <NativeButton
              title="Get Started"
              onPress={onSkip}
              containerStyle={styles.getStarded}
              useGradient
              useGradientgradientSide="full"
              gradientColors={['#6A5AF9', '#4FE9F3']}
            />
          )}

          {/* All other slides — Skip | Dots | Next */}
          {!isLastSlide && (
            <View style={styles.bottomView}>
              <View style={styles.row}>

                {/* Skip */}
                <NativeButton
                  title="Skip"
                  containerStyle={styles.skip}
                  titleStyle={styles.skiptext}
                  onPress={onSkip}
                />

                {/* Pagination Dots */}
                <View style={styles.paginationContainer}>
                  {OnboardingData.map((_, i) => (
                    <View
                      key={i}
                      style={i === currentIndex ? styles.activeDot : styles.dot}
                    />
                  ))}
                </View>

                {/* Next — plain button, no icon */}
                <TouchableOpacity
                  onPress={onNext}
                  activeOpacity={0.6}
                  style={styles.nextButton}
                >
                  <NativeText style={styles.nextText} value="Next" />
                </TouchableOpacity>

              </View>
            </View>
          )}
        </View>
      </View>
    </SafeFlexView>
  );
};

export default OnBordingScreen;