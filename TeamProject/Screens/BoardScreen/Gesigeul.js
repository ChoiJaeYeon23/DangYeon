import React, { useState, useEffect } from "react";
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
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const Gesigeul = ({ route }) => {
  const [title, setTitle] = useState(""); // 제목 입력 상태
  const [text, setText] = useState(""); // 내용 입력 상태
  const [imageSources, setImageSources] = useState([]); // 이미지 소스 배열
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 상태
  const [postIdToEdit, setPostIdToEdit] = useState(null); // 수정할 게시물의 ID 저장
  const navigation = useNavigation();
  const [textEditMode, setTextEditMode] = useState(false);

  // 이미지 선택
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("권한 필요", "갤러리에 접근하기 위한 권한이 필요합니다.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      setImageSources(result.assets.map((asset) => ({ uri: asset.uri })));
    }
  };

  // 저장 버튼 클릭 시 호출되는 함수
  const handleSavePress = () => {
    const postData = {
      title: title,
      content: text,
      img: imageSources.map((source) => source.uri),
    };

    fetch("http://3.34.6.50:8080/api/add_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Server response not OK");
        }
        return response.json();
      })
      .then((data) => {
        navigation.navigate("Board", { newPostData: data });
      })
      .catch((error) => console.error("Error adding post:", error));
    console.log(postData);
  };

  // 모달의 확인 버튼 클릭 시 호출되는 함수
  const handleConfirmPress = () => {
    setModalVisible(false); // 모달 닫기
    Keyboard.dismiss(); // 키보드 숨기기
  };

  // 수정할 게시글 데이터가 있는 경우, 수정한 게시글로 업데이트
  useEffect(() => {
    // 수정할 게시글 데이터 확인
    if (route.params?.editingPost) {
      const { title, text, images, id } = route.params.editingPost;
      setTitle(title);
      setText(text);
      setImageSources(images.map((uri) => ({ uri })));
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
      <TextInput
        style={styles.titleInput} // 제목 입력란 스타일
        onChangeText={setTitle} // 제목 변경 시 호출
        value={title} // 제목 상태값
        placeholder="제목을 입력하세요." // 제목 입력 플레이스홀더 텍스트
        placeholderTextColor="#989292" // 제목 입력 플레이스홀더 텍스트 색상
      />
      <TouchableOpacity
        onPress={() => {
          if (!textEditMode) setTextEditMode(true);
        }}
        style={styles.inputContainer}
      >
        {textEditMode ? (
          <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text}
            multiline
            autoFocus
          />
        ) : text.length === 0 ? (
          <Text style={styles.input}>내용을 입력하세요.</Text>
        ) : null}
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
              placeholder="내용을 입력하세요." // 플레이스홀더 텍스트 추가
              placeholderTextColor="#989292" // 플레이스홀더 텍스트 색상 설정
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
    backgroundColor: "#FFF9F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  doneButton: {
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#FDE0E0",
  },
  doneText: {
    fontSize: 12,
    color: "black",
  },
  titleInput: {
    fontSize: 18, // 제목 폰트 크기
    fontWeight: "bold", // 제목 폰트 굵기
    color: "black", // 제목 폰트 색상
    margin: 10, // 외부 여백
    borderBottomWidth: 1, // 하단 테두리 추가
    borderColor: "gray", // 테두리 색상
  },
  inputContainer: {
    borderColor: "gray",
    padding: 10,
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    color: "#989292",
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
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
  },
  cameraButton: {
    alignItems: "center",
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-start", // 화면 상단에 정렬
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // 배경을 어둡게 조정
  },
  inputBox: {
    marginTop: 98, // "게시판" 텍스트 아래에 위치하도록 marginTop 조정
    width: "100%", // 전체 너비
    backgroundColor: "white", // 배경색 흰색
    alignItems: "center",
    padding: 20,
  },
  modalInput: {
    width: "100%", // 입력 박스 너비
    minHeight: 200, // 입력 박스 최소 높이
    padding: 10, // 내부 패딩
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Gesigeul;
