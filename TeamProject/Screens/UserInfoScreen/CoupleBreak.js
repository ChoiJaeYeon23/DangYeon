import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native'

const CheckCoupleBreak = ({ navigation }) => {
    const breakAlert = () => //연결 끊기 알람
        Alert.alert(
            "💔 커플 연결 끊기 💔",
            "커플 끊기가 완료되었습니다.",
            [
                { text: "확인", onPress: () => gotoUserInfo() },
            ],
            { cancelable: false }
        );

    const gotoUserInfo = () => { //로그인 화면으로 이동
        navigation.navigate('Login');
    }
    return (
        <View style={styles.container}>
            <Text style={styles.text}>커플 끊기가 완료되었습니다.</Text>
            <TouchableOpacity style={styles.button} onPress={breakAlert}>
                <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFF9F9',
    },
    text: {
        color: '#544848',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#FFCECE',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        width: '40%',
        marginHorizontal: 10,
    },
    buttonText: {
        color: '#544848',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CheckCoupleBreak