import { Platform, StyleSheet } from 'react-native';

import { Theme, Responsive } from '../../libs';
import { AppFont } from '../../libs/responsive';

const { AppFonts, getWidth, getHeight } = Responsive;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borders.normalRadius,
    borderColor: Theme.colors.coolGray,
    marginVertical: getHeight('0.75'),
    paddingHorizontal: 12,
    height: getHeight(5.5)
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width:Platform.isPad ? getWidth(82) : getWidth('66'),
    color: Theme.colors.darkBlue,
    fontSize: AppFont.commonFont.small,
    fontFamily: Theme.fontFamily['Degular-Regular']
  },
  perHoureText: {
    paddingVertical: getHeight(1),
    paddingLeft: getWidth('2'),
    marginRight: Platform.OS === 'ios' ? getWidth('2') : getWidth('10'),
    color: Theme.colors.darkBlue,

  },
  errorText: {
    color: Theme.colors.error,
    marginTop: getWidth(0.1),
    fontSize: AppFont.commonFont.smallest,
    fontFamily: Theme.fontFamily['Degular-Regular']
  },
  bottomViewWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 5,
  },
  counterTxt: {
    color: Theme.colors.coolGray,
    fontSize: AppFonts.t4,
  },
});

export default styles;
