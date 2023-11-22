import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native'

const CheckCoupleBreak = ({ navigation }) => {
    const breakAlert = () => //연결 끊기 알람
        Alert.alert(
            "💔 커플 연결 끊기 💔",
            "기록된 데이터들은 전부 삭제돼요. 정말로 끊으시겠습니까?",
            [
                { text: "취소", onPress: () => { } },
                { text: "연결 끊기", onPress: () => gotoCoupleBreak() },
            ],
            { cancelable: false }
        );

    const gotoCoupleBreak = () => { //커플 연결 끊기 화면으로 이동
        navigation.navigate('CoupleBreak');
    }

    const gotoUserInfo = () => { //내 정보 화면으로 이동
        navigation.navigate('UserInfo');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>커플 연결 끊기💔</Text>
            <Text style={styles.text2}>정말 커플 연결을 끊으시겠어요?</Text>
            <View style={{ flex: 1 }} />
            <View style={{ alignItems: 'center' }}>
                <Image style={styles.image}
                    source={require('../../assets/heart-break.gif')}
                />
            </View>
            <Text style={styles.bottomText}>기록된 데이터들은 전부 삭제돼요.</Text>
            <Text style={styles.bottomText}>데이터는 복구 할 수 없어요.</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={breakAlert}>
                    <Text style={styles.buttonText}>연결 끊기💔</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={gotoUserInfo}>
                    <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
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
    text2: {
        color: '#544848',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 30,
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: "40%",
    },
    bottomText: {
        color: '#544848',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#FFCECE',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        width: '40%',
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
    },
    buttonText: {
        color: '#544848',
        fontSize: 16,
        fontWeight: 'bold',
    },
});



export default CheckCoupleBreak