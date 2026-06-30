import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a0033', '#330066', '#4d0099']}
        style={styles.gradient}
      >
        <Text style={styles.title}>ZxBowe</Text>
        <Text style={styles.subtitle}>React Native Dark Gradient App</Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 48, color: '#fff', fontWeight: 'bold' },
  subtitle: { fontSize: 24, color: '#ccc', marginTop: 20 }
});
