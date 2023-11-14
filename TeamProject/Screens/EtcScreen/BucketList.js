import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Image } from 'react-native';

const BucketList = () => {
  const [text, setText] = useState('');
  const [list, setList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const addToList = () => {
    if (text.trim() !== '') {
      setList([...list, { text, isCompleted: false }]);
      setText('');
      setModalVisible(false);
    }
  };

  const showDeleteConfirmation = (index) => {
    setDeleteIndex(index);
    setDeleteConfirmationVisible(true);
  };

  const removeFromList = () => {
    setList((currentList) => currentList.filter((_, idx) => idx !== deleteIndex));
    setDeleteConfirmationVisible(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setDeleteIndex(null);
  };

  const toggleCompletion = (index) => {
    setList((currentList) =>
      currentList.map((item, idx) =>
        idx === index ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => toggleCompletion(index)}>
      {/* <Image
        source={item.isCompleted ? require('../../assets/heart.png') : require('../../assets/Bingeart.png')}
        style={styles.icon}
      /> */}
      </TouchableOpacity>
      <Text
        style={[
          styles.text,
          item.isCompleted && styles.strikethrough,
        ]}
        onPress={() => showDeleteConfirmation(index)}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>버킷리스트</Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.modalInput}
              placeholder="버킷리스트를 입력하세요."
              placeholderTextColor="#C0C0C0"
              value={text}
              onChangeText={setText}
            />
            <TouchableOpacity style={styles.saveButton} onPress={addToList}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteConfirmationVisible}
        onRequestClose={cancelDelete}
      >
        <View style={styles.centeredView}>
          <View style={styles.deleteModalView}>
            <Text style={styles.deleteModalText}>{`"${list[deleteIndex]?.text}"을(를) 삭제하시겠습니까?`}</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity style={styles.deleteModalButton} onPress={removeFromList}>
                <Text style={styles.buttonText}>예</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteModalButton} onPress={cancelDelete}>
                <Text style={styles.buttonText}>아니오</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ 버킷리스트 추가</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F9',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // 항목들을 왼쪽으로 정렬
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 18,
  },
icon: {
  width: 24, // Set the width of your icon
  height: 24, // Set the height of your icon
  marginRight: 10, // Keep your margin as is
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  addButtonText: {
    fontSize: 18,
    color: '#000000',
  },
  saveButton: {
    borderWidth: 1, // 테두리 두께 설정
    borderColor: '#000000', // 테두리 색상 설정
    backgroundColor: '#EBDBDB', // 배경 색상 설정
    borderRadius: 50, // 테두리 둥글게 설정
    padding: 5, // 내부 여백 설정
    marginTop: 5, // 버튼 상단 여백
    width: '40%', // 너비를 부모 요소에 맞춤
    alignItems: 'center', // 자식 요소를 중앙 정렬
  },
  saveButtonText: {
    color: '#000000', // 텍스트 색상
    fontSize: 18, // 폰트 크기 설정
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    width: '90%', // 모달 창의 너비를 조정
    borderWidth: 1, // 테두리 두께 설정
    backgroundColor: 'white',
    borderColor: '#000000', // 테두리 색상 설정
    borderRadius: 10, // 테두리 둥글게 조정정
    padding: 30, // 여백
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalInput: {
    height: 50,
    width: '100%', // 입력 창의 너비를 모달 크기에 맞게 조정
    marginBottom: 15,
    borderBottomWidth: 1, // 하단 테두리만 표시
    padding: 10,
    textAlign: 'center', // 텍스트를 가운데 정렬
  },
  closeButton: {
    alignSelf: 'flex-start',
    position: 'absolute', // 버튼을 모달 뷰 내에서 절대적 위치로 설정
    top: 10,
    left: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
  strikethrough: {
    textDecorationLine: 'line-through', // 완료된 항목에 줄 긋기
    color: '#d3d3d3', // 완료된 항목의 텍스트 색상 변경
  },
  deleteModalView: {
    width: '90%', // 모달 창의 너비를 조정
    borderWidth: 1, // 테두리 두께 설정
    backgroundColor: 'white',
    borderColor: '#000000', // 테두리 색상 설정
    borderRadius: 10, // 테두리 둥글게 조정정
    padding: 30, // 여백
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteModalText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  deleteModalButtons: {
    flexDirection: 'row',
   justifyContent: 'center', // 버튼들을 중앙 정렬로 변경
  },
  deleteModalButton: {
    borderWidth: 1, // 테두리 두께 설정
    borderColor: '#000000', // 테두리 색상 설정
    backgroundColor: '#EBDBDB', // 배경 색상 설정
    borderRadius: 50, // 테두리 둥글게 설정
    padding: 5, // 내부 여백 설정
    marginTop: 5, // 버튼 상단 여백
    width: '100%', // 너비를 부모 요소에 맞춤
    alignItems: 'center', // 자식 요소를 중앙 정렬
    elevation: 4,
    marginHorizontal: 5,
  },
  header: {
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#958585',
    width: '80%', // Adjust this value to control the width of the line
    alignSelf: 'center', // Center the line in the header
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#000000',
  },
});

export default BucketList;