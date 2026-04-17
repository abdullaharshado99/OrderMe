import {Platform} from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const apiLevel = Platform.Version;
export const isPad = Platform.isPad;
export const isTv = Platform.isTV;
export const isAndroidBelow10 = apiLevel < 32;
