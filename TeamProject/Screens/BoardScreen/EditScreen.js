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
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              onPress={() => removeImage(index)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
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
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
  },
});

export default EditScreen;
