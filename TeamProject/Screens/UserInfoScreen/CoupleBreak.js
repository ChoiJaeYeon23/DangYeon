import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const CoupleBreak = ({ navigation }) => {

    const gotoLogin = () => { //로그인 화면으로 이동
        navigation.navigate('Login');
    }
    return (
        <View style={styles.container}>
            <Text style={styles.text}>커플 끊기가 완료되었습니다.</Text>
            <TouchableOpacity style={styles.button} onPress={gotoLogin}>
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
        alignItems: 'center',
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
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        marginTop: 25,
    },
    buttonText: {
        color: '#544848',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default CoupleBreak