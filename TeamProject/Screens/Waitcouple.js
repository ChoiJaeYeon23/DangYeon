import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Waitcouple = () => {
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://3.34.6.50:8080/api/check-couple-status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.connected) {
          // 연결된 경우 isConnected 상태를 true로 설정
          setIsConnected(true);
          // 연결된 경우 Main 화면으로 이동
          navigation.navigate('Main');
        } else {
          // 연결되지 않은 경우 isConnected 상태를 false로 유지
          setIsConnected(false);
        }
      })
      .catch(error => {
        console.error('Error checking couple status:', error);
        setIsConnected(false);
      });
    }, 10000); // 10초마다 실행

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isConnected ? (
        <Text>연결되었습니다. 메인 화면으로 이동합니다.</Text>
      ) : (
        <>
          <ActivityIndicator size="large" />
          <Text>상대방 연결을 기다리는 중...</Text>
        </>
      )}
    </View>
  );
};

export default Waitcouple;
