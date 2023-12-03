import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
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
          alert("로그인 성공!");
          navigation.navigate("MainTab");
        } else if (data.status === "stay") {
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
      <Text style={styles.titleText}>DangYeon을 이용하시려면</Text>
      <Text style={styles.titleText}>로그인을 해주세요!</Text>
      <Image style={styles.image} source={require("../assets/Heart.jpg")} />
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
      <TouchableOpacity onPress={() => navigation.navigate("MainTab")}>
        <Text style={styles.buttonText}>로그인1111</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFF9F9',
  },
  titleText: {
    textAlign: 'center',
    marginBottom: 5,
    color: '#544848',
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 155,
    marginTop: 20,
    marginBottom: 30,
  },
  input: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    height: 45,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 7,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  button: {
    width: '75%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFCECE',
    borderWidth: 1,
    marginTop: 10,
  },
  buttonText: {
    color: '#544848',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Login;
