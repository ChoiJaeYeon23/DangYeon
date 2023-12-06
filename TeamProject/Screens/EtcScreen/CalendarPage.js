import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import CandyImage from '../../assets/candy.png';

// 달력 한국어 설정
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  dayNames: ['일', '월', '화', '수', '목', '금', '토'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

// 달력 날짜 컴포넌트 정의
const CustomDay = ({ date, state, marking }) => {
  const isMarked = marking && marking.customStyles;
  const textColor = state === 'disabled' ? '#d9d9d9' : 'black';

  return (
    <View style={styles.customDayContainer}>
      <Text style={[styles.customDayText, { color: textColor }]}>{date.day}</Text>
      {isMarked && <Image source={marking.customStyles.image} style={styles.candyImage} />}
    </View>
  );
};

// 달력 페이지 컴포넌트
const CalendarPage = () => {
  const [markedDates, setMarkedDates] = useState({}); // 각 날짜에 캔디 이미지를 표시
  const [candyCounts, setCandyCounts] = useState({}); // 월별 캔디 수 저장
  const [totalCandyCount, setTotalCandyCount] = useState(0); // 전체 캔디 수

  useEffect(() => {
    const loadAttendanceData = async () => {
      try {
        // 출석체크 캔디와 만보기 캔디를 불러옵니다.
        const attendanceValue = await AsyncStorage.getItem('@attendance');
        let pedometerCandyValue = await AsyncStorage.getItem('@candies');
        pedometerCandyValue = pedometerCandyValue ? parseInt(pedometerCandyValue, 10) : 0;

        let newMarkedDates = {};
        let newCandyCounts = {};
        let totalCandyCount = pedometerCandyValue; // 만보기 캔디로 초기화

        if (attendanceValue !== null) {
          // 출석체크 캔디를 계산
          const attendance = JSON.parse(attendanceValue);
          let currentMonth = moment().month() + 1; // 현재 월
          let monthlyCandyCount = 0;

          attendance.forEach((attended, index) => {
            const day = moment().startOf('isoWeek').add(index, 'days');
            if (attended) {
              newMarkedDates[day.format('YYYY-MM-DD')] = {
                customStyles: {
                  image: CandyImage,
                },
              };

              if (day.month() + 1 !== currentMonth) {
                currentMonth = day.month() + 1;
                monthlyCandyCount = 0;
              }

              monthlyCandyCount++;
              totalCandyCount++; // 출석체크 캔디를 전체 캔디 수에 추가
              newCandyCounts[currentMonth] = monthlyCandyCount;
            }
          });
        }

        setMarkedDates(newMarkedDates);
        setCandyCounts(newCandyCounts);
        setTotalCandyCount(totalCandyCount); // 전체 캔디 수 업데이트
      } catch (error) {
        console.error('Error loading attendance data', error);
      }
    };

    loadAttendanceData();
  }, []);

  // 달력에 년도 월 표시 부분
  const CustomHeader = (month) => {
    let headerDate;
    if (moment(month).isValid()) {
      headerDate = moment(month); // month가 유효한 날짜일 경우
    } else {
      console.error("Invalid date format:", month);
      headerDate = moment(); // 현재 날짜를 기본값으로 사용
    }
    const yearMonthInKorean = headerDate.format('YYYY년 M월');

    return (
      <View style={styles.customHeaderContainer}>
        <Text style={styles.customHeaderText}>{yearMonthInKorean}</Text>
      </View>
    );
  };

    // 전체 캔디 수를 불러오는 함수
    const loadTotalCandyCount = async () => {
      try {
        const totalCandyValue = await AsyncStorage.getItem('@totalCandyCount');
        if (totalCandyValue !== null) {
          setTotalCandyCount(parseInt(totalCandyValue));
        }
      } catch (error) {
        console.error('Error loading total candy count', error);
      }
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
          // 달력 스타일링 테마 설정
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
            'stylesheet.calendar.header': {
              dayHeader: {
                fontWeight: '600',
                color: '#6B6B6B',
              },
            },
            arrowColor: 'pink',
          }}
        />
      </View>
      <View style={styles.candyCountContainer}>
        {/* 이번 달 캔디 수 */}
        <View style={styles.candyCountInnerContainer}>
          <Text style={styles.candyCountTitle}>이번달 캔디 수</Text>
          <View style={styles.candyBox}>
            <Image source={CandyImage} style={styles.candystyle} />
            <Text style={[styles.candyCountText, { marginLeft: 15 }]}>
              {candyCounts[moment().month() + 1] || 0}
            </Text>
          </View>

        </View>

        {/* 전체 캔디 수 */}
        <View style={styles.candyCountInnerContainer}>
          <Text style={styles.candyCountTitle}>전체 캔디 수</Text>
          <View style={styles.candyBox}>
            <Image source={CandyImage} style={styles.candystyle} />
            <Text style={[styles.candyCountText,{ marginLeft: 15 }]}>
              {totalCandyCount}
              </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // 각 항목을 가로로 나열
    marginTop: 90,
  },
  candyCountInnerContainer: {
    alignItems: 'center',
  },
  candyCountTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  candyBox: {
    flexDirection: 'row',
    alignItems: 'center',
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