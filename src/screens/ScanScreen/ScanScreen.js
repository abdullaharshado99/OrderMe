import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import NativeText from '@NativeText';
import { NativeButton, NativeInput } from '@components';
import { setScanComplete } from '@redux/slices/authSlice';
import { Theme } from '@libs';

export default function ScanScreen() {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');

  const onScanSuccess = () => {
    dispatch(setScanComplete(true));
  };

  return (
    <View style={styles.container}>
      <NativeButton title="Scan" onPress={onScanSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    gap: 14,
  },
  title: {
    fontSize: 22,
    color: Theme.colors.black,
    textAlign: 'center',
  },

});

