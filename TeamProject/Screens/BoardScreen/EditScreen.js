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
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const EditScreen = ({ route, navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  // 게시글 정보 로드
  useEffect(() => {
    if (route.params?.post) {
      const { title, content, images } = route.params.post;
      setTitle(title);
      setContent(content);
      setImages(images ? images : []);
    }
  }, [route.params?.post]);

  // 게시글 수정 저장 로직
  const editPost = async () => {
    try {
      const formData = new FormData();

      // 제목과 내용을 FormData에 추가
      formData.append("title", title);
      formData.append("content", content);

      // 이미지 파일을 FormData에 추가
      images.forEach((image, index) => {
        // 여기에서는 이미지의 로컬 URI를 가정합니다.
        // 실제 파일 형식과 이름을 적절하게 처리해야 할 수 있습니다.
        const { uri } = image;
        formData.append("img", {
          uri: uri,
          name: `수정화면 이미지_${index}.jpg`, // 임시 파일명
          type: "image/jpeg", // 파일 형식
        });
      });
      // Fetch 요청
      await fetch(
        `http://3.34.6.50:8080/api/update_post/${route.params.post.post_id}`,
        {
          method: "PUT",
          body: formData, // FormData 사용
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
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="제목"
      />
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="내용"
        multiline
      />
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </View>
      <Button title="이미지 선택" onPress={pickImage} />
      <Button title="저장" onPress={editPost} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginVertical: 5,
  },
  imageContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});

export default EditScreen;
