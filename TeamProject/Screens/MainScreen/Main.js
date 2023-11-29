import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import PictureMap from './PictureMap';
import Weather from './Weather';
import CalendarScreen from './CalendarScreen';


const whiteCandyImage = require('../../assets/Bincandy.png'); 
const brownCandyImage = require('../../assets/candy.png'); 

// 출석체크 여부에 따라 이미지 변경
const Candy = ({ isComplete }) => {
  const candyImage = isComplete ? brownCandyImage : whiteCandyImage;
  return (
    <Image source={candyImage} style={styles.candy} />
  );
};

const Main = ({ navigation }) => {
  const [attendance, setAttendance] = useState(Array(7).fill(false)); // 출석체크 상태
  const [weekLabel, setWeekLabel] = useState('');  // 주차 레이블
  const [message, setMessage] = useState(''); // 메시지 상태
  const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false); // 출석체크 창 표시 여부

  useEffect(() => {
    // AsyncStorage에서 출석체크 데이터 로드
    AsyncStorage.getItem('@attendance')
      .then((storedAttendance) => {
        if (storedAttendance) {
          setAttendance(JSON.parse(storedAttendance));
        }
      })
      .catch((error) => {
        console.error('출석체크 데이터 로드 중 오류 발생:', error);
      });

    // 주차 레이블 
    const startOfWeek = moment().startOf('isoWeek');
    const weekInMonth = startOfWeek.isoWeek() - moment(startOfWeek).startOf('month').isoWeek() + 1;
    const month = startOfWeek.format('M월');
    setWeekLabel(`${month} ${weekInMonth}째주 출석체크`);
  }, []);

  const handleAttendance = () => {
    const todayIndex = moment().isoWeekday() - 1;
    // 이미 출석체크를 한 경우 처리
    if (attendance[todayIndex]) {
      setMessage('이미 출석체크를 하셨습니다.');
    } else {
      const newAttendance = [...attendance];
      newAttendance[todayIndex] = true;
      setAttendance(newAttendance);
      AsyncStorage.setItem('@attendance', JSON.stringify(newAttendance));
      setMessage('출석이 완료되었습니다!');
    }
  };

  const goToPictureMap = () => {
    navigation.navigate('PictureMap');
  };

  const goToCalendar = () => {
    navigation.navigate('CalendarScreen');
  };

  // 출석체크 캔디를 렌더링하는 함수
  const renderCandies = () => {
    return attendance.map((isComplete, index) => (
      <Candy key={index} isComplete={isComplete} />
    ));
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
        onRequestClose={() => setIsAttendanceModalVisible(false)}
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
});

export default Main;