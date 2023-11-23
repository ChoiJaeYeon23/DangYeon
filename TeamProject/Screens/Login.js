import React, { useState } from 'react';
import { View, TouchableOpacity, Linking, Image, styles } from 'react-native';

const LoginScreen = () => {
    const client_id = 'OqbYyPi3lOqgNJuqAvXL';
    const redirectURI = 'http://13.236.248.201:8080/'
    const state = Math.random().toString(36).substring(2) + Date.now().toString(36);

    const naverLogin = () => {
        const api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&state=${state}`;
        Linking.openURL(api_url);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={naverLogin}> 
                    <Image source={require('../assets/Naver/btnG_완성형.png')} style={{ width: 150, height: 50 }}/>
                    <Image source={require('../assets/Naver/btnW_아이콘원형.png')} style={{ width: 80, height: 80 }}/>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
