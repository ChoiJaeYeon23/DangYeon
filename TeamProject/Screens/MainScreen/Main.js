import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import PictureMap from './PictureMap';
import Weather from './Weather';

const whiteCandyImage = require('../../assets/Bincandy.png');
const brownCandyImage = require('../../assets/candy.png');

// 캔디 이미지 표시
const Candy = ({ isComplete }) => {
  const candyImage = isComplete ? brownCandyImage : whiteCandyImage;
  return <Image source={candyImage} style={styles.candy} />;
};

const Main = ({ navigation }) => {
  const [attendance, setAttendance] = useState(Array(7).fill(false)); // 일주일간의 출석체크 상태 배열로 관리
  const [weekLabel, setWeekLabel] = useState(''); // 주차 레이블
  const [message, setMessage] = useState(''); // 사용자에게 보여줄 메시지 관리
  const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false); // 출석체크 상태 표시 여부

  useEffect(() => {
    // 출석체크 상태를 검사하고 주차 레이블 설정
    // AsyncStorage에서 출석체크 데이처 저장
    const checkDateAndAttendance = async () => {
      try {
        const today = moment().format('YYYY-MM-DD');
        const currentWeekday = moment().isoWeekday();
        const storedDate = await AsyncStorage.getItem('@lastCheckDate');
        const storedWeekday = await AsyncStorage.getItem('@lastCheckWeekday');
        const storedAttendance = await AsyncStorage.getItem('@attendance');

        if (storedDate !== today || storedWeekday != currentWeekday) {
          setAttendance(Array(7).fill(false));
          await AsyncStorage.setItem('@lastCheckDate', today);
          await AsyncStorage.setItem('@lastCheckWeekday', currentWeekday.toString());
          setIsAttendanceModalVisible(true);
        } else if (storedAttendance) {
          setAttendance(JSON.parse(storedAttendance));
        }

        const startOfWeek = moment().startOf('isoWeek');
        const weekInMonth = startOfWeek.isoWeek() - moment(startOfWeek).startOf('month').isoWeek() + 1;
        const month = startOfWeek.format('M월');
        setWeekLabel(`${month} ${weekInMonth}째주 출석체크`);
      } catch (error) {
        console.error('날짜 및 출석체크 데이터 로드 중 오류 발생:', error);
      }
    };

    checkDateAndAttendance();
  }, []);

  // 출석체크 처리하는 함수
  const handleAttendance = () => {
    const todayIndex = moment().isoWeekday() - 1;
    if (attendance[todayIndex]) {
      setMessage('이미 출석체크를 하셨습니다.');
      setIsAttendanceModalVisible(true);
      setTimeout(() => setIsAttendanceModalVisible(false), 1000);
    } else {
      const newAttendance = [...attendance];
      newAttendance[todayIndex] = true;
      setAttendance(newAttendance);
      AsyncStorage.setItem('@attendance', JSON.stringify(newAttendance));
      setMessage('출석이 완료되었습니다!');
      setIsAttendanceModalVisible(true);
      setTimeout(() => {
        setIsAttendanceModalVisible(false);
      }, 1000);
    }
  };

  const goToCalendar = () => {
    navigation.navigate('CalendarScreen');
  };

  // 출석체크 된 캔디 이미지를 바꾸는 함수
  const renderCandies = () => {
    return attendance.map((isComplete, index) => <Candy key={index} isComplete={isComplete} />);
  };

  // 모달창 닫는 함수
  const closeModal = () => {
    setIsAttendanceModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.weatherWidget}>
          <Weather />
        </View>
        <TouchableOpacity onPress={goToCalendar} style={styles.anniversary}>
          <Text style={styles.anniversaryText}>사랑한 지</Text>
          <Text style={styles.anniversaryText2}>7017일 째</Text>
          <Text style={styles.anniversaryText}>수쨩 💖 원우</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.map}>
        <PictureMap />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isAttendanceModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{weekLabel}</Text>
            <View style={styles.candiesContainer}>
              {renderCandies()}
            </View>
            {attendance[moment().isoWeekday() - 1] ? (
              <TouchableOpacity onPress={handleAttendance}>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleAttendance}
                disabled={attendance[moment().isoWeekday() - 1]}
              >
                <Text style={styles.buttonText}>출석체크</Text>
              </TouchableOpacity>
            )}
            {message && <Text style={styles.message}>{message}</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#FFF9F9',
  },
  topContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  weatherWidget: {
    position: 'absolute',
    left: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anniversary: {
    position: 'absolute',
    right: 50,
    marginTop: 10,
  },
  anniversaryText: {
    color: '#544848',
    fontSize: 20,
    textAlign: 'center',
    margin: 2,
  },
  anniversaryText2: {
    color: '#544848',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    margin: 20,
    marginTop: 90,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  candiesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  candy: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#FFCECE',
    padding: 12,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonText: {
    color: '#000',
    fontSize: 15,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
  },
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#FFF9F9',
  },
  topContainer: {
    paddingTop: 10,
    paddingHorizontal: 20, // 좌우 여백 설정
    alignItems: 'center', // 수직 방향으로 중앙 정렬
  },
  weatherWidget: {
    position: 'absolute', // 날씨 위젯을 위해 절대 위치 사용
    left: 50, // 왼쪽 정렬
    width: 100, // 날씨 위젯의 너비
    height: 100, // 날씨 위젯의 높이
    alignItems: 'center', // 내부 텍스트 등을 중앙에 배치
    justifyContent: 'center', // 내부 텍스트 등을 중앙에 배치
  },
  anniversary: {
    position: 'absolute',
    right: 50,
    marginTop: 10,
  },
  anniversaryText: {
    color: '#544848',
    fontSize: 20,
    textAlign: 'center',
    margin: 2,
  },
  anniversaryText2: {
    color: '#544848',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    justifyContent: 'center', // 지도를 중앙에 배치
    borderWidth: 1, // 테두리 두께
    borderColor: 'black',
    margin: 20,
    marginTop: 90,
  }
});

export default Main;