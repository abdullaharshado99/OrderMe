import {StyleSheet} from 'react-native';

import {Theme, Responsive} from '../../libs';

const {getWidth, getHeight} = Responsive;
const styles = StyleSheet.create({
  imageWrapper: {
    width: getWidth(20),
    height: getHeight(10),
    backgroundColor: Theme.colors.background,
    // borderWidth: 0.6,
    // borderColor: Theme.colors.border,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
});

export default styles;
