import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import StackScreen from './navigations/StackScreen'

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  )
}

export default App;
