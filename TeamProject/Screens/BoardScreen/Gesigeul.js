import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Modal,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const Gesigeul = ({ route }) => {
  const [text, setText] = useState('');
  const [imageSources, setImageSources] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [postIdToEdit, setPostIdToEdit] = useState(null); // 수정할 게시물의 ID 저장
  const navigation = useNavigation();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '갤러리에 접근하기 위한 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      setImageSources(result.assets.map(asset => ({ uri: asset.uri })));
    }
  };

  const handleSavePress = () => {
    console.log('내용 저장: ', text);
  
    const postData = {
      text: text,
      images: imageSources.map(source => source.uri)
    };
  
    if (postIdToEdit !== null) {
      // 수정된 게시물 데이터를 Board 컴포넌트로 전달
      const editedPost = {
        id: postIdToEdit,
        ...postData,
      };
      navigation.navigate('Board', { editedData: editedPost });
    } else {
      // 새로운 게시물 데이터를 Board 컴포넌트로 전달
      navigation.navigate('Board', { postData: postData });
    }
  
  };

  const handleConfirmPress = () => {
    setModalVisible(false); // 모달 닫기
    Keyboard.dismiss(); // 키보드 숨기기
  };

  useEffect(() => {
    // 수정할 게시글 데이터 확인
    if (route.params?.editingPost) {
      const { text, images, id } = route.params.editingPost;
      setText(text);
      setImageSources(images.map(uri => ({ uri })));
      setPostIdToEdit(id);
    }
  }, [route.params?.editingPost]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.doneButton} onPress={handleSavePress}>
          <Text style={styles.doneText}>저장</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputContainer}>
        <Text style={styles.input}>
          {text ? text : "내용을 입력하세요."}
        </Text>
      </TouchableOpacity>
      <ScrollView horizontal style={styles.imageScroll}>
        {imageSources.map((source, index) => (
          <Image key={index} source={source} style={styles.image} />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <Icon name="camera" size={30} color="#808080" />
        </TouchableOpacity>
      </View>

      {/* 글쓰기 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          {/* 하얀색 입력 박스를 나타내는 새로운 View 컨테이너 */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.modalInput}
              onChangeText={setText}
              value={text}
              placeholder="내용을 입력하세요."  // 플레이스홀더 텍스트 추가
              placeholderTextColor="#989292"  // 플레이스홀더 텍스트 색상 설정
              multiline
              autoFocus
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleConfirmPress}
            >
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  doneButton: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#FDE0E0',
  },
  doneText: {
    fontSize: 12,
    color: 'black',
  },
  inputContainer: {
    borderColor: 'gray',
    padding: 10,
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    color: '#989292',
  },
  imageScroll: {
    height: 210,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
  },
  cameraButton: {
    alignItems: 'center',
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start', // 화면 상단에 정렬
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // 배경을 어둡게 조정
  },
  modalView: {
    top:50,
    width: '100%', // 전체 너비
    height: '33%', // 화면 높이의 1/3
    backgroundColor: 'white', // 배경색 흰색
    paddingTop: 5, // 상단 패딩 감소
    borderTopLeftRadius: 20, // 상단 왼쪽 모서리 둥글게
    borderTopRightRadius: 20, // 상단 오른쪽 모서리 둥글게
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputBox: {
    marginTop: 98, // "게시판" 텍스트 아래에 위치하도록 marginTop 조정
    width: '100%', // 전체 너비
    backgroundColor: 'white', // 배경색 흰색
    alignItems: 'center',
    padding: 20,
  },
  modalInput: {
    width: '100%', // 입력 박스 너비
    minHeight: 200, // 입력 박스 최소 높이
    padding: 10, // 내부 패딩
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Gesigeul;
