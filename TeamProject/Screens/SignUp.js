import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
  const [username, setName] = useState(""); //이름
  const [id, setId] = useState(""); //아이디 중복처리가 안되게 해야함
  const [pw, setPw] = useState(""); //비밀번호 중복이 되도 가능
  const [birthday, setBirthday] = useState(""); //생년월일
  const [meetingDay, setMeetingDay] = useState(""); //처음 만난 날
  const [bloodType, setBloodType] = useState(""); //혈액형
  const navigation = useNavigation();

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
    const userData = {
      username: username,
      id: id,
      pw: pw,
      birthday: birthday,
      meetingDay: meetingDay,
      bloodType: bloodType,
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
        alert("회원가입 성공!");
        resetInputs();
        navigation.navigate("Login");
      })
      .catch((error) => {
        alert("회원가입 실패: " + error.message);
      });
  };

  // ID 중복 체크 함수
  const checkIdDuplicate = () => {
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
        } else {
          alert("사용 가능한 아이디입니다.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // 중복 확인 버튼
  <TouchableOpacity onPress={checkIdDuplicate}>
    <Text>중복 확인</Text>
  </TouchableOpacity>;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputTT}
        placeholder="이름"
        value={username}
        onChangeText={setName}
      />
      <TextInput
        style={styles.inputTT}
        placeholder="ID"
        value={id}
        onChangeText={setId}
      />
      <TextInput
        style={styles.inputTT}
        placeholder="PassWord"
        value={pw}
        onChangeText={setPw}
      />
      <TextInput
        style={styles.inputTT}
        placeholder="생년월일"
        value={birthday}
        onChangeText={setBirthday}
      />
      <TextInput
        style={styles.inputTT}
        placeholder="처음 만난 날"
        value={meetingDay}
        onChangeText={setMeetingDay}
      />
      <TextInput
        style={styles.inputTT}
        placeholder="혈액형"
        value={bloodType}
        onChangeText={setBloodType}
      />
      <TouchableOpacity onPress={checkIdDuplicate}>
        <Text>중복 확인</Text>
      </TouchableOpacity>
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
