import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image, } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from 'expo-sensors';
import CandyImage from '../../assets/candy.png';

const PedometerScreen = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');// 만보기가 사용 가능한지 여부 저장
  const [pastStepCount, setPastStepCount] = useState(0); // 지난 24시간 동안의 걸음 수 저장
  const [currentStepCount, setCurrentStepCount] = useState(0); // 현재 걸음 수 저장
  const [candies, setCandies] = useState(0); // 획득한 캔디 수
  const [candyRewardsReceived, setCandyRewardsReceived] = useState({ 'ten': false, 'fifty': false, 'hundred': false }); // 각 걸음 수 단계에 대해 보상을 받았는지 여부
  const [calories, setCalories] = useState(0); // 칼로리

  let subscription = null; // 걸음 수 감시 기능 외부 변수로 선언

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

  useEffect(() => {
    const loadData = async () => { //현재 걸음 수랑 캔디 불러오기
      try {
        const storedSteps = await AsyncStorage.getItem('@currentStepCount');
        const storedCandies = await AsyncStorage.getItem('@candies');
        console.log("불러온 캔디 수:", storedCandies);

        if (storedSteps !== null) {
          setCurrentStepCount(parseInt(storedSteps, 10));
        }
        if (storedCandies !== null) {
          setCandies(JSON.parse(storedCandies));
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

      // 현재 걸음 수 업데이트
      const result = await Pedometer.getStepCountAsync(startOfDay, endOfDay);
      setCurrentStepCount(result.steps);

      // 캔디 수 업데이트
      const storedCandies = await AsyncStorage.getItem('@candies');
      if (storedCandies !== null) {
        setCandies(JSON.parse(storedCandies));
      }
    } catch (error) {
      console.error('현재 걸음 수 업데이트 중 오류 발생:', error);
    }
  };

  // 캔디 보상 함수
  const claimCandy = async (steps) => {
    const key = steps === 1000 ? 'ten' : steps === 5000 ? 'fifty' : 'hundred';
    if (currentStepCount >= steps && !candyRewardsReceived[key]) {
      let candyReward = steps === 1000 ? 1 : steps === 5000 ? 5 : 10000;
      const newCandyCount = candies + candyReward;
      setCandies(newCandyCount);

      let newCandyRewardsReceived = { ...candyRewardsReceived };
      newCandyRewardsReceived[key] = true;
      setCandyRewardsReceived(newCandyRewardsReceived);

      try {
        await AsyncStorage.setItem('@candies', JSON.stringify(newCandyCount));
        console.log("저장된 캔디 수:", newCandyCount);
      } catch (error) {
        console.error('캔디 저장 중 오류 발생:', error);
      }
    }
  };

  useEffect(() => { // 자정이 지나면 캔디 받기 초기화 & 캔디 수 누적
    const resetCandyRewards = async () => {
      // 자정이 지나면 캔디 보상 상태 초기화
      const now = new Date();
      const lastUpdate = await AsyncStorage.getItem('@lastCandyUpdate');

      if (lastUpdate) {
        const lastUpdateDate = new Date(lastUpdate);
        if (lastUpdateDate.getDate() !== now.getDate() ||
          lastUpdateDate.getMonth() !== now.getMonth() ||
          lastUpdateDate.getFullYear() !== now.getFullYear()) {
          // 새로운 날짜가 되었으므로 캔디 보상 상태를 리셋
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
        // console.log(candies)
      } catch (error) {
        console.error('캔디 저장 중 오류 발생 : ', error);
      }
    };

    storeCandies();
  }, [candies]);

  const RewardBox = ({ steps, candyReward }) => {
    const key = steps === 1000 ? 'ten' : steps === 5000 ? 'fifty' : 'hundred';
    const isRewardAvailable = currentStepCount >= steps;
    const isRewardClaimed = candyRewardsReceived[key];

    return (
      <View style={styles.rewardBox}>
        <Text style={styles.text}>{steps} 걸음</Text>
        <TouchableOpacity
          onPress={() => {
            if (isRewardAvailable && !isRewardClaimed) {
              claimCandy(steps);
              Alert.alert("축하합니다!", `${steps} 걸음에 도달하여 캔디 ${candyReward}개를 획득했습니다!`);
            }
          }}
          disabled={!isRewardAvailable || isRewardClaimed}
          style={[
            styles.rewardButton,
            { backgroundColor: (!isRewardAvailable || isRewardClaimed) ? '#ccc' : '#FFCECE' }
          ]}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>{`${candyReward} `}</Text>
            <Image source={CandyImage} style={styles.candyImage} />
            <Text style={styles.buttonText}> 받기</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => { // 걸음 수에 따른 칼로리 계산
    const calculateCalories = () => { // 칼로리 소모량 = 걸음수 x 0.04
      return currentStepCount * 0.04;
    };

    setCalories(calculateCalories());
  }, [currentStepCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>나의 만보기</Text>
      <View style={styles.separator}></View>
      <Text style={styles.text}>만보기 기능 사용 가능 여부 : {isPedometerAvailable}</Text>
      <Text style={styles.text}>지난 24시간 동안의 걸음 수 : {pastStepCount}</Text>
      <Text style={styles.text}>오늘 걸음 수 : {currentStepCount}</Text>
      <View style={styles.candyCountContainer}>
        <Text style={styles.text}>획득한 캔디 수 </Text>
        <Image source={CandyImage} style={styles.candyImage2} />
        <Text style={styles.text}> : {candies}</Text>
      </View>
      <Text style={styles.text}>총 {calories.toFixed(2)} kcal를 소모하셨습니다!</Text>
      <TouchableOpacity onPress={updateCurrentStepCount} style={styles.button}>
        <Text style={styles.buttonText}>걸음 수 업데이트</Text>
      </TouchableOpacity>
      <View style={styles.rewardContainer}>
        <RewardBox steps={1000} candyReward={1} onClaim={claimCandy} />
        <RewardBox steps={5000} candyReward={5} onClaim={claimCandy} />
        <RewardBox steps={10000} candyReward={10} onClaim={claimCandy} />
      </View>
      <Text style={styles.descriptionText}>만보기를 더 정확하게 사용하고 싶으시다면 업데이트 버튼을 누른 후에 사용해주세요!</Text>
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
  },
  rewardContainer: {
    flexDirection: 'row',
  },
  candyImage: {
    width: 20,
    height: 20,
  },
  candyImage2: {
    width: 19,
    height: 19,
    marginBottom: 10
  },
  rewardBox: {
    margin: 5,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  rewardButton: {
    padding: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: "#FFCECE",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: "#544848",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  candyCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  separator: {
    height: 1,
    width: "80%",
    backgroundColor: "#737373",
    marginVertical: 20,
  },
  descriptionText: {
    color: "#333",
    textAlign: "center",
    marginHorizontal: 20,
    backgroundColor: "#FFF0F5",
    padding: 10,
    marginTop: 50,
  },
});

export default PedometerScreen