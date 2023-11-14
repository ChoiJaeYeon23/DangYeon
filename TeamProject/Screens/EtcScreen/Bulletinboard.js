import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 검색 바와 플러스 아이콘 버튼
const Bulletinboard = () => {
  return (
    <View style={styles.container}>
      {/* 검색 섹션: 아이콘과 입력 필드를 가로로 배열 */}
      <View style={styles.searchSection}>
        {/* 검색 아이콘 */}
        <Ionicons name="ios-search" size={20} color="#000" style={styles.searchIcon} />
        {/* 사용자 입력을 받는 텍스트 입력 필드 */}
        <TextInput
          style={styles.input}
          placeholder="검색"
          placeholderTextColor="#000"
        />
      </View>
      {/* 플러스 아이콘 버튼 */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="ios-add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // 컨테이너의 시작 부분에서 컨텐츠를 정렬
    alignItems: 'center',
    backgroundColor: '#FFF9F9',
    paddingTop: 50, // 여백
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6E6E6',
    paddingHorizontal: 10,
    borderRadius: 20,
    width: '90%',
    height: 40,
  },
  searchIcon: {
    padding: 5,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#F6E6E6',
    color: '#716B6B',
    placeholderTextColor: '#C7C7CD', // 흐린 회색으로 플레이스홀더 텍스트 색상 변경
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#9D9692', // 배경색
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});

export default Bulletinboard;