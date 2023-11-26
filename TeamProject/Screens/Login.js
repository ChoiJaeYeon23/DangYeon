import React, { useState, useEffect } from 'react';
import { Image, Text, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
    const [token, setToken] = useState(null);
    const [id, setID] = useState("");
    const [pw, setPW] = useState("");
    const navigation = useNavigation();

    const users = [ //임시값
        { ID: 'qwe', PW: '123' },
        { ID: 'aaa', PW: '111' },
    ];

    const resetInputs = () => { // 초기화 함수
        setID("");
        setPW("");
    };

    const Login = () => {
        const user = users.find((u) => u.ID === id && u.PW === pw);

        if (user) {
            alert("로그인 성공");
            resetInputs();
            navigation.navigate("MainTab", { id });
        } else {
            alert("ID 또는 비밀번호가 잘못되었습니다.");
            resetInputs();
        }
    };

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
        <View style={styles.container}>
            <TextInput
                style={styles.inputTT}
                placeholder="아이디"
                value={id}
                onChangeText={setID}
            />
            <TextInput
                style={styles.inputTT}
                placeholder="비밀번호"
                secureTextEntry
                value={pw}
                onChangeText={setPW}
            />
            <TouchableOpacity style={styles.loginBtn} onPress={Login}>
                <Text style={styles.loginText}>로그인</Text>
            </TouchableOpacity>
            <View style={styles.container2}>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.loginText}>회원가입   l   </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.loginText}> 비밀번호 찾기</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { promptAsync({ useProxy: false }); }}
                disabled={!request}>
                <Image source={require('../assets/Naver/btnW_아이콘원형.png')} style={{ width: 70, height: 70 }} />
            </TouchableOpacity>
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
    container2:{
        flexDirection: 'row',
        marginBottom: 30,
        textAlign: "center",
        marginLeft: 10,
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
        marginBottom: 20,
    },
    loginText: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default Login;
