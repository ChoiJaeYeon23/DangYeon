import React, { useState, useEffect } from 'react';
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
  const [candies, setCandies] = useState(0); // 획득한 캔디 수

  let subscription = null; // subscription을 외부 변수로 선언

  // 위치 정보를 가져오는 함수
  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("위치 권한 필요", "앱이 위치 정보에 접근하려면 위치 권한이 필요합니다.");
      setErrorMsg('위치 권한이 거부되었습니다.');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
    setLocation(currentLocation); // 현재 위치 상태 업데이트

    // 여기에 서버로부터 상대방의 위치를 가져오는 로직을 구현하시면 됩니다.
    // 예시로, 하드코딩된 상대방 위치를 사용합니다.
    let partnerLocation = { /* 상대방 위치 데이터 */ };

    // 두 위치가 일정 거리 이내인지 확인 (예: 100미터 이내)
    // partnerLocation이 유효한지 확인
    if (partnerLocation && partnerLocation.coords && currentLocation && currentLocation.coords) {
      if (isWithinDistance(currentLocation, partnerLocation, 100)) {
        Alert.alert("알람", "사랑의 걸음, 함께 시작해볼까요?");
      }
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

  // 캔디 보상을 확인하는 함수
  const checkForCandyReward = async (steps) => {
    try {
      const candyMilestones = [1000, 5000, 10000]; // 캔디 보상 단계
      let earnedCandies = 0;

      for (const milestone of candyMilestones) {
        if (steps >= milestone) {
          earnedCandies += 1;
        }
      }

      const storedCandies = await AsyncStorage.getItem('@candies');
      if (storedCandies !== null) {
        earnedCandies += parseInt(storedCandies);
      }

      if (earnedCandies > candies) {
        Alert.alert("축하합니다!", `새로운 캔디를 획득했습니다! 총 캔디 수: ${earnedCandies}`);
        setCandies(earnedCandies);
        AsyncStorage.setItem('@candies', earnedCandies.toString());
      }
    } catch (error) {
      console.error('캔디 보상 확인 중 오류 발생:', error);
    }
  };

  const storeData = async () => { // 현재 걸음 수 저장
    try {
      await AsyncStorage.setItem('@currentStepCount', currentStepCount.toString());
      await AsyncStorage.setItem('@candies', candies.toString());
    } catch (error) {
      console.error('데이터 저장 중 오류 발생:', error);
    }
  };

  const loadData = async () => { // 현재 걸음 수 불러오기
    try {
      const storedSteps = await AsyncStorage.getItem('@currentStepCount');
      const storedCandies = await AsyncStorage.getItem('@candies');

      if (storedSteps !== null) {
        setCurrentStepCount(parseInt(storedSteps, 10));
      }
      if (storedCandies !== null) {
        setCandies(parseInt(storedCandies, 10));
      }
    } catch (error) {
      console.error('데이터 불러오기 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    loadData(); // 앱 시작 시 현재 걸음 수 불러오기
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
          checkForCandyReward(result.steps).then(() => {
            console.log(`현재 걸음 수: ${result.steps}, 획득한 캔디 수: ${candies}`);
          });
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
  }, [currentStepCount, candies]);

  useEffect(() => {
    storeData(); // 현재 걸음 수와 캔디 수 저장
  }, [currentStepCount, candies]);

  return (
    <View style={styles.container}>
      <Text>만보기 기능 사용 가능 여부 : {isPedometerAvailable}</Text>
      <Text>지난 24시간 동안 걸음 수 : {pastStepCount}</Text>
      <Text>현재 걸음 수 : {currentStepCount}</Text>
      {errorMsg ? <Text>오류: {errorMsg}</Text> : null}
      <Text>획득한 캔디 수: {candies}</Text>
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
