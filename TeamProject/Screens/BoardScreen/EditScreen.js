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

  // 이미지 선택
  const pickImage = async () => {
    // 추가할 예정
  };

  // 게시글 수정 저장 로직
  const editPost = async () => {
    try {
      const updatedPost = {
        title: title,
        content: content,
        img: images.map((img) => img.uri),
      };

      await fetch(
        `http://3.34.6.50:8080/api/update_post/${route.params.post.post_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPost),
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
