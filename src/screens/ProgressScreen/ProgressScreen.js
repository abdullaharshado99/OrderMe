import React from 'react';
import { StyleSheet, View } from 'react-native';
import NativeText from '@NativeText';
import { Theme } from '@libs';

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <NativeText value="Progress" heading style={styles.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.white },
  text: { fontSize: 24, color: Theme.colors.black },
});

