import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import couple_connect from './Screen/couple_connect'
import profileinput from './Screen/profileinput'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <couple_connect/>
      <profileinput/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
