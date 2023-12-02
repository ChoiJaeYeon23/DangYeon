import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';

const PedometerScreen = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');// 만보기가 사용 가능한지 여부를 저장하는 상태
  const [pastStepCount, setPastStepCount] = useState(0); // 지난 24시간 동안의 걸음 수를 저장하는 상태
  const [currentStepCount, setCurrentStepCount] = useState(0);// 현재 걸음 수를 저장하는 상태
  const [location, setLocation] = useState(null); // 현재 위치를 저장하는 상태
  const [errorMsg, setErrorMsg] = useState(null); // 오류 메시지를 저장하는 상태

  let subscription = null; // subscription을 외부 변수로 선언

  // 위치 정보를 가져오는 함수
  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("위치 권한 필요", "앱이 위치 정보에 접근하려면 위치 권한이 필요합니다.");
      setErrorMsg('위치 권한이 거부되었습니다.');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });

    // 상대방의 위치 데이터를 서버로부터 가져옴 (가정)
    let partnerLocation = await getPartnerLocationFromServer();

    // 두 위치가 일정 거리 이내인지 확인 (예: 100미터 이내)
    if (isWithinDistance(currentLocation, partnerLocation, 100)) {
      Alert.alert("알람", "사랑의 걸음, 함께 시작해볼까요?");
    }
  };

  // 두 위치가 주어진 거리 이내에 있는지 확인하는 함수
  const isWithinDistance = (loc1, loc2, maxDistance) => {
    let distance = getDistanceBetweenLocations(loc1.coords, loc2.coords);
    return distance <= maxDistance;
  };

  // 각 위치의 위도와 경도 값으로 이 공식을 사용하여 어떤 지점에서든 두 위치 사이의 거리 계산 가능
  // 위도 경도 달라져도 동일하게 공식 적용
  // 두 위치 사이의 거리 계산 함수 Haversine 공식 사용
  const getDistanceBetweenLocations = (coords1, coords2) => {
    const toRadians = (degree) => degree * (Math.PI / 180);
  
    const earthRadiusKm = 6371; // 지구의 반경 6,371km
  
    const dLat = toRadians(coords2.latitude - coords1.latitude);
    const dLon = toRadians(coords2.longitude - coords1.longitude);
  
    const lat1 = toRadians(coords1.latitude);
    const lat2 = toRadians(coords2.latitude);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  
    return earthRadiusKm * c;
  };
  
  // 상대방 위치 데이터를 서버로부터 가져오는 함수 (가상 구현)
  const getPartnerLocationFromServer = async () => {
    // 서버로부터 상대방 위치 데이터를 받아오는 로직 구현
    try {
      // 서버 URL 및 필요한 인증 정보 (예: 사용자 토큰)
      const url = "";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 인증 토큰이 필요한 경우 아래 헤더에 추가
          // "Authorization": "Bearer YOUR_TOKEN"
        }
      });

      if (!response.ok) {
        throw new Error('서버로부터 응답을 받는 데 실패했습니다.');
      }
      const data = await response.json();
      return data; // 서버로부터 받은 위치 데이터
    } catch (error) {
      console.error("서버 요청 실패:", error);
      return null; // 에러 발생 시 null 반환
    }
  };

  useEffect(() => {
    // 만보기 기능 사용 가능 여부 확인
    Pedometer.isAvailableAsync().then(isAvailable => {
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        // 지난 24시간 동안의 걸음 수 가져오기
        Pedometer.getStepCountAsync(start, end).then(pastStepCountResult => {
          setPastStepCount(pastStepCountResult.steps);
        });

        // 실시간 걸음 수 감시 시작
        subscription = Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps);
        });
      }
    });

    getLocationAsync(); // 위치 정보 가져오기

    // 구독 해제
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>만보기 기능 사용 가능 여부 : {isPedometerAvailable}</Text>
      <Text>지난 24시간 동안 걸음 수 : {pastStepCount}</Text>
      <Text>현재 걸음 수 : {currentStepCount}</Text>
      {errorMsg ? <Text>오류: {errorMsg}</Text> : null}
      {location ? <Text>현재 위치: {JSON.stringify(location)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PedometerScreen
