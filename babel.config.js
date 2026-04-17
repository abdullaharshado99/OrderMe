module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@redux': './src/redux',
          '@NativeText': './src/components/AppTexts/NativeText',
          '@Routes': './src/navigation/Routes',
          '@export': './src/utils/export',
          '@libs': './src/libs',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
  ],
};
