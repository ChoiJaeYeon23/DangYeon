import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import CandyImage from '../../assets/candy.png';

LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  dayNames: ['일', '월', '화', '수', '목', '금', '토'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
// 캘린더 한국어로 설정
LocaleConfig.defaultLocale = 'ko';

// 현재 날짜 확인 및 출석체크 마킹
const CustomDay = ({ date, marking = {} }) => {
  const currentDate = moment().format('YYYY-MM-DD');
  const isCurrentDate = date.dateString === currentDate;

  return (
    <View>
      <Text>{date.day}</Text>
      {isCurrentDate && <Image source={CandyImage} style={{ width: 10, height: 10 }} />}
      {marking.marked && <Image source={CandyImage} style={{ width: 10, height: 10 }} />}
    </View>
  );
};

const CalendarPage = () => {
  // 출석체크 표시한 날짜들을 저장하는 곳
  const [markedDates, setMarkedDates] = useState({});
  
  useEffect(() => {
    // 출석체크 데이터 로드
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      // AsyncStorage에서 출석체크 데이터 및 처리
      const attendanceValue = await AsyncStorage.getItem('@attendance');
      if (attendanceValue != null) {
        const attendanceData = JSON.parse(attendanceValue);
        markAttendanceDates(attendanceData);
      }
    } catch (e) {
      console.error("Error loading attendance data", e);
    }
  };
  // 출석체크 데이터를 캘린더에 표시
  const markAttendanceDates = (attendance) => {
    // 각 날짜별 출석체크 여부에 따라 표시
    let dates = {};
    attendance.forEach((isComplete, index) => {
      const date = moment().startOf('month').add(index, 'days').format('YYYY-MM-DD');
      if (isComplete) {
        dates[date] = { marked: true, dotColor: 'black' };
      }
    });
    setMarkedDates(dates);
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={'custom'}
        dayComponent={({date, marking}) => <CustomDay date={date} marking={marking} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CalendarPage;
