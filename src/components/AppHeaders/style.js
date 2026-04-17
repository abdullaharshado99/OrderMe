import { Platform, StyleSheet } from 'react-native';
import { Responsive, Theme } from '../../libs';
import { AppFont } from '../../libs/responsive';
import { moderateScale } from 'react-native-size-matters';

const { getWidth, getHeight } = Responsive;


const styles = StyleSheet.create({
    settingContainer: {
   position:"absolute",
   top:moderateScale(10),
  },

  
});

export default styles;
