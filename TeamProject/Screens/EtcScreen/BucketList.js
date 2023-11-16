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
  const [text, setText] = useState(''); // 입력된 텍스트 관리
  const [list, setList] = useState([]); // 버킷리스트 항목 관리
  const [modalVisible, setModalVisible] = useState(false); 
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null); // 삭제할 항목 관리

  // 버킷리스트에 새 항목 추가
  const addToList = () => {
    if (text.trim() !== '') {
      setList([...list, { text, isCompleted: false }]);
      setText('');
      setModalVisible(false);
    }
  };
 // 삭제 확인 모달 표시 
  const showDeleteConfirmation = (index) => {
    setDeleteIndex(index);
    setDeleteConfirmationVisible(true);
  };
  // 리스트에서 항목 삭제 
  const removeFromList = () => {
    setList((currentList) => currentList.filter((_, idx) => idx !== deleteIndex));
    setDeleteConfirmationVisible(false);
    setDeleteIndex(null);
  };
  // 삭제 버튼 아니요
  const cancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setDeleteIndex(null);
  };
 // 항목 완료 상태 
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
      <Image
        source={item.isCompleted ? require('../../assets/heart.png') : require('../../assets/Binheart.png')}
        style={styles.icon}
      />
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
        contentContainerStyle={{ paddingTop: 30 }} 
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
    justifyContent: 'flex-start',
    marginVertical: 10,
    paddingLeft: 40,
  },
  text: {
    fontSize: 18, 
  },
  icon: {
    width: 24, 
    height: 24, 
    marginRight: 10, 
  },
  addButton: {
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10, 
  },
  addButtonText: {
    fontSize: 18, 
    color: '#000000', 
    padding: 20,
  },
  saveButton: {
    borderWidth: 1, 
    borderColor: '#000000', 
    backgroundColor: '#EBDBDB', 
    borderRadius: 50, 
    padding: 5, 
    marginTop: 5, 
    width: '30%',
    alignItems: 'center', 
  },
  saveButtonText: {
    color: '#000000', 
    fontSize: 18, 
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },
  modalView: {
    width: '90%', 
    borderWidth: 1, 
    backgroundColor: 'white', 
    borderColor: '#000000', 
    borderRadius: 10, 
    padding: 30, 
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
    width: '100%', 
    marginBottom: 15, 
    borderBottomWidth: 1, 
    padding: 10, 
    textAlign: 'center', 
  },
  closeButton: {
    alignSelf: 'flex-start', 
    position: 'absolute', 
    top: 10, 
    left: 10, 
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
  strikethrough: {
    textDecorationLine: 'line-through', 
    color: '#d3d3d3',
  },
  deleteModalView: {
    width: '80%', 
    borderWidth: 1, 
    backgroundColor: 'white',
    borderColor: '#000000', 
    borderRadius: 10, 
    padding: 30, 
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
   justifyContent: 'center', 
  },
  deleteModalButton: {
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#EBDBDB',
    borderRadius: 50,
    padding: 5,
    marginTop: 5,
    width: '40%',
    alignItems: 'center',
    elevation: 4,
    marginHorizontal: 10, 
  },
  header: {
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#D18D8D', 
    width: '80%', 
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#000000',
  },
});

export default BucketList;