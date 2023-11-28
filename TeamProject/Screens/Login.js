import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
  TextInput,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from "expo-auth-session";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [token, setToken] = useState(null);
  const [id, setID] = useState("");
  const [pw, setPW] = useState("");
  const navigation = useNavigation();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://3.34.6.50:8080");
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // const handleLogin = () => {
  //   if (socket && id && pw) {
  //     socket.emit("login check", { id: id, pw: pw });
  //     console.log(id);
  //     console.log(pw);
  //     setID("");
  //     setPW("");
  //   }
  // };

  const users = [
    //임시값
    { ID: "W2-rLkQcC4BYncLnw2qi5HTn256k-ZbswtV4m3GZAAM", PW: "456" },
    { ID: "aaa", PW: "111" },
  ];

  const handleLogin = () => { //로컬 로그인
    const user = users.find((u) => u.ID === id && u.PW === pw);

    if (user) {
      alert("로그인 성공");
      AsyncStorage.setItem('userId', id);
      resetInputs();
      navigation.navigate("Connect", { id });
    } else {
      alert("ID 또는 비밀번호가 잘못되었습니다.");
      resetInputs();
    }
  };

  useEffect(() => { //로컬
    const loadUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          // userId를 사용하는 로직
        }
      } catch (error) {
        console.error("사용자 ID를 가져오는 데 실패했습니다", error);
      }
    };
    loadUserId();
  }, []);

  //네이버
  //  네이버 로그인 설정
  const clientId = "OqbYyPi3lOqgNJuqAvXL";
  const redirectUri = "http://3.34.6.50:8080/auth/naver/callback";

  const resetInputs = () => {
    // 초기화 함수
    setID("");
    setPW("");
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      responseType: ResponseType.Code,
      scopes: ["name"],
      extraParams: { state: "STATE" },
    },
    {
      authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
      tokenEndpoint: "https://nid.naver.com/oauth2.0/token",
    }
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      fetch(`http://3.34.6.50:8080/auth/naver/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          setToken(data.access_token); // 토큰 저장
          AsyncStorage.setItem('userToken', data.access_token); // AsyncStorage에 토큰 저장
          return fetchUserInfo(data.access_token); // 사용자 정보 가져오기
        })
        .then((userInfo) => {
          if (userInfo) {
            navigation.navigate("Connect", { userInfo }); // Connect 화면으로 이동
          } else {
            throw new Error("User info not found");
          }
        })
        .catch((error) => {
          console.error("네이버 로그인 인증 오류:", error);
          Alert.alert("로그인 오류", "네이버 로그인 인증에 실패했습니다.");
        });
    } else {
      console.log("실패");
      WebBrowser.dismissBrowser(); // 브라우저 창 닫기
    }
  }, [response, navigation]);

  // 토큰을 사용하여 사용자 정보를 가져오는 함수입니다.
  async function fetchUserInfo(accessToken) {
    try {
      const response = await fetch(`http://3.34.6.50:8080/api/user-info`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userInfo = await response.json();
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo)); // 로컬 스토리지에 사용자 정보 저장
      return userInfo;
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      throw new Error("Failed to fetch user information.");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputTT}
        placeholder="아이디"
        value={id}
        onChangeText={setID}
      />
      <TextInput
        style={styles.inputTT}
        placeholder="비밀번호"
        secureTextEntry
        value={pw}
        onChangeText={setPW}
      />
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>
      <View style={styles.container2}>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.loginText}>회원가입 l </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.loginText}> 비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          promptAsync({ useProxy: false });
          navigation.navigate('SignUp')
        }}
        disabled={!request}
      >
        <Image
          source={require("../assets/Naver/btnG_아이콘원형.png")}
          style={{ width: 70, height: 70 }}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF9F9",
  },
  container2: {
    flexDirection: "row",
    marginBottom: 30,
    textAlign: "center",
    marginLeft: 10,
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
    backgroundColor: 'white',
    borderWidth: 2,
    marginBottom: 10,
  },
  loginText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Login;
