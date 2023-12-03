import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
// import StackScreen from './navigations/StackScreen'
import AppNavigator from './navigations/AppNavigator'
const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  )
}

export default App;
