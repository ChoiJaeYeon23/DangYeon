import { createStackNavigator } from "@react-navigation/stack";
import Main from '../Screens/Main'
import ProfileInput from "../Screens/ProfileInput";
import CoupleConnect from "../Screens/CoupleConnect";
import Login from '../Screens/Login'
import SignUp from "../Screens/SignUp";
import Weather from "../Screens/Weather";

const Stack = createStackNavigator();

const StackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: "로그인",
          headerShown: true,
          headerStyle: { backgroundColor: "#FFCCFF" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "white",
          },
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          title: "회원가입",
          headerShown: true,
          headerStyle: { backgroundColor: "#FFCCFF" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "white",
          },
        }}
      />
      <Stack.Screen
        name="Main"
        component={Main}
        options={{
          title: "메인 화면",
          headerShown: true,
          headerStyle: { backgroundColor: "#FFCCFF" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "white",
          },
        }}
      />
      <Stack.Screen
        name="Connect"
        component={CoupleConnect}
        options={{
          title: "커플 연결?(CoupleConnect)",
          headerShown: true,
          headerStyle: { backgroundColor: "#FFCCFF" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "white",
          },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileInput}
        options={{
          title: "프로필 입력화면?(ProfileInput)",
          headerShown: true,
          headerStyle: { backgroundColor: "#FFCCFF" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "white",
          },
        }}
      />
      <Stack.Screen
        name="Weather"
        component={Weather}
        options={{
          title: "날씨 위젯?(Weather)",
          headerShown: true,
          headerStyle: { backgroundColor: "#FFCCFF" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "white",
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;