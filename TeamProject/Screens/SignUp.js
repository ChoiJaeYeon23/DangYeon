import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  Modal,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
  const [username, setName] = useState(""); //이름
  const [id, setId] = useState(""); //아이디 중복처리가 안되게 해야함
  const [pw, setPw] = useState(""); //비밀번호 중복이 되도 가능
  const [gender, setGender] = useState(null); // 성별 상태 추가
  const [birthday, setBirthday] = useState(""); //생년월일
  const [meetingDay, setMeetingDay] = useState(""); //처음 만난 날
  const [bloodType, setBloodType] = useState(""); //혈액형
  const [isBirthdayPickerVisible, setIsBirthdayPickerVisible] = useState(false); //생년월일 picker
  const [isMeetingDayPickerVisible, setIsMeetingDayPickerVisible] =
    useState(false); //처음 만난 날 picker
  const [isBloodTypeModalVisible, setIsBloodTypeModalVisible] = useState(false); // 혈액형 모달
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const navigation = useNavigation();

  const validateInput = () => {
    if (!gender) return "성별을 선택해주세요.";
    if (!username) return "이름을 입력해주세요.";
    if (!id) return "아이디를 입력해주세요.";
    if (!pw) return "비밀번호를 입력해주세요.";
    if (!birthday) return "생년월일을 입력해주세요.";
    if (!meetingDay) return "처음 만난 날을 입력해주세요.";
    if (!bloodType) return "혈액형을 선택해주세요.";
    return "";
  };

  const resetInputs = () => {
    // 초기화 함수
    setName("");
    setId("");
    setPw("");
    setBirthday("");
    setMeetingDay("");
    setBloodType("");
  };

  const SignUp = () => {
    const error = validateInput();
    if (error) {
      setErrorMessage(error);
      return; // 에러가 있으면 여기서 함수 종료
    }

    const userData = {
      username: username,
      id: id,
      pw: pw,
      birthday: birthday,
      meetingDay: meetingDay,
      bloodType: bloodType,
      gender: gender,
    };

    // 서버로 회원가입 요청을 보냄
    fetch("http://3.34.6.50:8080/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("회원가입 완료!"); // 회원가입 성공 알림
        saveUserInfo(userData);
        resetInputs();
        navigation.navigate("Login"); // 로그인 화면으로 이동
      })
      .catch((error) => {
        alert("회원가입 실패: " + error.message);
      });
  };

  // 회원 정보 저장 함수
  const saveUserInfo = async (userData) => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(userData));
      console.log("회원 정보 저장 성공");
    } catch (error) {
      console.error("회원 정보 저장 실패:", error);
    }
  };

  // ID 중복 체크 함수
  const checkIdDuplicate = () => {
    if (!id) {
      alert("아이디를 먼저 입력해주세요.");
      return; // 아이디가 입력되지 않았다면 함수 종료
    }

    return new Promise((resolve, reject) => {
      fetch("http://3.34.6.50:8080/api/check-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isDuplicate) {
            alert("이미 사용 중인 아이디입니다.");
            reject(new Error("이미 사용 중인 아이디입니다."));
          } else {
            alert("사용 가능한 아이디입니다.");
            resolve();
          }
        })
        .catch((error) => {
          alert("ID 중복 확인 중 오류가 발생했습니다.");
          reject(new Error("ID 중복 확인 중 오류가 발생했습니다."));
        });
    });
  };

  // 생년월일 변경
  const onBirthdayChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setIsBirthdayPickerVisible(Platform.OS === "ios");
    setBirthday(currentDate.toISOString().split("T")[0]);
  };

  // 처음 만난 날 변경
  const onMeetingDayChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setIsMeetingDayPickerVisible(Platform.OS === "ios");
    setMeetingDay(currentDate.toISOString().split("T")[0]);
  };

  // 생년월일 표시
  const showBirthdayPicker = () => {
    setIsBirthdayPickerVisible(true);
  };

  // 처음 만난 날 표시
  const showMeetingDayPicker = () => {
    setIsMeetingDayPickerVisible(true);
  };

  // 성별 선택에 따른 텍스트 스타일 변경
  const genderTextStyle = (selectedGender) => [
    styles.genderText,
    gender === selectedGender && styles.selectedGenderText,
  ];

  // 혈액형 선택 모달 표시 함수
  const showBloodTypeModal = () => {
    setIsBloodTypeModalVisible(true);
  };

  // 혈액형 선택 처리 함수
  const selectBloodType = (type) => {
    setBloodType(type);
    setIsBloodTypeModalVisible(false); // 모달 숨기기
  };

  // 혈액형 데이터
  const bloodTypes = ["A", "B", "O", "AB"];

  // 혈액형 선택 항목 렌더링 함수
  const renderBloodTypeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bloodTypeItem}
      onPress={() => selectBloodType(item)}
    >
      <Text style={styles.bloodTypeText}>{item}형</Text>
    </TouchableOpacity>
  );

  const Separator = () => <View style={styles.separator} />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS는 'padding', Android는 'height'
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
      >
        <View style={styles.container}>
          <Text style={styles.titleText}>회원가입을 진행해주세요.</Text>
          <Separator />
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>성별</Text>
            <TouchableOpacity
              style={styles.genderButton}
              onPress={() => setGender("여성")}
            >
              <Text style={genderTextStyle("여성")}>여성</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderButton}
              onPress={() => setGender("남성")}
            >
              <Text style={genderTextStyle("남성")}>남성</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>이름</Text>
            <TextInput
              style={styles.inputTT}
              placeholder="앱에서 쓰일 이름"
              value={username}
              onChangeText={setName}
              autoFocus={true}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>아이디</Text>
            <View style={styles.idInputContainer}>
              <TextInput
                style={styles.inputTT}
                placeholder="ID"
                value={id}
                onChangeText={setId}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.checkDuplicateButton}
                  onPress={checkIdDuplicate}
                >
                  <Text style={styles.checkDuplicateButtonText}>
                    ID 중복 확인
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>비밀번호</Text>
            <TextInput
              style={styles.inputTT}
              placeholder="PassWord"
              value={pw}
              onChangeText={setPw}
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
                <Image
                  source={require("../assets/calendar.png")}
                  style={styles.calendar}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerContainer}>
              {isBirthdayPickerVisible && (
                <DateTimePicker
                  value={birthday ? new Date(birthday) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onBirthdayChange}
                />
              )}
            </View>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>처음 만난 날</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                value={meetingDay}
                placeholder="0000-00-00"
                style={styles.dateInput}
                editable={false}
                onPress={showMeetingDayPicker}
              />
              <TouchableOpacity onPress={showMeetingDayPicker}>
                <Image
                  source={require("../assets/calendar.png")}
                  style={styles.calendar}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerContainer}>
              {isMeetingDayPickerVisible && (
                <DateTimePicker
                  value={meetingDay ? new Date(meetingDay) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onMeetingDayChange}
                />
              )}
            </View>
          </View>
          <View style={styles.inputRowColumn}>
            <Text style={styles.inputLabel}>혈액형</Text>
            <TouchableOpacity onPress={showBloodTypeModal}>
              <Text style={styles.bloodText}>
                {bloodType ? `${bloodType}형` : "혈액형 선택"}
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={isBloodTypeModalVisible}
              onRequestClose={() => {
                setIsBloodTypeModalVisible(false);
              }}
            >
              <TouchableOpacity
                style={styles.centeredView}
                activeOpacity={1}
                onPressOut={() => setIsBloodTypeModalVisible(false)}
              >
                <View style={styles.modalView}>
                  <FlatList
                    data={bloodTypes}
                    renderItem={renderBloodTypeItem}
                    keyExtractor={(item) => item}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
          <Separator />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <TouchableOpacity style={styles.loginBtn} onPress={SignUp}>
            <Text style={styles.loginText}>회원가입 완료</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginText}>로그인 화면으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFF9F9",
  },
  titleText: {
    textAlign: "center",
    marginBottom: 10,
    color: "#544848",
    fontSize: 24,
    fontWeight: "bold",
  },
  genderButton: {
    padding: 8,
    marginHorizontal: 10,
  },
  genderText: {
    fontSize: 20,
    color: "#544848",
  },
  selectedGenderText: {
    color: "#FF0000",
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "60%",
    marginBottom: 15,
    marginRight: 50,
  },
  idInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
  },
  inputRowColumn: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    marginBottom: 15,
    marginRight: 45,
  },
  inputTT: {
    flex: 1,
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
  inputLabel: {
    fontSize: 20,
    color: "#544848",
    textAlign: "center",
    width: "40%",
    marginRight: 15,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  checkDuplicateButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#FFCECE",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
  },
  checkDuplicateButtonText: {
    color: "#544848",
    textAlign: "center",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "65%",
    borderBottomWidth: 1,
    borderBottomColor: "#A0A0A0",
    marginBottom: 15,
  },
  dateInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    textAlign: "center",
    marginLeft: 10,
  },
  calendar: {
    marginLeft: 10,
    width: 25,
    height: 25,
  },
  datePickerContainer: {
    marginLeft: -25,
    width: "9%",
  },
  loginBtn: {
    width: "75%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#FFCECE",
    borderWidth: 1,
    marginTop: 10,
  },
  loginText: {
    color: "#544848",
    fontWeight: "bold",
    fontSize: 18,
  },
  bloodText: {
    fontSize: 18,
    textAlign: "center",
    marginLeft: 30,
  },
  bloodTypeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  bloodTypeText: {
    fontSize: 18,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    width: 200,
    height: 200,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  separator: {
    height: 1,
    width: "80%",
    backgroundColor: "#737373",
    marginVertical: 15,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default SignUp;
