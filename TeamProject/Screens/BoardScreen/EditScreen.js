import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";

const EditScreen = ({ route, navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  // 이미지 선택
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };

  // 이미지 삭제
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // 게시글 정보 로드
  useEffect(() => {
    if (route.params?.post) {
      const { title, content, img } = route.params.post;
      setTitle(title);
      setContent(content);
      setImages(img ? [img] : []);
    }
  }, [route.params?.post]);

  // 게시글 수정 저장 로직
  // 게시글 수정 저장 로직
  const editPost = async () => {
    try {
      const formData = new FormData();

      // 제목과 내용을 FormData에 추가
      formData.append("title", title);
      formData.append("content", content);

      // 이미지 파일을 FormData에 추가
      images.forEach((uri, index) => {
        formData.append("img", {
          uri,
          name: `수정화면 이미지_${index}.jpg`, // 임시 파일명
          type: "image/jpeg", // 파일 형식
        });
      });

      // Fetch 요청
      await fetch(
        `http://3.34.6.50:8080/api/update_post/${route.params.post.post_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      // 수정 후 Board 화면으로 네비게이션
      Alert.alert("수정 성공", "게시글 수정에 성공하엿습니다.");
      navigation.navigate("Board");
    } catch (error) {
      console.error("Error updating post:", error);
      Alert.alert("수정 실패", "게시글 수정에 실패했습니다.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.doneButton} onPress={editPost}>
          <Text style={styles.doneText}>저장</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="제목"
      />
      <TouchableOpacity style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="내용"
        multiline
        autoFocus
      />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              onPress={() => removeImage(index)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>✖</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <Icon name="camera" size={30} color="#808080" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    width: "100%", // 입력 박스 너비
    minHeight: 200, // 입력 박스 최소 높이
    padding: 10, // 내부 패딩
    color:"black",
  },
  titleInput: {
    fontSize: 18, // 제목 폰트 크기
    fontWeight: "bold", // 제목 폰트 굵기
    color: "black", // 제목 폰트 색상
    margin: 10, // 외부 여백
    borderBottomWidth: 1, // 하단 테두리 추가
    borderColor: "gray", // 테두리 색상
  },
  imageContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 5,
    borderRadius: 15,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 25,
  },
  footer: {
    flexDirection: "column", // 아이콘을 세로 방향으로 정렬
    justifyContent: "flex-start", // 아이콘을 상단으로 정렬
    alignItems: "flex-end", // 아이콘을 오른쪽으로 정렬
    padding: 10, // 패딩 설정
  },
  cameraButton: {
    alignItems: "center", // 아이콘을 버튼의 가운데로 정렬
    padding: 10, // 패딩 설정
  },
  doneText: {
    fontSize: 15,
    color: "black",
  },
  doneButton: {
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#FDE0E0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  inputContainer: {
    borderColor: "gray",
    padding: 10,
    marginTop: 10,
  },
});

export default EditScreen;
