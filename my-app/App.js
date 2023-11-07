import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator  } from '@react-navigation/stack'
import couple_connect from './Screen/couple_connect'
import profileinput from './Screen/profileinput'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CoupleConnect">
        <Stack.Screen name="CoupleConnect" component={couple_connect} />
        <Stack.Screen name="ProfileInput" component={profileinput} />
      </Stack.Navigator>
    </NavigationContainer>
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
