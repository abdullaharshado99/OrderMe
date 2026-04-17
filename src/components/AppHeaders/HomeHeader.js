import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Theme, Responsive } from '../../libs';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import NativeText from '../AppTexts/NativeText';
import { images } from '../../assets/images';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
const { AppFonts } = Responsive;

function HomeHeader(props) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  return (
    <View style={styles.headerContainer}>
      <View>
        <NativeText style={styles.title} value={props.title} />
        <NativeText style={styles.subtitle} value={props.subtitle} />
      </View>
      {props.profileImage && (
        <TouchableOpacity activeOpacity={0.7} style={styles.userImageContainer}>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color={Theme.colors.primary}
              style={StyleSheet.absoluteFill}
            />
          )}

          <Image
            source={images.User1}
            style={styles.userImage}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default HomeHeader;
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    height: '10%',
    shadowColor: '#000',
  },

  userImageContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.colors.BoldGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: AppFonts.h5,
    fontFamily: Theme.fontFamily.poppinsSemiBold,
    color: Theme.colors.primary,
  },
  subtitle: {
    fontSize: AppFonts.t3,
    fontFamily: Theme.fontFamily.poppinsRegular,
  },
});
