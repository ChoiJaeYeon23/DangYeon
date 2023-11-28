import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
    const [name, setName] = useState(''); //이름
    const [birthday, setBirthday] = useState(''); //생년월일
    const [meetingDay, setMeetingDay] = useState(''); //처음 만난 날
    const [bloodType, setBloodType] = useState(''); //혈액형
    const navigation = useNavigation();

    const resetInputs = () => { // 초기화 함수
        setName("");
        setBirthday("");
        setMeetingDay("");
        setBloodType("");
    };

    const SignUp = () => {
        alert("회원가입 성공!");
        resetInputs();
        navigation.navigate("Connect");
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.inputTT}
                placeholder="이름"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.inputTT}
                placeholder="생년월일"
                secureTextEntry
                value={birthday}
                onChangeText={setBirthday}
            />
            <TextInput
                style={styles.inputTT}
                placeholder="처음 만난 날"
                secureTextEntry
                value={meetingDay}
                onChangeText={setMeetingDay}
            />
            <TextInput
                style={styles.inputTT}
                placeholder="혈액형"
                secureTextEntry
                value={bloodType}
                onChangeText={setBloodType}
            />
            <TouchableOpacity style={styles.loginBtn} onPress={SignUp}>
                <Text style={styles.loginText}>회원가입 완료</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>로그인 화면으로 돌아가기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF9F9",
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

export default SignUp;
