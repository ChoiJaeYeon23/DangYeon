import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
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
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);

    // 가상의 조건으로 근접 여부 확인 (실제 구현 시 수정 필요)
    if (currentLocation.coords.latitude < 10 && currentLocation.coords.longitude < 10) {
      Alert.alert("알람", "사랑의 걸음, 함께 시작해볼까요?");
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
