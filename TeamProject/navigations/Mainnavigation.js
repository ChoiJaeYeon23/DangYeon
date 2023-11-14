import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from '../Screens/Login';
import SignUp from "../Screens/SignUp";
import ProfileInput from "../Screens/ProfileInput";
import CoupleConnect from "../Screens/CoupleConnect";
import Main from '../Screens/MainScreen/Main';
// import PictureMap from '../Screens/MainScreen/PictureMap'
import CalendarScreen from '../Screens/MainScreen/CalendarScreen'
import Weather from '../Screens/MainScreen/Weather';
import Chat from '../Screens/ChatScreen/Chat'
import UserInfo from '../Screens/UserInfoScreen/UserInfo'
import Board from '../Screens/BoardScreen/Board'
import Etc from '../Screens/EtcScreen/Etc'
import BucketList from '../Screens/EtcScreen/BucketList';
import Entire from '../Screens/EtcScreen/Entire';
import Bulletinboard from '../Screens/EtcScreen/Bulletinboard'

const MainStack = createStackNavigator();
const AuthStack = createStackNavigator();
const ChatStack = createStackNavigator();
const BoardStack = createStackNavigator();
const UserInfoStack = createStackNavigator();
const EtcStack = createStackNavigator();

const Tab = createBottomTabNavigator();

function MainStackScreen() {
    return (
        <MainStack.Navigator>
            <MainStack.Screen
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
            {/* <MainStack.Screen
                name="PictureMap"
                component={PictureMap}
                options={{
                    title: "사진지도",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#FFCCFF" },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }}
            /> */}
            <MainStack.Screen
                name="CalendarScreen"
                component={CalendarScreen}
                options={{
                    title: "캘린더",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#FFCCFF" },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }}
            />
            <MainStack.Screen
            name="Weather"
            component={Weather}
            options={{
                title: "날씨",
                headerShown: true,
                headerStyle: { backgroundColor: "#FFCCFF" },
                headerTintColor: "white",
                headerTitleStyle: {
                    fontWeight: "bold",
                    color: "white",
                },
            }}
        />
        </MainStack.Navigator>
    );
}

function ChatStackScreen() {
    return (
        <ChatStack.Navigator>
            <ChatStack.Screen
                name="Chat"
                component={Chat}
                options={{
                    headerShown: true,
                    title: "채팅창",
                    headerStyle: { backgroundColor: "#FFCCFF" },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }} />
        </ChatStack.Navigator>
    );
}

function BoardStackScreen() {
    return (
        <BoardStack.Navigator>
            <BoardStack.Screen
                name="Board"
                component={Board}
                options={{
                    title: "게시판화면",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#FFCCFF" },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }}
            />
        </BoardStack.Navigator>
    );
}

function AuthStackScreen() {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen
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
            <AuthStack.Screen
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
            <AuthStack.Screen
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
            <AuthStack.Screen
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
        </AuthStack.Navigator>
    );
}

function UserInfoStackScreen() {
    return (
        <UserInfoStack.Navigator>
            <UserInfoStack.Screen
                name="UserInfo"
                component={UserInfo}
                options={{
                    title: "내 정보",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#FFCCFF" },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }}
            />
        </UserInfoStack.Navigator>
    );
}

function EtcStackScreen() {
    return (
        <EtcStack.Navigator>
            <EtcStack.Screen
                name="Etc"
                component={Etc}
                options={{
                    title: "etc",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#FFCCFF" },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }}
            />
            <EtcStack.Screen
                name="BucketList"
                component={BucketList}
                options={{
                    title: "버킷리스트",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#FFCCFF" },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }}
            />
            <EtcStack.Screen
                name="Entire"
                component={Entire}
                options={{
                    title: "Entire",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#FFCCFF" },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }}
            />
            <EtcStack.Screen
                name="Bulletinboard"
                component={Bulletinboard}
                options={{
                    title: "Bulletinboard",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#FFCCFF" },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }}
            />
        </EtcStack.Navigator>
    );
}

const MainTabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Main" component={MainStackScreen} />
            <Tab.Screen name="Chat" component={ChatStackScreen} />
            <Tab.Screen name="Board" component={BoardStackScreen} />
            <Tab.Screen name="UserInfo" component={UserInfoStackScreen} />
            <Tab.Screen name="Etc" component={EtcStackScreen} />
        </Tab.Navigator>
    );
}

const AppNavigator = () => {
    return (
        <MainStack.Navigator>
            <MainStack.Screen name="Auth" component={AuthStackScreen} options={{ headerShown: false }} />
            <MainStack.Screen name="MainTab" component={MainTabNavigator} options={{ headerShown: false }} />
        </MainStack.Navigator>
    );
}

export default AppNavigator;