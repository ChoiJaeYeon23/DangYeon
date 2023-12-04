import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from './navigations/AppNavigator'

function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  )
}

export default App;