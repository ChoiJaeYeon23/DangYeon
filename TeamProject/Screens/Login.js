import React, { useState, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { useNavigation } from "@react-navigation/native";


WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
    const [token, setToken] = useState(null);
    const navigation = useNavigation();

    // 네이버 클라이언트 ID 설정 및 사용자 정의 리디렉션 URI 설정
    const clientId = 'OqbYyPi3lOqgNJuqAvXL';
    const redirectUri = 'http://3.34.6.50:8080/auth/naver/callback';

    // 네이버 인증 요청 구성
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId,
            redirectUri,
            responseType: ResponseType.Code,
            scopes: ['name'],
            extraParams: {
                state: 'STATE',
            },
        },
        {
            authorizationEndpoint: 'https://nid.naver.com/oauth2.0/authorize',
            tokenEndpoint: 'https://nid.naver.com/oauth2.0/token',
        }
    );


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button
                disabled={!request}
                title="네이버 로그인"
                onPress={() => {
                    promptAsync({ useProxy: false });
                }}
            />
            {token && <Text>토큰: {token}</Text>}
            <TouchableOpacity onPress={() => navigation.navigate("MainTab")}>
                <Text >회원가입</Text>
            </TouchableOpacity>
        </View>


    );
};

export default LoginScreen;