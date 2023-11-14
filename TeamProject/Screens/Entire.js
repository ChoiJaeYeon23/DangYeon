import React from 'react';
import { View, StyleSheet,Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Entire = () => {
  const firstDots = Array.from({ length: 15 }, (_, i) => i); // 15개의 점을 생성
  const secondDots = Array.from({ length: width / 20 }, (_, i) => i);

  return (
    <View style={styles.container}>
      {/* 상단의 두 개의 핑크 상자 */}
      <View style={styles.boxContainer}>
        <View style={[styles.box, styles.firstBox]} />
        <View style={styles.box} />
      </View>
      
      {/* 첫 번째 실선 */}
      <View style={styles.dotsContainer}>
        {firstDots.map((_, index) => (
          <View key={index} style={styles.dot} />
        ))}
      </View>
        {/*버킷리스트 상자*/}
      <View style={styles.ListBox}>
        <Text
          style={styles.ListBoxText}
          onPress={() => navigation.navigate('BucketList')} // 'BucketList'로 이동
        >
          버킷리스트
        </Text>
      </View>
      {/* 두 번째 점선 */}
      <View style={styles.secondDotsContainer}>
        {secondDots.map((_, index) => (
          <View key={`second-dot-${index}`} style={styles.secondDot} />
        ))}
      </View>
      {/*출석체크 상자*/}
      <View style={styles.Check}>
        <Text
          style={styles.CheckText}
          onPress={() => navigation.navigate('BucketList')} // 'BucketList'로 이동
        >
          출석체크
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F9', // 배경색을 연한 핑크색으로 설정
    alignItems: 'center',
    paddingTop: 50, // 상단 여백
  },
  boxContainer: {
    flexDirection: 'row', // 상자를 가로로 나란히 배열
    justifyContent: 'space-around', // 상자 사이에 공간을 동일하게 배분
    width: '100%', // 부모 컨테이너를 꽉 채우도록 설정
  },
  box: {
    width: width * 0.4, // 너비를 화면의 40%로 설정
    height: width * 0.8, // 높이를 너비의 80%로 설정
    backgroundColor: '#FFD9D9', // 상자 배경색을 연한 핑크색으로 설정
  },
  firstBox: {
    marginBottom: 15, // 첫 번째 상자의 아래쪽 여백
  },
  dotsContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginVertical: 15, // 점선 위아래 여백
  },
  dot: {
    width: 10, // 점의 너비
    height: 1, // 점의 높이
    backgroundColor: 'black', // 점의 색상
  },
  secondDotsContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginVertical: 20, // 두 번째 점선 위아래 여백
  },
  secondDot: {
    width: 10, // 점의 너비
    height: 1, // 점의 높이
    backgroundColor: 'black', // 점의 색상
    marginRight: 10, // 점 사이의 간격
  },
  ListBox: {
    backgroundColor: '#FFD9D9', // 갈색 설정
    width: width * 0.8, // 화면 너비의 80%
    height: width * 0.3, // 화면 너비의 30%
    justifyContent: 'center', // 내용을 중앙에 정렬
    alignItems: 'center', // 내용을 중앙에 정렬
    marginVertical: 20, // 위아래 여백 설정
  },
  Check: {
    backgroundColor: '#FFD9D9', // 갈색 설정
    width: width * 0.8, // 화면 너비의 80%
    height: width * 0.3, // 화면 너비의 30%
    justifyContent: 'center', // 내용을 중앙에 정렬
    alignItems: 'center', // 내용을 중앙에 정렬
    marginVertical: 20, // 위아래 여백 설정
  },
});

export default Entire;