import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';

const PedometerScreen = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');// 만보기가 사용 가능한지 여부를 저장하는 상태
  const [pastStepCount, setPastStepCount] = useState(0); // 지난 24시간 동안의 걸음 수를 저장하는 상태
  const [currentStepCount, setCurrentStepCount] = useState(0);// 현재 걸음 수를 저장하는 상태
  const [location, setLocation] = useState(null); // 현재 위치를 저장하는 상태
  const [errorMsg, setErrorMsg] = useState(null); // 오류 메시지를 저장하는 상태
  const [isTogether, setIsTogether] = useState(false); // 커플이 함께 있는지 여부
  const [candies, setCandies] = useState({ 1000: 0, 5000: 0, 10000: 0 }); // 캔디 보상 상태

  let subscription = null; // 걸음 수 감시 기능을 외부 변수로 선언

  // 현재 위치 업데이트 및 저장 함수
  const updateAndStoreUserLocation = async () => {
    try {
      let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      const { latitude, longitude } = currentLocation.coords;

      // 위도와 경도를 AsyncStorage에 저장합니다.
      await AsyncStorage.setItem('@userLocation', JSON.stringify({ latitude, longitude }));

      // 저장된 위치와 현재 위치를 비교합니다.
      await compareWithStoredLocation(currentLocation.coords);
    } catch (error) {
      console.error('위치 업데이트 중 오류 발생:', error);
    }
  };
  useEffect(() => {
    updateAndStoreUserLocation(); // 초기 로드 시 위치 업데이트
    trackLocation(); // 위치 추적 시작
  }, []);

  const trackLocation = async () => { // 사용자 위치 실시간으로 추적 함수(100m 변할 때마다)
    await Location.requestForegroundPermissionsAsync();

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 100, // 100미터마다 위치 업데이트
      },
      async (newLocation) => {
        let { latitude, longitude } = newLocation.coords;

        // 새로운 위치 데이터를 AsyncStorage에 저장합니다.
        try {
          await AsyncStorage.setItem('@userLocation', JSON.stringify({ latitude, longitude }));
          console.log("새 위치 저장됨:", latitude, longitude);
        } catch (error) {
          console.error('위치 저장 중 오류 발생:', error);
        }
      }
    );
  };

  // 저장된 위치와 비교하는 함수
  const compareWithStoredLocation = async (currentCoords) => {
    try {
      const storedLocationString = await AsyncStorage.getItem('@userLocation');
      if (storedLocationString !== null) {
        const storedLocation = JSON.parse(storedLocationString);
        const distance = getDistanceBetweenLocations(storedLocation, currentCoords);
        if (distance <= 20) { // 20미터 이내로 설정
          Alert.alert("두 사람이 가까이 있습니다. 만보기 시작하겠습니다!");
          setIsTogether(true); // 만보기 시작
        }
      }
    } catch (error) {
      console.error('데이터 비교 중 오류 발생:', error);
    }
  };

  // 각 위치의 위도와 경도 값으로 이 공식을 사용하여 어떤 지점에서든 두 위치 사이의 거리 계산 가능
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

  // 캔디 보상 함수
  const claimCandy = (steps) => {
    let newCandies = { ...candies };
    newCandies[steps] = newCandies[steps] + 1;

    setCandies(newCandies);
    Alert.alert("축하합니다!", `캔디 ${newCandies[steps]}개를 획득했습니다!`);
  };

  useEffect(() => {
    checkForCandyReward(currentStepCount);
  }, [currentStepCount]);

  // 캔디 보상을 확인하는 함수
  const checkForCandyReward = async (steps) => {
    try {
      const candyMilestones = [10, 5000, 10000]; // 캔디 보상 단계
      let earnedCandies = candies; // 현재 캔디 상태를 로컬 변수에 복사

      for (const milestone of candyMilestones) {
        if (steps >= milestone && earnedCandies * 10 < steps) {
          earnedCandies += 1; // 캔디 보상 추가
        }
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

  const RewardBox = ({ steps, candies, candyReward, onClaim }) => (
    <View style={styles.rewardBox}>
      <Text style={styles.text}>{steps} 걸음</Text>
      <Text style={styles.text}>캔디 {candies[steps]}개</Text>
      <Button title={`${candyReward} 캔디 받기!`} onPress={() => onClaim(steps)} />
    </View>
  );

  useEffect(() => {
    const loadData = async () => { //현재 걸음 수 불러오기
      try {
        const storedSteps = await AsyncStorage.getItem('@currentStepCount');
        if (storedSteps !== null) {
          setCurrentStepCount(parseInt(storedSteps, 10));
        }
      } catch (error) {
        console.error('데이터 불러오기 중 오류 발생:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // 커플이 함께 있을 때만 걸음 수 감시
    if (isTogether) {
      subscription = Pedometer.watchStepCount(result => {
        // 현재 걸음 수에 실시간 걸음 수를 더함
        setCurrentStepCount(prevCount => prevCount + result.steps);
      });
    } else {
      if (subscription) {
        subscription.remove();
      }
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isTogether]);

  useEffect(() => {
    Pedometer.isAvailableAsync().then(isAvailable => { //만보기 사용 가능한지 여부 판단
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        // 지난 24시간 동안의 걸음 수 가져오기
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        Pedometer.getStepCountAsync(start, end).then(pastStepCountResult => {
          setPastStepCount(pastStepCountResult.steps);
        });

        // 실시간 걸음 수 감시 시작
        subscription = Pedometer.watchStepCount(result => {
          setCurrentStepCount(prevCount => prevCount + result.steps);
        });
      }
    });

    // 구독 해제
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [currentStepCount, candies]);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('@currentStepCount', currentStepCount.toString());
      } catch (error) {
        console.error('데이터 저장 중 오류 발생:', error);
      }
    };
    storeData(); // 현재 걸음 수 저장
  }, [currentStepCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>커플 만보기</Text>
      <View style={styles.separator}></View>
      <Text style={styles.text}>만보기 기능 사용 가능 여부 : {isPedometerAvailable}</Text>
      <Text style={styles.text}>지난 24시간 동안 걸음 수 : {pastStepCount}</Text>
      <Text style={styles.text}>현재 걸음 수 : {currentStepCount}</Text>
      <Button title="위치 업데이트" onPress={updateAndStoreUserLocation} />
      {location ? <Text>현재 위치: {JSON.stringify(location)}</Text> : null}
      {errorMsg ? <Text style={styles.errorText}>오류: {errorMsg}</Text> : null}
      <View style={styles.rewardContainer}>
        <RewardBox steps={1000} candies={candies} candyReward={1} onClaim={claimCandy} />
        <RewardBox steps={5000} candies={candies} candyReward={5} onClaim={claimCandy} />
        <RewardBox steps={10000} candies={candies} candyReward={10} onClaim={claimCandy} />
      </View>
    </View>
  );
}

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
    color: "#544848",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  rewardContainer: {
    flexDirection: 'row',
  },
  rewardBox: {
    margin: 5,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: "#544848",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFCECE",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20,
  },
  buttonText: {
    color: "#544848",
    fontWeight: "bold",
    fontSize: 18,
  },
  separator: {
    height: 1,
    width: "80%",
    backgroundColor: "#737373",
    marginVertical: 20,
  },
});

export default PedometerScreen
