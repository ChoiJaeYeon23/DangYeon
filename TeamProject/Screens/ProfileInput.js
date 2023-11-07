import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";

const ProfileInput = ({ navigation }) => {
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [meetingDay, setMeetingDay] = useState('');
    const [gender, setGender] = useState(null); // 성별 상태 추가

    const goToNickNameInput = () => {
        navigation.navigate('NickNameInput');
    };

    const Separator = () => <View style={styles.separator} />;

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>연결 성공!</Text>
            <Text style={styles.titleText}>프로필을 입력해주세요.</Text>
            <Separator />
            <View style={styles.genderContainer}>
                <TouchableOpacity
                    style={[styles.genderButton, gender === '여성' && styles.selectedGender]}
                    onPress={() => setGender('여성')}>
                    <Text style={styles.genderText}>여성</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.genderButton, gender === '남성' && styles.selectedGender]}
                    onPress={() => setGender('남성')}>
                    <Text style={styles.genderText}>남성</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>이름</Text>
                <TextInput
                    onChangeText={setName}
                    value={name}
                    placeholder="최대 6글자 이내"
                    style={styles.input}
                />
            </View>
            <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>생년월일</Text>
                <TextInput
                    onChangeText={setBirthday}
                    value={birthday}
                    placeholder="00.00.00"
                    style={styles.input}
                />
            </View>
            <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>혈액형</Text>
                <TextInput
                    onChangeText={setBloodType}
                    value={bloodType}
                    placeholder="혈액형 입력"
                    style={styles.input}
                />
            </View>
            <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>처음 만난 날</Text>
                <TextInput
                    onChangeText={setMeetingDay}
                    value={meetingDay}
                    placeholder="00.00.00"
                    style={styles.input}
                />
            </View>
            <TouchableOpacity onPress={goToNickNameInput} style={styles.connectButton}>
                <Text style={styles.connectButtonText}>완료</Text>
            </TouchableOpacity>
        </View>
    );
};

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
        fontSize: 18,
        fontWeight: 'bold',
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    genderButton: {
        padding: 10,
        marginHorizontal: 10,
    },
    selectedGender: {
        borderBottomWidth: 2,
        borderBottomColor: '#FFCECE',
    },
    genderText: {
        fontSize: 16,
        color: '#544848',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '60%',
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        width: '40%',
        color: '#544848',
    },
    input: {
        height: 40,
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: '#A0A0A0',
        color: '#A0A0A0',
        marginBottom: 15,
        fontSize: 16,
        textAlign: 'center',
    },
    connectButton: {
        backgroundColor: '#FFCECE',
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    connectButtonText: {
        color: '#544848',
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        width: '70%',
        backgroundColor: '#737373',
        marginVertical: 15,
    },
});

export default ProfileInput;