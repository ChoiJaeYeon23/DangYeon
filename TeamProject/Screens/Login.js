import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthRequest, ResponseType } from 'expo-auth-session';

  const clientId = "OqbYyPi3lOqgNJuqAvXL";
  const redirectUri = "http://3.34.6.50:8080/auth/naver/callback";

const config = {
  clientId,
  redirectUri,
  responseType: ResponseType.Code,
  scopes: ["name"],
  extraParams: { state: "963zgWM3yy-ZNG_mqDV70g" }, // 랜덤 상태 값
};

const discovery = {
  authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
  tokenEndpoint: "https://nid.naver.com/oauth2.0/token",
};

const Login= () => {
  const [request, response, promptAsync] = useAuthRequest(config, discovery);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (request) {
            promptAsync();
          }
        }}
      >
        <Text style={styles.buttonText}>네이버 로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1EC800',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Login;