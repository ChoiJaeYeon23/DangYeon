import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';

const PedometerScreen = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');// 만보기가 사용 가능한지 여부를 저장하는 상태
  const [pastStepCount, setPastStepCount] = useState(0); // 지난 24시간 동안의 걸음 수를 저장하는 상태
  const [currentStepCount, setCurrentStepCount] = useState(0); // 현재 걸음 수를 저장하는 상태
  const [location, setLocation] = useState(null); // 현재 위치를 저장하는 상태
  const [errorMsg, setErrorMsg] = useState(null); // 오류 메시지를 저장하는 상태
  const [candies, setCandies] = useState(null);
  const [candyRewardsReceived, setCandyRewardsReceived] = useState({ 'ten': false, 'fifty': false, 'hundred': false }); // 각 걸음 수 단계에 대해 보상을 받았는지 여부
  let subscription = null; // 걸음 수 감시 기능을 외부 변수로 선언

  useEffect(() => { // 현재 걸음 수 저장
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('@currentStepCount', currentStepCount.toString());
      } catch (error) {
        console.error('데이터 저장 중 오류 발생:', error);
      }
    };
    storeData();
  }, [currentStepCount])

  useEffect(() => { // 현재 걸음 수와 캔디 수 불러오기
    const loadData = async () => {
      try {
        const storedSteps = await AsyncStorage.getItem('@currentStepCount');
        const storedCandies = await AsyncStorage.getItem('@candies');

        if (storedSteps !== null) {
          setCurrentStepCount(parseInt(storedSteps, 10));
        }
        if (storedCandies !== null) {
          setCandies(JSON.parse(storedCandies));
        } else {
          console.log("Stored candies not found");
          // 캔디가 없는 경우 초기값으로 0을 설정
          setCandies(0);
        }
      } catch (error) {
        console.error('데이터 불러오기 중 오류 발생:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    Pedometer.isAvailableAsync().then(isAvailable => { //만보기 사용 가능한지 여부 판단
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        // 실시간 걸음 수 감시 시작
        subscription = Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps);
        });

        // 지난 24시간 동안의 걸음 수 가져오기
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        Pedometer.getStepCountAsync(start, end).then(pastStepCountResult => {
          setPastStepCount(pastStepCountResult.steps);
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

  // 현재 걸음 수 업데이트 함수
  const updateCurrentStepCount = async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const result = await Pedometer.getStepCountAsync(startOfDay, endOfDay);
      setCurrentStepCount(result.steps);
    } catch (error) {
      console.error('현재 걸음 수 업데이트 중 오류 발생:', error);
    }
  };

  // 캔디 보상 함수
  const claimCandy = async (steps) => {
    const key = steps === 10 ? 'ten' : steps === 50 ? 'fifty' : 'hundred';
  
    if (currentStepCount >= steps && !candyRewardsReceived[key]) {
      let candyReward = steps === 10 ? 1 : steps === 50 ? 5 : 10;
  
      let newCandies = candies + candyReward;
      setCandies(newCandies);
  
      let newCandyRewardsReceived = { ...candyRewardsReceived };
      newCandyRewardsReceived[key] = true;
      setCandyRewardsReceived(newCandyRewardsReceived);
  
      // 캔디 수 AsyncStorage에 저장
      try {
        await AsyncStorage.setItem('@candies', JSON.stringify(newCandies));
      } catch (error) {
        console.error('캔디 저장 중 오류 발생:', error);
      }
    }
  };

  useEffect(() => {
    const resetCandyRewards = async () => { // 자정이 지나면 캔디 받기 초기화 & 캔디 수 누적
      const now = new Date();
      const lastUpdate = await AsyncStorage.getItem('@lastCandyUpdate');

      if (lastUpdate) {
        const lastUpdateDate = new Date(lastUpdate);
        if (lastUpdateDate.getDate() !== now.getDate() ||
          lastUpdateDate.getMonth() !== now.getMonth() ||
          lastUpdateDate.getFullYear() !== now.getFullYear()) {
          // 새로운 날짜가 되었으므로 캔디 보상 상태를 리셋하고 현재 날짜 저장
          setCandyRewardsReceived({ "ten": false, "fifty": false, "hundred": false });
          await AsyncStorage.setItem('@lastCandyUpdate', now.toISOString());
        }
      } else {
        await AsyncStorage.setItem('@lastCandyUpdate', now.toISOString());
      }
    };
    resetCandyRewards();
  }, []);

  // 캔디 보상 상태 저장
  useEffect(() => {
    const storeCandyRewardsReceived = async () => {
      try {
        await AsyncStorage.setItem('@candyRewardsReceived', JSON.stringify(candyRewardsReceived));
      } catch (error) {
        console.error('캔디 보상 상태 저장 중 오류 발생:', error);
      }
    };

    storeCandyRewardsReceived();
  }, [candyRewardsReceived]);

  // 총 캔디 수 저장
  useEffect(() => {
    const storeCandies = async () => {
      try {
        await AsyncStorage.setItem('@candies', JSON.stringify(candies));
      } catch (error) {
        console.error('캔디 저장 중 오류 발생:', error);
      }
    };

    storeCandies();
  }, [candies]);

  const RewardBox = ({ steps, candyReward }) => {
    const key = steps === 10 ? 'ten' : steps === 50 ? 'fifty' : 'hundred';
    const isRewardAvailable = currentStepCount >= steps;
    const isRewardClaimed = candyRewardsReceived[key];

    return (
      <View style={styles.rewardBox}>
        <Text style={styles.text}>{steps} 걸음</Text>
        <Button
          title={`${candyReward} 캔디 받기!`}
          onPress={() => {
            if (isRewardAvailable && !isRewardClaimed) {
              claimCandy(steps);
              Alert.alert("축하합니다!", `${steps} 걸음에 도달하여 캔디 ${candyReward}개를 획득했습니다!`);
            }
          }}
          disabled={!isRewardAvailable || isRewardClaimed}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>만보기</Text>
      <View style={styles.separator}></View>
      <Text style={styles.text}>만보기 기능 사용 가능 여부 : {isPedometerAvailable}</Text>
      <Text style={styles.text}>지난 24시간 동안 걸음 수 : {pastStepCount}</Text>
      <Text style={styles.text}>현재 걸음 수 : {currentStepCount}</Text>
      <Text style={styles.text}>현재 캔디 수 : {candies}</Text>
      <Button title="현재 걸음 수 업데이트" onPress={updateCurrentStepCount} style={styles.button} />
      {location ? <Text>현재 위치: {JSON.stringify(location)}</Text> : null}
      {errorMsg ? <Text style={styles.errorText}>오류: {errorMsg}</Text> : null}
      <View style={styles.rewardContainer}>
        <RewardBox steps={10} candyReward={1} onClaim={claimCandy} />
        <RewardBox steps={50} candyReward={5} onClaim={claimCandy} />
        <RewardBox steps={100} candyReward={10} onClaim={claimCandy} />
      </View>
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