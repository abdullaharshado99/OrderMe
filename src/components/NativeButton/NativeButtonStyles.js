import { StyleSheet } from 'react-native';

import { Theme, Responsive } from '../../libs';
import { AppFont, normalized } from '../../libs/responsive';
import { moderateScale } from 'react-native-size-matters';

const { getWidth, getHeight } = Responsive;
const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    width: getWidth(92),
    height: moderateScale(50),
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: Theme.borders.miniMediumRadius,
    overflow: 'hidden', // IMPORTANT
  },
  buttonText: {
    color: Theme.colors.white,
    fontSize: moderateScale(16),
    fontFamily: Theme.fontFamily.poppinsSemiBold
  },
  titlswrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
    height: getWidth('5'),
    width: getWidth('5'),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: getWidth('2'),
  },
  title2Wrap: {
    height: normalized.wp('6'),
    width: normalized.wp('6'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.darkGray,
    marginLeft: normalized.wp('2'),
    borderRadius: Theme.borders.regularRadius,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'red',
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: Theme.borders.miniMediumRadius,

  },

  fullGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  gradientInnerTouchable: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  halfGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
  },

  leftGradient: {
    left: 0,
  },

  rightGradient: {
    right: 0,
  },
  svgIcon: {
    marginRight: moderateScale(12)
  }
});

export default styles;
