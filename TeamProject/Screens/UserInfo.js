import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Platform
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import calendar from '../assets/calendar.png';
import { launchImageLibrary } from 'react-native-image-picker';

const UserInfo = ({ navigation }) => {
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [meetingDay, setMeetingDay] = useState('');

    const [date, setDate] = useState(new Date()); // 날짜 picker
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isBirthdayPickerVisible, setIsBirthdayPickerVisible] = useState(false); //생년월일 picker
    const [isMeetingDayPickerVisible, setIsMeetingDayPickerVisible] = useState(false); //처음 만난 날 picker
    const [profilePic, setProfilePic] = useState(null); // 프로필 사진

    // 생년월일 변경
    const onBirthdayChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setIsBirthdayPickerVisible(Platform.OS === 'ios');
        setBirthday(currentDate.toISOString().split('T')[0]);
    };

    // 처음 만난 날 변경
    const onMeetingDayChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setIsMeetingDayPickerVisible(Platform.OS === 'ios');
        setMeetingDay(currentDate.toISOString().split('T')[0]);
    };

    // 생년월일 표시
    const showBirthdayPicker = () => {
        setIsBirthdayPickerVisible(true);
    };

    // 처음 만난 날 표시
    const showMeetingDayPicker = () => {
        setIsMeetingDayPickerVisible(true);
    };
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios' ? true : false);
        setDate(currentDate);
        setBirthday(currentDate.toISOString().split('T')[0]); // 날짜 포맷을 "YYYY-MM-DD"로 설정
    };

    const showDatepicker = () => {
        setShowDatePicker(true); // 날짜 선택기를 표시하기 위한 상태를 true로 설정
    };

    // 이름 입력을 처리하는 함수
    const handleNameChange = text => {
        if ([...text].length <= 6) { // 한글을 포함한 문자열의 길이 계산
            setName(text);
        }
    };

    // 사진 선택하는 함수
    const handleChoosePhoto = () => {
        const options = {
            noData: true,
        };

        launchImageLibrary(options, response => {
            if (response.uri) {
                setProfilePic(response);
            }
        });
    };

    const couplebreak = () => { //커플 연결 끊기 화면으로 이동 (이름 수정 필요)
        navigation.navigate('Calendar');
    };

    const goToLogout = () => { //로그아웃 화면으로 이동 (이름 수정 필요)
        navigation.navigate('Calendar');
    };

    const Separator = () => <View style={styles.separator} />;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleChoosePhoto} style={styles.iconContainer}>
                    <Image source={require('../assets/imageicon.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.titleText}>수쨩 💖 OO</Text>
            </View>
            <Separator />
            <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>이름</Text>
                <TextInput
                    onChangeText={handleNameChange}
                    value={name}
                    placeholder="수쨩"
                    style={styles.input}
                />
            </View>
            <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>생년월일</Text>
                <View style={styles.dateInputContainer}>
                    <TextInput
                        value={birthday}
                        placeholder="2003-02-17"
                        style={styles.dateInput}
                        editable={false}
                    />
                    <TouchableOpacity onPress={showBirthdayPicker}>
                        <Image source={calendar} style={styles.calendar} />
                    </TouchableOpacity>
                </View>
                {isBirthdayPickerVisible && (
                    <DateTimePicker
                        testID="birthdayPicker"
                        value={birthday ? new Date(birthday) : new Date()}
                        mode="date"
                        display="default"
                        onChange={onBirthdayChange}
                    />
                )}
            </View>
            <View style={styles.inputRowColumn}>
                <Text style={styles.inputLabel}>혈액형</Text>
                {/* <Picker
                    selectedValue={bloodType}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                        setBloodType(itemValue)
                    }>
                    <Picker.Item label="A형" value="A" />
                    <Picker.Item label="B형" value="B" />
                    <Picker.Item label="O형" value="O" />
                    <Picker.Item label="AB형" value="AB" />
                </Picker> */}
            </View>
            <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>처음 만난 날</Text>
                <View style={styles.dateInputContainer}>
                    <TextInput
                        value={meetingDay}
                        placeholder="2023-10-17"
                        style={styles.dateInput}
                        editable={false}
                    />
                    <TouchableOpacity onPress={showMeetingDayPicker}>
                        <Image source={calendar} style={styles.calendar} />
                    </TouchableOpacity>
                </View>
                {isMeetingDayPickerVisible && (
                    <DateTimePicker
                        testID="meetingDayPicker"
                        value={meetingDay ? new Date(meetingDay) : new Date()}
                        mode="date"
                        display="default"
                        onChange={onMeetingDayChange}
                    />
                )}
                {/* <Separator /> */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.Button}>
                        <Text style={styles.ButtonText}>저장</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={couplebreak} style={styles.Button2}>
                        <Text style={styles.ButtonText2}>커플 연결 끊기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goToLogout} style={styles.Button2}>
                        <Text style={styles.ButtonText2}>로그아웃</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    headerContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    titleText: {
        textAlign: 'center',
        color: '#544848',
        fontSize: 22,
        fontWeight: 'bold',
    },
    iconContainer: {
        marginRight: 20,
    },
    icon: {
        width: 30,
        height: 30,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '60%',
        marginBottom: 15,
    },
    inputRowColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '60%',
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 18,
        color: '#544848',
        textAlign: 'center',
    },
    input: {
        height: 40,
        width: '70%',
        borderBottomWidth: 1,
        borderBottomColor: '#A0A0A0',
        color: '#A0A0A0',
        marginBottom: 15,
        fontSize: 18,
        textAlign: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 20, 
    },
    Button: {
        backgroundColor: '#FFCECE',
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: '60%',
        marginTop: 20,
    },
    ButtonText: {
        color: '#544848',
        fontSize: 16,
        fontWeight: 'bold',
    },
    Button2: {
        marginTop: 10,
        alignSelf: 'center',
        width: '60%',
    },
    ButtonText2: {
        color: '#544848',
        fontSize: 16,
    },
    separator: {
        height: 1,
        width: '80%',
        backgroundColor: '#737373',
        marginVertical: 15,
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '60%',
        borderBottomWidth: 1,
        borderBottomColor: '#A0A0A0',
        marginBottom: 15,
    },
    dateInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        textAlign: 'center',
        color: '#A0A0A0',
    },
    calendar: {
        marginLeft: 10,
        width: 25,
        height: 25,
    },
    picker: {
        height: 30,
        width: '70%',
        alignSelf: 'center',
    },
});

export default UserInfo;
