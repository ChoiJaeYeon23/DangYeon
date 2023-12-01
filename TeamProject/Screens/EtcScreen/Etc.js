import React, { useState, useEffect } from 'react';
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

const Etc = ({ navigation, candyData }) => {
  const firstDots = Array.from({ length: 15 }, (_, i) => i); // 점선
  const secondDots = Array.from({ length: width / 20 }, (_, i) => i); // 점선
  const [bucketListItems, setBucketListItems] = useState([]); // 버킷리스트 상태
  const [attendance, setAttendance] = useState(Array(7).fill(false)); // 출석체크 상태
  const [currentWeek, setCurrentWeek] = useState(0); // 현재 주차
  const [currentMonth, setCurrentMonth] = useState(''); // 현재 월
  
  const calculateWeeks = () => {
    const today = moment();
    const currentMonth = today.format('M');
    const monthStart = moment(today).startOf('month');
    const weeksPassed = today.diff(monthStart, 'weeks') + 1;
    
    setCurrentWeek(weeksPassed);
    setCurrentMonth(currentMonth);
  }

  useEffect(() => {
    // AsyncStorage에서 출석체크 데이터와 현재 주차 정보를 로드하는 함수
    const loadAttendanceData = async () => {
      try {
        const attendanceValue = await AsyncStorage.getItem('@attendance');
        if (attendanceValue != null) {
          setAttendance(JSON.parse(attendanceValue));
        }

        const today = moment();
        const currentMonth = today.format('M');
        const monthStart = moment(today).startOf('month');
        const weeksPassed = today.diff(monthStart, 'weeks') + 1;
    
        setCurrentWeek(weeksPassed);
        setCurrentMonth(currentMonth);
      } catch (e) {
        console.error("Error loading attendance data", e);
      }
    };

    loadAttendanceData();
  }, []);

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
      {/* 왼쪽 박스에 "만보기" 텍스트 추가 */}
      <View style={[styles.box, styles.firstBox]}>
        <Text style={styles.boxText} onPress={() => navigation.navigate('PedometerScreen')}>만보기</Text>
      </View>
      <View style={styles.box} />
    </View>
    

      <View style={styles.dotsContainer}>
        {firstDots.map((_, index) => (
          <View key={index} style={styles.dot} />
        ))}
      </View>
      <View style={styles.ListBox}>
        <Text style={styles.ListBoxText} onPress={() => navigation.navigate('BucketList')}>
          버킷리스트
        </Text>
        {bucketListItems.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Image
              source={item.isCompleted ? require('../../assets/heart.png') : require('../../assets/Binheart.png')}
              style={styles.icon}
            />
            <Text style={[item.isCompleted && styles.strikethrough]}>
              {item.text}
            </Text>
          </View>
        ))}
      </View>

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
  },
  ListBoxText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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