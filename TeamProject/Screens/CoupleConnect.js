import React, { useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity 
} from "react-native";

const CoupleConnect = ({ navigation }) => {
    const [text, setText] = useState('')

    const goToProfileInput = () => { //프로필 입력 화면으로 이동
        navigation.navigate('Profile');
    };

    const onChangeText = (inputText) => {
        setText(inputText)
    }

    const Separator = () => <View style={styles.separator} />

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>서로의 초대코드를 입력하세요.</Text>
            <Separator />
            <View style={styles.codeContainer}>
                <Text style={styles.codeTitle}>내 초대코드</Text>
                <Text style={styles.code}>47868</Text>
                <TouchableOpacity onPress={goToProfileInput} style={styles.button}>
                    <Text style={styles.buttonText}>복사</Text>
                </TouchableOpacity>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFF9F9', // 바탕화면 색상 변경
    },
    titleText: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#544848', // titleText 색상 변경
        fontSize: 18,
        fontWeight: 'bold',
    },
    codeContainer: {
        width: '100%',
        alignItems: 'center',
    },
    codeTitle: {
        textAlign: 'center',
    },
    code: {
        textAlign: 'center',
        fontSize: 24,
        marginVertical: 8,
    },
    button: {
        backgroundColor: '#EBDBDB', // 복사하기 버튼 색상 변경
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    buttonText: {
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
    },
    inputTitle: {
        textAlign: 'center',
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        width: '70%',
        borderBottomColor: '#A0A0A0',
        color: '#A0A0A0',
        marginBottom: 15,
        marginRight: 100,
        fontSize: 16,
        textAlign: 'center',
    },
    connectButton: {
        backgroundColor: '#FFCECE', // 연결하기 버튼 색상 변경
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    connectButtonText: {
        textAlign: 'center',
        color: '#544848', // 버튼 텍스트 색상도 titleText 색상과 동일하게 설정
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        width: "70%",
        backgroundColor: "#737373",
        marginVertical: 15,
    }
});

export default CoupleConnect;