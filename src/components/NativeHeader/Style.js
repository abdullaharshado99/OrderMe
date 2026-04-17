import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
import { Theme, Responsive } from '../../libs';
import { moderateScale } from 'react-native-size-matters';
const { getHeight, AppFonts } = Responsive;

const getStyles = () =>
  StyleSheet.create({
    container: {
      // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44, // safe area
      paddingHorizontal: 9,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: getHeight(13), // ✅ fixed NaN issue
      backgroundColor:Theme.colors.main,
      justifyContent:"center",
    },
    leftSection: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:moderateScale(15)

    },
    rightSection: {
      width: 40,
      height: 40,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:moderateScale(15)

    },
    titleWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 40, // balance space for back button
    },
    title: {
      fontSize: moderateScale(16),
      color: 'white',
      textAlign: 'center',
      fontFamily:Theme.fontFamily['Poppins-SemiBold']
    },
    title2: {
      fontSize: moderateScale(16),
      fontFamily:Theme.fontFamily['Poppins-SemiBold'],
      color: Theme.colors.black,
      textAlign: 'center',
    },
    
  });

export default getStyles;
