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
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileInput = ({ navigation }) => {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [meetingDay, setMeetingDay] = useState('');
  const [gender, setGender] = useState(null); // 성별 상태 추가

  const [date, setDate] = useState(new Date()); // 날짜 picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isBirthdayPickerVisible, setIsBirthdayPickerVisible] = useState(false); //생년월일 picker
  const [isMeetingDayPickerVisible, setIsMeetingDayPickerVisible] = useState(false); //처음 만난 날 picker
  const [profilePic, setProfilePic] = useState(null); // 프로필 사진

  const goToMain = () => { //메인 화면으로 이동
    navigation.navigate('Main');
};

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

  // 성별 선택에 따른 텍스트 스타일 변경
  const genderTextStyle = (selectedGender) => [
    styles.genderText,
    gender === selectedGender && styles.selectedGenderText
  ];

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

  const Separator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>연결 성공!</Text>
      <Text style={styles.titleText}>프로필을 입력해주세요.</Text>
      <Separator />
      <View style={styles.genderContainer}>
      <TouchableOpacity onPress={handleChoosePhoto} style={styles.iconContainer}>
          <Image source={require('../assets/calendar.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.genderButton}
          onPress={() => setGender('여성')}>
          <Text style={genderTextStyle('여성')}>여성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.genderButton}
          onPress={() => setGender('남성')}>
          <Text style={genderTextStyle('남성')}>남성</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>이름</Text>
        <TextInput
          onChangeText={handleNameChange}
          value={name}
          placeholder="최대 6글자 이내"
          style={styles.input}
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>생년월일</Text>
        <View style={styles.dateInputContainer}>
          <TextInput
            value={birthday}
            placeholder="0000-00-00"
            style={styles.dateInput}
            editable={false}
          />
          <TouchableOpacity onPress={showBirthdayPicker}>
            <Image source={require('../assets/calendar.png')} style={styles.calendar} />
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
        <Picker
          selectedValue={bloodType}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) =>
            setBloodType(itemValue)
          }>
          <Picker.Item label="A형" value="A" />
          <Picker.Item label="B형" value="B" />
          <Picker.Item label="O형" value="O" />
          <Picker.Item label="AB형" value="AB" />
        </Picker>
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>처음 만난 날</Text>
        <View style={styles.dateInputContainer}>
          <TextInput
            value={meetingDay}
            placeholder="0000-00-00"
            style={styles.dateInput}
            editable={false}
          />
          <TouchableOpacity onPress={showMeetingDayPicker}>
            <Image source={require('../assets/calendar.png')} style={styles.calendar} />
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
      </View>
      <TouchableOpacity style={styles.connectButton} onPress={goToMain}>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginRight: 5,
  },
  icon: {
    width: 30,
    height: 30, 
  },
  genderButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  genderText: {
    fontSize: 18,
    color: '#544848',
  },
  selectedGenderText: {
    color: '#FF0000',
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
    width: '60%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 18,
    color: '#544848',
    textAlign: 'center',
    width: '40%',
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

export default ProfileInput;