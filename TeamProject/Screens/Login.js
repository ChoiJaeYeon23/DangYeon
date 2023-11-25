import React, { useState, useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
    const [token, setToken] = useState(null);

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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFCCFF",
    },
    inputTT: {
        alignItems: "center",
        justifyContent: "center",
        width: "75%",
        height: 45,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 7,
    },
    loginBtn: {
        width: "75%",
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7,
        backgroundColor: "white",
        borderWidth: 2,
        marginBottom: 10,
    },
    loginText: {
        color: "black",
        fontWeight: "bold",
    },
});

export default Login;
