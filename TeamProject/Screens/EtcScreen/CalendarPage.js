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

const CustomDay = ({ date, state, marking }) => {
  const isMarked = marking && marking.customStyles;
  const textColor = state === 'disabled' ? '#d9d9d9' : 'black';

  return (
    <View style={styles.customDayContainer}>
      <Text style={[styles.customDayText, { color: textColor }]}>{date.day}</Text>
      {isMarked && (
        <Image source={marking.customStyles.image} style={styles.candyImage} />
      )}
    </View>
  );
};

const CalendarPage = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [candyCount, setCandyCount] = useState(0);

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      const attendanceValue = await AsyncStorage.getItem('@attendance');
      if (attendanceValue != null) {
        const attendance = JSON.parse(attendanceValue);
        const newMarkedDates = {};
        const candyCount = attendance.filter((attended) => attended).length;
        setCandyCount(candyCount);

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
                image: CandyImage,
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

  const CustomHeader = (month) => {
    const headerDate = moment(month.toString());
    const year = headerDate.format('YYYY년');
    const monthInKorean = `${headerDate.format('M')}월`;

    return (
      <View style={styles.customHeaderContainer}>
        <Text style={styles.customHeaderText}>
          {`${year} ${monthInKorean}`}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <Calendar
          style={styles.calendarStyle}
          renderHeader={(month) => CustomHeader(month)}
          markedDates={markedDates}
          markingType={'custom'}
          dayComponent={CustomDay}
          theme={{
            'stylesheet.day.basic': {
              base: {
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              },
              text: {
                fontSize: 18,
                marginTop: 6,
              },
            },
            arrowColor: 'pink',
          }}
        />
      </View>
      <View style={styles.candyCountContainer}>
        <Text style={styles.candyCountTitle}>이번달 캔디 수</Text>
        <View style={styles.candyBox}>
          <Image source={CandyImage} style={styles.candystyle} />
          <Text style={styles.candyCountText}>{candyCount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F9',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  customDayContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customDayText: {
    fontSize: 14,
    position: 'absolute',
    top: 2,
  },
  candyImage: {
    width: 20,
    height: 20,
    marginTop: 32,
  },
  candyCountContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70, // 여기에 여백 추가
  },
  candyCountTitle: {
    fontSize: 18,
    marginBottom: 20, // 텍스트와 상자 사이의 여백
    fontWeight: 'bold',
  },
  candyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFCB6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    minWidth: 100,
  },
  candyCountText: {
    fontSize: 20,
    marginLeft: 5,
  },
  candystyle: {
    width: 20,
    height: 20,
  },
  customHeaderContainer: {
    padding: 20,
  },
  customHeaderText: {
    fontSize: 24,
  },
  shadowContainer: {
    borderRadius: 25,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarStyle: {
    borderRadius: 25,
    overflow: 'hidden',
  },
});

export default CalendarPage;
