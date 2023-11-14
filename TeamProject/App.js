import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
// import StackScreen from './navigations/StackScreen'
import Mainnavigation from './navigations/Mainnavigation'
const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Mainnavigation />
    </NavigationContainer>
  )
}

export default App;
