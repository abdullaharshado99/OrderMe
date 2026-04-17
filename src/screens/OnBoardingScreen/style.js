import { Dimensions, StyleSheet } from 'react-native';
import { Theme, Responsive } from '@libs';
const { AppFonts } = Responsive;
import { moderateScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    backgroundColor: 'rgba(11, 30, 60, 1)',
  },
  background: {
    width: width,
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.8,
    zIndex: 0,
  },
  card: {
    position: 'absolute',
    width: moderateScale(335),
    alignItems: 'center',
    paddingBottom: moderateScale(20),
    alignSelf: 'center',
    bottom: moderateScale(10),
    zIndex: 2,
  },
  title: {
    fontSize: AppFonts.h3,
    color: Theme.colors.white,
    textAlign: 'center',
    fontFamily: Theme.fontFamily.poppinsSemiBold,
    bottom: moderateScale(30),
  },
  subtitle: {
    fontSize: AppFonts.h6,
    color: Theme.colors.white,
    textAlign: 'center',
    marginBottom: moderateScale(40),
    fontFamily: Theme.fontFamily.poppinsRegular,
  },
  bottomView: {
    width: '100%',
    gap: moderateScale(15),
    marginTop: 'auto',
    bottom: moderateScale(0),
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(8),
    backgroundColor: '#FFFFFF33',
    marginHorizontal: moderateScale(3),
  },
  activeDot: {
    width: moderateScale(24),
    height: moderateScale(8),
    borderRadius: moderateScale(8),
    backgroundColor: Theme.colors.AuraBlue,
    marginHorizontal: moderateScale(3),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skip: {
    width: moderateScale(50),
    height: moderateScale(50),
    backgroundColor: 'transparent',
    borderRadius: moderateScale(10),
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: moderateScale(0),
  },
  skiptext: {
    color: Theme.colors.white,
    fontFamily: Theme.fontFamily.poppinsSemiBold,
    fontSize: AppFonts.h6,
    textAlign: 'left',
  },
  nextButton: {
    width: moderateScale(100),
    height: moderateScale(50),
    backgroundColor: Theme.colors.primary,
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: Theme.colors.white,
    fontFamily: Theme.fontFamily.poppinsSemiBold,
    fontSize: AppFonts.h6,
  },
  getStarded: {
    backgroundColor: Theme.colors.primary,
    marginTop: 'auto',
  },
  getStartText: {
    fontSize: AppFonts.h6,
  },
});

export default styles;