import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

const CoupleConnect = ({ navigation }) => {
    const [text, setText] = useState('')

    const goToProfileInput = () => { //프로필 입력 화면으로 이동
        navigation.navigate('Profile');
    };

    const onChangeText = (inputText) => {
        setText(inputText)
    }

    const copyToClipboard = () => {
        Clipboard.setString('47868'); // 코드 백이랑 연결 후 수정할거임
        copyAlert();
    };

    const copyAlert = () => //복사 알람
        Alert.alert(
            "복사",
            "복사되었습니다.",
            [
                { text: "확인", onPress: () => { } },
            ],
            { cancelable: false }
        );

    useEffect(() => {
        const getToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token !== null) {
                    // 토큰 사용
                }
            } catch (error) {
                console.error("토큰 가져오기 실패", error);
            }
        };

        getToken();
    }, []);

    const Separator = () => <View style={styles.separator} />

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>서로의 초대코드를 입력하세요.</Text>
            <Separator />
            <Text style={styles.codeTitle}>내 초대코드</Text>
            <View style={styles.codeContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.code}>47868</Text>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
                        <Text style={styles.buttonText}>복사</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Separator />
            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>상대방의 초대코드를 입력하세요.</Text>
                <TextInput
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="전달받은 코드 입력"
                    style={styles.input}
                />
            </View>
            <TouchableOpacity onPress={goToProfileInput} style={styles.connectButton}>
                <Text style={styles.connectButtonText}>연결하기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.connectButton}>
                <Text style={styles.connectButtonText}>로그인 화면으로 이동하기</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFF9F9',
    },
    titleText: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#544848',
        fontSize: 24,
        fontWeight: 'bold',
    },
    codeContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    codeTitle: {
        textAlign: 'center',
        fontSize: 22,
        marginBottom: 10,
        color: '#544848',
    },
    code: {
        textAlign: 'center',
        fontSize: 24,
        marginVertical: 8,
        marginLeft: 90
    },
    button: {
        backgroundColor: '#EBDBDB',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        marginRight: 40
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
    },
    inputContainer: {
        width: '100%',
    },
    inputTitle: {
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 18,
        marginBottom: 10,
        color: '#544848',
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        width: '80%',
        borderBottomColor: '#A0A0A0',
        marginBottom: 15,
        fontSize: 18,
        textAlign: 'center',
        alignSelf: 'center'
    },
    connectButton: {
        backgroundColor: '#FFCECE',
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
    },
    connectButtonText: {
        textAlign: 'center',
        color: '#544848',
        fontWeight: 'bold',
        fontSize: 20,
    },
    separator: {
        height: 1,
        width: "80%",
        backgroundColor: "#737373",
        marginVertical: 15,
        marginBottom: 35,
    }
});

export default CoupleConnect;