import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Image
} from 'react-native';

const BucketList = () => {
  const [text, setText] = useState(''); // 입력된 텍스트 관리
  const [list, setList] = useState([]); // 버킷리스트 항목 관리
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null); // 삭제할 항목 관리

  // 서버에서 버킷리스트 데이터 로드// 서버에서 버킷리스트 데이터 로드
const loadBucketList = async () => {
  try {
    const response = await fetch('http://3.34.6.50:8080/api/bucketlist', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.length === 0) {
        // 데이터가 비어 있는 경우
        console.log("Bucket list is empty.");
        setList([]);
      } else {
        // 데이터가 있는 경우
        const formattedData = data.map(item => ({
          bucket_id: item.bucket_id,
          text: item.bucket_text,
          isCompleted: item.isCompleted === 1
        }));
        setList(formattedData);
      }
    } else {
      console.error('Failed to fetch bucket list');
    }
  } catch (error) {
    console.error('Error fetching bucket list:', error);
  }
};

  useEffect(() => {
    loadBucketList();
  }, []);

  
  // 서버에 버킷리스트 항목 추가 요청 보내기
  const addToBucketList = async (newItem) => {
    try {
      const response = await fetch('http://3.34.6.50:8080/api/bucketlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        loadBucketList(); // 리스트 상태 업데이트를 위해 다시 로드
      } else {
        console.error('Failed to add item to bucket list');
      }
    } catch (error) {
      console.error('Error adding item to bucket list:', error);
    }
  };

  // 버킷리스트 추가 모달, 저장, 리스트 항목에 추가
  const handleModalAndAdd = () => {
    if (modalVisible) {
      if (text.trim() !== '') {
        const newItem = { text, isCompleted: false };
        addToBucketList(newItem);
        setText('');
      }
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  };

  // 삭제 확인 모달
  const showDeleteConfirmation = (index) => {
    setDeleteIndex(index);
    setDeleteConfirmationVisible(true);
  };

  // 리스트에서 항목 제거 및 서버에 삭제 요청
  const removeFromList = async () => {
    const itemToDelete = list[deleteIndex];
    if (!itemToDelete || !itemToDelete.bucket_id) {
      console.error('Error: Invalid item or bucket_id is missing');
      return;
    }

    try {
      // 서버에 삭제 요청을 보냅니다.
      const response = await fetch(`http://3.34.6.50:8080/api/bucketlist/${itemToDelete.bucket_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 삭제 성공 시 클라이언트 상태 업데이트
        const newList = list.filter((_, idx) => idx !== deleteIndex);
        setList(newList);
      } else {
        console.error('Failed to delete item from bucket list');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }

    setDeleteConfirmationVisible(false);
    setDeleteIndex(null);
  };

  // 삭제 취소
  const cancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setDeleteIndex(null);
  };

  // 항목 완료 상태// 항목 완료 상태 토글// 항목 완료 상태 토글
  const toggleCompletion = async (index) => {
    const item = list[index];
    if (!item.bucket_id) {
      console.error('Bucket ID is undefined');
      return;
    }
    const updatedItem = { ...item, isCompleted: !item.isCompleted };

    try {
      const response = await fetch(`http://3.34.6.50:8080/api/bucketlist/${item.bucket_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: updatedItem.isCompleted }),
      });

      if (response.ok) {
        const newList = list.map((it, idx) => idx === index ? updatedItem : it);
        setList(newList);
      } else {
        console.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // 버킷리스트 완료 상태에 따라 다른 하트 표시
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
            <TouchableOpacity style={styles.closeButton} onPress={handleModalAndAdd}>
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.modalInput}
              placeholder="버킷리스트를 입력하세요."
              placeholderTextColor="#C0C0C0"
              value={text}
              onChangeText={setText}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleModalAndAdd}>
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
                <Text>예</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteModalButton} onPress={cancelDelete}>
                <Text>아니오</Text>
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
      <TouchableOpacity style={styles.addButton} onPress={handleModalAndAdd}>
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