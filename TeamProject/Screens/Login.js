import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigation = useNavigation();

  const resetInputs = () => {
    setId("");
    setPw("");
  };

  const handleLogin = () => {
    const inputData = {
      id: id,
      pw: pw,
    };

    fetch("http://3.34.6.50:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키를 포함하여 요청
      body: JSON.stringify(inputData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "서버 상태 응답이 올바르지 않습니다: " + response.status
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("서버 응답:", data); // 서버 응답 로깅
        resetInputs();
        if (data.status === "redirect") {
          // connect_id_me가 있는 경우 MainTab 화면으로 이동
          alert("로그인 성공!");
          navigation.navigate("MainTab");
        } else if (data.status === "stay") {
          // connect_id_me가 없는 경우 Connect 화면으로 이동
          alert("로그인 성공!");
          navigation.navigate("Connect");
        } else {
          // 예상치 못한 응답의 경우
          alert("로그인 상태를 확인할 수 없습니다.");
        }
      })
      .catch((error) => {
        console.error("로그인 과정에서 오류 발생:", error); // 오류 로깅
        alert("로그인 실패: " + error.message);
      });
  };

  const navigateToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={id}
        onChangeText={setId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={pw}
        secureTextEntry={true}
        onChangeText={setPw}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MainTab")}
      >
        <Text style={styles.buttonText}>로그인1111</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.signupButton]}
        onPress={navigateToSignUp}
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#1EC800",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#4A90E2", // 회원가입 버튼 색상
  },
});

export default Login;
