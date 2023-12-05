import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const { width } = Dimensions.get('window');

const whiteCandyImage = require('../../assets/Bincandy.png');
const brownCandyImage = require('../../assets/candy.png');

// 출석체크 상태에 따라 나타나는 이미지
const Candy = ({ isComplete }) => {
  const candyImage = isComplete ? brownCandyImage : whiteCandyImage;
  return (
    <Image source={candyImage} style={styles.candy} />
  );
};

const Etc = ({ navigation }) => {
  const firstDots = Array.from({ length: 15 }, (_, i) => i); // 점선
  const secondDots = Array.from({ length: width / 20 }, (_, i) => i); // 점선
  const [bucketListItems, setBucketListItems] = useState([]);
  const [attendance, setAttendance] = useState(Array(7).fill(false)); // 출석체크 상태
  const [currentWeek, setCurrentWeek] = useState(0); // 현재 주차
  const [currentMonth, setCurrentMonth] = useState(''); // 현재 월
  const [currentStepCount, setCurrentStepCount] = useState(0); // 현재 걸음 수를 저장하는 상태
  const [candies, setCandies] = useState(0); // 획득한 캔디 수

  // 새로고침 버튼 클릭 시 실행할 함수
  const refreshData = async () => {
    try {
      // AsyncStorage에서 걸음 수와 캔디 수 로드
      const storedSteps = await AsyncStorage.getItem('@currentStepCount');
      const storedCandies = await AsyncStorage.getItem('@candies');
  
      if (storedSteps !== null) {
        setCurrentStepCount(parseInt(storedSteps, 10));
      } else {
        console.log("Stored steps not found");
      }
  
      if (storedCandies !== null) {
        setCandies(JSON.parse(storedCandies));
      } else {
        console.log("Stored candies not found");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

   // AsyncStorage에서 출석체크 데이터와 현재 주차 정보, 버킷 리스트 데이터 로드
   const loadData = async () => {
    try {
      const attendanceValue = await AsyncStorage.getItem('@attendance');
      const jsonValue = await AsyncStorage.getItem('@bucketList');

      if (attendanceValue != null) {
        setAttendance(JSON.parse(attendanceValue));
      }
      if (jsonValue != null) {
        setBucketListItems(JSON.parse(jsonValue).slice(0, 2));
      }

      const today = moment();
      const currentMonth = today.format('M');
      const monthStart = moment(today).startOf('month');
      const weeksPassed = today.diff(monthStart, 'weeks') + 1;

      setCurrentWeek(weeksPassed);
      setCurrentMonth(currentMonth);
    } catch (e) {
      console.error("Error loading data", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  // 출석체크 버튼 클릭 
  const handleCandyClick = () => {
    navigation.navigate('CalendarPage', { attendance });
  };
  // 출석체크 상태에 따라 이미지 달라지는 렌더링
  const renderCandies = () => {
    return attendance.map((isComplete, index) => (
      <Candy key={index} isComplete={isComplete} />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <TouchableOpacity style={[styles.box, styles.firstBox]} onPress={() => navigation.navigate('PedometerScreen')}>
          <Text style={styles.boxTitle}>만보기</Text>
          <Text style={styles.boxText}>현재 걸음 수 : {currentStepCount}</Text>
          <Text style={styles.boxText}>획득한 캔디 수 : {candies}</Text>
          <TouchableOpacity onPress={refreshData} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>새로고침</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        
        <View style={styles.box} />
      </View>
      <View style={styles.dotsContainer}>
        {firstDots.map((_, index) => (
          <View key={index} style={styles.dot} />
        ))}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('BucketList')} style={styles.ListBox}>
        <Text style={styles.ListBoxText}>버킷리스트</Text>
        {bucketListItems.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Image
              source={item.isCompleted ? require('../../assets/heart.png') : require('../../assets/Binheart.png')}
              style={styles.icon}
            />
            <Text style={[styles.listItemText, item.isCompleted && styles.strikethrough]}>
              {item.text}
            </Text>
          </View>
        ))}
      </TouchableOpacity>
      <View style={styles.secondDotsContainer}>
        {secondDots.map((_, index) => (
          <View key={`second-dot-${index}`} style={styles.secondDot} />
        ))}
      </View>
      <TouchableOpacity onPress={handleCandyClick} style={styles.Check}>
        <Text style={styles.CheckText}>
          {currentMonth}월 {currentWeek}주째 출석체크
        </Text>
        <View style={styles.candiesContainer}>
          {renderCandies()}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F9',
    alignItems: 'center',
    paddingTop: 10,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  box: {
    width: width * 0.4,
    height: width * 0.6,
    backgroundColor: '#FFD9D9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#544848',
    marginBottom: 20,
  },
  boxText: {
    fontSize: 17,
    color: '#544848',
    marginBottom: 7,
  },
  refreshButton: {
    marginTop: 20,
    backgroundColor: "#FFC0CB",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: 'center',
  },
  refreshButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  firstBox: {
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 1,
    backgroundColor: 'black',
  },
  secondDotsContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  secondDot: {
    width: 10,
    height: 1,
    backgroundColor: 'black',
    marginRight: 10,
  },
  ListBox: {
    backgroundColor: '#FFFFFF',
    width: width * 0.8,
    height: width * 0.3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 20,
    paddingLeft: 15,
    paddingTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
  },
  ListBoxText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
    paddingLeft: 20,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#d3d3d3',
  },
  Check: {
    backgroundColor: '#FFD9D9',
    width: width * 0.8,
    height: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
  },
  candiesContainer: {
    flexDirection: 'row',
    marginTop: 10, // 상단 여백 추가
  },
  candy: {
    width: 24,
    height: 24,
    marginHorizontal: 5,
  },
});

export default Etc;