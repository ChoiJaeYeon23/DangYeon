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
LocaleConfig.defaultLocale = 'ko';

const CustomDay = ({ date, marking }) => {
  const isMarked = marking && marking.customStyles;

  return (
    <View style={styles.customDayContainer}>
      <Text style={styles.customDayText}>{date.day}</Text>
      {isMarked && (
        <Image source={marking.customStyles.image} style={styles.candyImage} />
      )}
    </View>
  );
};

const CalendarPage = () => {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      const attendanceValue = await AsyncStorage.getItem('@attendance');
      if (attendanceValue != null) {
        const attendance = JSON.parse(attendanceValue);
        const newMarkedDates = {};
        
        attendance.forEach((attended, index) => {
          const day = moment().startOf('isoWeek').add(index, 'days');
          if (attended) {
            newMarkedDates[day.format('YYYY-MM-DD')] = {
              customStyles: {
                container: {
                  backgroundColor: '#FFF9F9',
                },
                text: {
                  color: 'black',
                },
                image: CandyImage, // 캔디 이미지 설정
              },
            };
          }
        });

        setMarkedDates(newMarkedDates);
      }
    } catch (error) {
      console.error("Error loading attendance data", error);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={'custom'}
        dayComponent={({ date, marking }) => (
          <CustomDay date={date} marking={marking} />
        )}
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
  customDayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customDayText: {
    fontSize: 16,
    color: 'black',
  },
  candyImage: {
    width: 20,
    height: 20,
  },
});

export default CalendarPage;