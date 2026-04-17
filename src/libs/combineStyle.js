import { StyleSheet } from 'react-native';
import Responsive, { AppFont } from './responsive';
import { Theme } from '.';

const { getWidth, getHeight, AppFonts } = Responsive;

const combineStyle = StyleSheet.create({

  headerContainer: {
    paddingVertical: getHeight('1'),
    paddingHorizontal: getHeight('1.5'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // elevation: 2,
    borderBottomWidth:1,
    borderColor:"#0000000A",
    shadowColor: Theme.colors.darkBlue,
    shadowOffset: { width: 0, height: 1 }, // iOS shadow offset
    shadowOpacity: 0.2, // iOS shadow opacity
    shadowRadius: 1, // iOS shadow radius
    backgroundColor: Theme.colors.white,
  },
  pickerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borders.normalRadius,
    marginVertical: getHeight('0.75'),
    paddingHorizontal: 12,
    height: getHeight(5.5)
  },
  container: {
    paddingHorizontal: getWidth('4'),
  },
  notificationBtn: {
    height: getHeight('5'),
    width: getHeight(5),
    alignSelf: 'center',
    marginTop: getHeight('2')
  },
  remainingImages: {
    color: Theme.colors.white,
    fontFamily: Theme.fontFamily['Degular-Bold'],
    fontSize: AppFont.commonFont.small,
    position: 'absolute',
    right: getHeight('3'),
    zIndex: 1,
  },
  logoStyleWrap: {
    height: getHeight(8),
    width: getHeight(8),
    marginRight: getWidth('1'),
  },
  logoStyle: {
    flex: 1,
    height: undefined,
    width: undefined,
    borderRadius: Theme.borders.miniRadius,
  },
  deleteIconWrap: {
    position: 'absolute',
    top: getHeight(0.5),
    right: getHeight(0.5),
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: getWidth(0.5),
    borderRadius: 50,
  },
  gridIconWrapper: {
    height: getHeight(8),
    width: getHeight(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F8',
    marginRight: getWidth('1'),
    borderRadius: Theme.borders.miniRadius,
  },
  imageWrapper: {
    borderWidth: 1,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#D6D7DB',
    padding: getHeight('1'),
    borderRadius: Theme.borders.normalRadius,
  },
  uploadImageWrap: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D6D7DB',
    borderRadius: Theme.borders.normalRadius,
    padding: getHeight(2.5)
  },
  gridIconWrap: {
    alignSelf: 'center',
    paddingTop: getHeight(1.5),
  },
  imagwWrap: {
    height: getWidth('10'),
    width: getWidth('10'),
  },
  selectedImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  headingStyl: {
    fontSize: AppFont.commonFont.large,
    fontFamily: Theme.fontFamily['Degular-Bold'],
  },
  uploadStyle: {
    fontSize: AppFont.commonFont.small,
    fontFamily: Theme.fontFamily['Degular-Semibold'],
    textAlign: 'center',
    paddingBottom: getWidth('2'),
  },
  headingTextWrap: {
    alignSelf: 'center',
  },
  memberText: {
    textAlign: 'center',
    paddingHorizontal: getHeight('2'),
    paddingVertical: getHeight('1'),
    fontSize: AppFont.commonFont.lessMedium,
  },
  addImageDes: {
    textAlign: 'center',
    fontSize: AppFont.commonFont.mediumSmall,
  },
  discriptionInput: {
    borderColor: Theme.colors.lightMist,
    width: getWidth('85'),
    height: getHeight(13),
    paddingTop: 12,
  },
  addEventContainer: {
    borderColor: Theme.colors.lightMist,
    width: getWidth('92'),
    height: getHeight(13),
    alignSelf: 'center',
  },
  inputStyle: {
    borderColor: Theme.colors.lightMist,
    width: getWidth('85'),
  },
  infoIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getWidth('2'),
  },
  TapIcon: {
    color: Theme.colors.darkBlue,
    fontSize: AppFont.commonFont.mediumSmall,
  },
  btnContainer: {
    marginTop: getWidth('3'),
  },
  addBtn: {
    marginTop: getWidth('3'),
    backgroundColor: Theme.colors.lightMist,
  },
  headerStyle: {
    paddingHorizontal: 0,
    elevation: 0,
    shadowColor: Theme.colors.white,
    shadowOffset: { width: 0, height: 0 }, // iOS shadow offset
    shadowOpacity: 0, // iOS shadow opacity
    shadowRadius: 0, // iOS shadow radius
    backgroundColor: Theme.colors.white,
    paddingHorizontal: getHeight('2')
  },
  notificationBtn: {
    height: getHeight(4.5),
    width: getHeight(4.5),
    marginLeft: getWidth('2'),
    backgroundColor: Theme.colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.borders.maxRadius,
  },
  flexWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flexWrapSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  }
});

export default combineStyle;
