import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

function SafeFlexView({ children, style, top = true, bottom = true }) {
  const edges = [];
  if (top) edges.push('top');
  if (bottom) edges.push('bottom');

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, style]}
    >
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1 },
});

export default SafeFlexView;

