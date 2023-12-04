import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import home from '../assets/home.png'
import board from '../assets/board.png'
import chat from '../assets/chat.png'
import user from '../assets/user.png'
import etc from '../assets/etc.png'

import Login from '../Screens/Login';
import SignUp from "../Screens/SignUp";
import CoupleConnect from "../Screens/CoupleConnect";
import Main from '../Screens/MainScreen/Main';
import PictureMap from '../Screens/MainScreen/PictureMap'
import CalendarScreen from '../Screens/MainScreen/CalendarScreen'
import Weather from '../Screens/MainScreen/Weather';
import Chat from '../Screens/ChatScreen/Chat'
import CheckCoupleBreak from '../Screens/UserInfoScreen/CheckCoupleBreak';
import CoupleBreak from '../Screens/UserInfoScreen/CoupleBreak';
import UserInfo from '../Screens/UserInfoScreen/UserInfo'
import Board from '../Screens/BoardScreen/Board'
import Gesigeul from '../Screens/BoardScreen/Gesigeul';
import Etc from '../Screens/EtcScreen/Etc'
import BucketList from '../Screens/EtcScreen/BucketList';
import PedometerScreen from '../Screens/EtcScreen/PedometerScreen'
import CalendarPage from '../Screens/EtcScreen/CalendarPage';

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
                    headerLeft: () => null, // 뒤로 가기 버튼 제거
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
            <MainStack.Screen
                name="PictureMap"
                component={PictureMap}
                options={{
                    headerLeft: () => null,
                    title: "사진지도",
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
                name="CalendarScreen"
                component={CalendarScreen}
                options={{
                    headerLeft: () => null,
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
                    headerLeft: () => null,
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
                    headerLeft: () => null,
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
                    headerLeft: () => null,
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
            <BoardStack.Screen
                name="Gesigeul"
                component={Gesigeul}
                options={{
                    headerLeft: () => null,
                    title: "게시글 작성",
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
                    headerShown: false,
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
                    headerShown: false,
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
                    headerShown: false,
                    headerStyle: { backgroundColor: "#FFCCFF" },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }}
            />
            <AuthStack.Screen
                name="CoupleBreak"
                component={CoupleBreak}
                options={{
                    title: "커플 연결 끊기",
                    headerShown: false,
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
                    headerLeft: () => null,
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
            <UserInfoStack.Screen
                name="CheckCoupleBreak"
                component={CheckCoupleBreak}
                options={{
                    headerLeft: () => null,
                    title: "커플 연결 끊기 확인",
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
                    headerLeft: () => null,
                    title: "기타",
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
                    headerLeft: () => null,
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
                name="PedometerScreen"
                component={PedometerScreen}
                options={{
                    headerLeft: () => null,
                    title: "만보기",
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
                name="CalendarPage"
                component={CalendarPage}
                options={{
                    headerLeft: () => null,
                    title: "출석확인달력",
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
            <Tab.Screen name="홈" component={MainStackScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Image
                            source={home}
                            style={{
                                width: size,
                                height: size,
                                tintColor: focused ? color : 'gray'
                            }}
                        />
                    ),
                }} />
            <Tab.Screen name="채팅" component={ChatStackScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Image
                            source={chat}
                            style={{
                                width: size,
                                height: size,
                                tintColor: focused ? color : 'gray'
                            }}
                        />
                    ),
                }} />
            <Tab.Screen name="게시판" component={BoardStackScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Image
                            source={board}
                            style={{
                                width: size,
                                height: size,
                                tintColor: focused ? color : 'gray'
                            }}
                        />
                    ),
                }} />
            <Tab.Screen name="내 정보" component={UserInfoStackScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Image
                            source={user}
                            style={{
                                width: size,
                                height: size,
                                tintColor: focused ? color : 'gray'
                            }}
                        />
                    ),
                    headerShown: false
                }} />
            <Tab.Screen name="기타" component={EtcStackScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Image
                            source={etc}
                            style={{
                                width: size,
                                height: size,
                                tintColor: focused ? color : 'gray'
                            }}
                        />
                    ),
                }} />
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