import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Etc = ({ navigation }) => { 
  const firstDots = Array.from({ length: 15 }, (_, i) => i);
  const secondDots = Array.from({ length: width / 20 }, (_, i) => i);
  const [bucketListItems, setBucketListItems] = useState([]);

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@bucketList');
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        setBucketListItems(data.slice(0, 2)); // 최대 두 개의 항목만 설정
      }
    } catch(e) {
      console.error("Error loading data", e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 1000); // 1초마다 데이터를 다시 로드하여 업데이트

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 정리
  }, []);

  return (
    <View style={styles.container}>
    <View style={styles.boxContainer}>
      {/* 왼쪽 박스에 "만보기" 텍스트 추가 */}
      <View style={[styles.box, styles.firstBox]}>
        <Text style={styles.boxText} onPress={() => navigation.navigate('PedometerScreen')}>만보기</Text>
      </View>
      <View style={styles.box} />
    </View>
      
      {/* 첫 번째 실선 */}
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
          onPress={() => navigation.navigate('BucketList')} 
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
    justifyContent: 'flex-start', // 여기를 변경
    alignItems: 'flex-start', // 항목이 없을 때도 왼쪽 정렬 유지
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
    marginTop: 15, // 상단 여백 추가
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
});

export default Etc;