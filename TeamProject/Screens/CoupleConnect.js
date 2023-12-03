import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Clipboard from "expo-clipboard";

const CoupleConnect = ({ navigation }) => {
  const [generatedRandom, setGeneratedRandom] = useState("");
  const [text, setText] = useState("");

  // 초대코드를 DB에 저장하도록 서버에 요청하는 코드
  const goToProfileInput = () => {
    // 입력된 코드가 생성된 코드와 동일한지 확인
  if (text === generatedRandom) {
    Alert.alert("오류", "자신의 코드는 입력할 수 없습니다.");
    return;
  }
    const data = {
      connect_id: text,
    };
    fetch("http://3.34.6.50:8080/api/save-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(
            "Server Response: ",
            response.status,
            response.statusText
          );
          throw new Error(
            `Server Error: ${response.status} ${response.statusText}`
          );
        }
      })
      .then((data) => {
        Alert.alert("성공", "초대 코드가 맞습니다!");
        navigation.navigate("MainTab");
      })
      .catch((error) => {
        console.error("Error saving data :", error);
        Alert.alert("실패", "초대 코드가 다릅니다!");
      });
  };

  const onChangeText = (inputText) => {
    setText(inputText);
  };

  const copyToClipboard = () => {
    const randomNum7Digits = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
    const uniqueNumber = randomNum7Digits; // 7자리의 난수를 선택
    setGeneratedRandom(uniqueNumber.toString());
    Clipboard.setString(uniqueNumber.toString());
    Alert.alert("복사", `클립보드에 복사된 숫자: ${uniqueNumber}`);
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token !== null) {
          // 토큰 사용
        }
      } catch (error) {
        console.error("토큰 가져오기 실패", error);
      }
    };

    getToken();
  }, []);

  const Separator = () => <View style={styles.separator} />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={false}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.container}>
          <Text style={styles.titleText}>서로의 초대코드를 입력하세요.</Text>
          <Separator />
          <Text style={styles.codeTitle}>내 초대코드</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.code}>{generatedRandom}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
              <Text style={styles.buttonText}>복사</Text>
            </TouchableOpacity>
          </View>
          <Separator />
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>상대방의 초대코드를 입력하세요.</Text>
            <TextInput
              onChangeText={onChangeText}
              value={text}
              placeholder="전달받은 코드 입력"
              style={styles.input}
            />
          </View>
          <TouchableOpacity onPress={goToProfileInput} style={styles.connectButton}>
            <Text style={styles.connectButtonText}>연결하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.connectButton}
          >
            <Text style={styles.connectButtonText}>로그인 화면으로 이동하기</Text>
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
    marginBottom: 20,
    color: "#544848",
    fontSize: 24,
    fontWeight: "bold",
  },
  codeContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeTitle: {
    textAlign: "center",
    fontSize: 22,
    marginBottom: 20,
    color: "#544848",
    fontWeight: "bold",
  },
  code: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 8,
    marginLeft: 90,
  },
  button: {
    backgroundColor: "#EBDBDB",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    marginRight: 40,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
  inputContainer: {
    width: "100%",
  },
  inputTitle: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 18,
    marginBottom: 10,
    color: "#544848",
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    width: "80%",
    borderBottomColor: "#A0A0A0",
    marginBottom: 15,
    fontSize: 18,
    textAlign: "center",
    alignSelf: "center",
  },
  connectButton: {
    backgroundColor: "#FFCECE",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
  },
  connectButtonText: {
    textAlign: "center",
    color: "#544848",
    fontWeight: "bold",
    fontSize: 20,
  },
  separator: {
    height: 1,
    width: "80%",
    backgroundColor: "#737373",
    marginBottom: 50,
  },
});

export default CoupleConnect;
