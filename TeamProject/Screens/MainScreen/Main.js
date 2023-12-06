import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import PictureMap from './PictureMap';
import Weather from './Weather';

const whiteCandyImage = require('../../assets/Bincandy.png');
const brownCandyImage = require('../../assets/candy.png');

// 출서체크 상태에 따라 다른 캔디 이미지를 보여줌
const Candy = ({ isComplete }) => {
  const candyImage = isComplete ? brownCandyImage : whiteCandyImage;
  return <Image source={candyImage} style={styles.candy} />;
};

const Main = ({ navigation }) => {
  const [attendance, setAttendance] = useState(Array(7).fill(false)); // 출석체크 일주일 나타냄
  const [weekLabel, setWeekLabel] = useState(''); // 주차 레이블
  const [message, setMessage] = useState('');//메시지
  const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false); // 출석체크 관리
  const [daysSinceMeeting, setDaysSinceMeeting] = useState(0);
  
  useEffect(() => {
    const checkDateAndAttendance = async () => {
      try {
        const today = moment().format('YYYY-MM-DD');
        const storedDate = await AsyncStorage.getItem('@lastCheckDate');
        const storedAttendance = await AsyncStorage.getItem('@attendance');

        if (storedDate !== today) {
          // 자정에 날짜가 변경되었을 때 출석체크 창을 보여주고, 출석체크 배열을 초기화
          setAttendance(Array(7).fill(false));
          await AsyncStorage.setItem('@lastCheckDate', today);
          setIsAttendanceModalVisible(true);
        } else if (storedAttendance) {
          // 같은 날짜에 이미 출석체크를 했다면, 출석체크 창을 보이지 않게 함
          setAttendance(JSON.parse(storedAttendance));
          // 출석체크를 하지 않았으면 모달이 계속 표시되도록 변경
          setIsAttendanceModalVisible(!JSON.parse(storedAttendance)[moment().isoWeekday() - 1]);
        }
        // 몇월 몇째주인지 계산하고 weekLabel에 저장
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

  // 출석체크 완료 창
  const handleAttendance = () => {
    const todayIndex = moment().isoWeekday() - 1;
    const newAttendance = [...attendance];
    newAttendance[todayIndex] = true;
    setAttendance(newAttendance);
    AsyncStorage.setItem('@attendance', JSON.stringify(newAttendance));
    setMessage('출석이 완료되었습니다!');

    // 1초 후 메시지 숨기기 및 출석체크 버튼 상태 변경
    setTimeout(() => {
      setMessage('');
      setIsAttendanceModalVisible(false); // 출석체크 모달을 닫음
    }, 1000);
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


  // 서버로부터 처음만난날 가져오는 코드
  const loadmeetingday = async () => {
    try {
      const response = await fetch('http://3.34.6.50:8080/api/D-day', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          calculateDaysSinceMeeting(data[0].meetingDay); // 처음 만난 날을 사용하여 계산
        }
      } else {
        console.error('Failed to fetch meeting day');
      }
    } catch (error) {
      console.error('Error fetching meeting day:', error);
    }
  };


  useEffect(() => {
    loadmeetingday()
  }, []);

  const calculateDaysSinceMeeting = (meetingDay) => { // 처음 만난 날 계산
    const today = moment();
    const startDay = moment(meetingDay);
    const duration = moment.duration(today.diff(startDay));
    const days = duration.asDays();
    setDaysSinceMeeting(Math.floor(days));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.weatherWidget}>
          <Weather />
        </View>
        <TouchableOpacity onPress={goToCalendar} style={styles.anniversary}>
          <Text style={styles.anniversaryText}>사랑한 지</Text>
          <Text style={styles.anniversaryText2}>{daysSinceMeeting}일 째</Text>
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
            {!message && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleAttendance}
                disabled={attendance[moment().isoWeekday() - 1]}
              >
                <Text style={styles.buttonText}>{attendance[moment().isoWeekday() - 1] ? '완료' : '출석체크'}</Text>
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
    width: '90%',
    height: '30%',
    backgroundColor: '#FFF9F9',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#585757',
  },
  candiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 20,
  },
  candy: {
    width: 30,
    height: 30,
    marginHorizontal: 6,
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
    marginTop: 10,
    fontSize: 20,
    color: '#000',
  },
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
  }
});

export default Main;