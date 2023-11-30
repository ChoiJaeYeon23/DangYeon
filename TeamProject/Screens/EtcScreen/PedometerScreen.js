import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';

const PedometerScreen = () => {
  // 만보기가 사용 가능한지 여부를 저장하는 상태
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  // 지난 24시간 동안의 걸음 수를 저장하는 상태
  const [pastStepCount, setPastStepCount] = useState(0);
  // 현재 걸음 수를 저장하는 상태
  const [currentStepCount, setCurrentStepCount] = useState(0);

  let subscription = null; // subscription을 외부 변수로 선언

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
