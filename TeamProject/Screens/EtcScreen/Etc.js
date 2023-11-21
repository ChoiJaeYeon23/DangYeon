import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Etc = ({ navigation }) => {
  const [bucketList, setBucketList] = useState([]);

  const firstDots = Array.from({ length: 15 }, (_, i) => i); // 15개의 점 생성
  const secondDots = Array.from({ length: Math.floor(width / 20) }, (_, i) => i); // 화면 너비에 따른 점 생성

  useEffect(() => {
    AsyncStorage.getItem('@bucketList')
      .then((data) => {
        if (data !== null) {
          setBucketList(JSON.parse(data));
        }
      })
      .catch((error) => console.error(error));
  }, []);

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

      {/* 버킷리스트 상자 */}
      <View style={styles.ListBox}>
        <Text style={styles.ListBoxText} onPress={() => navigation.navigate('BucketList')}>
          버킷리스트
        </Text>
        {bucketList.map((item, index) => (
          <Text key={index}>{item.text}</Text>
        ))}
      </View>

      {/* 두 번째 점선 */}
      <View style={styles.secondDotsContainer}>
        {secondDots.map((_, index) => (
          <View key={`second-dot-${index}`} style={styles.secondDot} />
        ))}
      </View>

      {/* 출석체크 상자 */}
      <View style={styles.Check}>
        <Text style={styles.CheckText} onPress={() => navigation.navigate('BucketList')}>
          출석체크
        </Text>
      </View>
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
    backgroundColor: '#FFD9D9', 
    width: width * 0.8, 
    height: width * 0.3, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginVertical: 20, 
  },
  Check: {
    backgroundColor: '#FFD9D9', 
    width: width * 0.8,
    height: width * 0.3, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginVertical: 20, 
  },
});

export default Etc;