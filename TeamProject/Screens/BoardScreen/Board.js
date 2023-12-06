import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

const Board = ({ route }) => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // 게시물 목록을 불러오는 함수
  const loadPosts = async () => {
    try {
      const response = await fetch("http://3.34.6.50:8080/api/load_post");
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // 게시물 삭제 함수
  const deletePost = async (postId) => {
    try {
      await fetch(`http://3.34.6.50:8080/api/del_post/${postId}`, {
        method: "DELETE",
      });
      Alert.alert("게시글 삭제 성공");
      loadPosts();
    } catch (error) {
      Alert.alert("게시글 삭제 실패");
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  // 게시물 수정 함수
  const editPost = async (postId, updatedPost) => {
    try {
      await fetch(`http://3.34.6.50:8080/api/update_post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });
      loadPosts();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // 게시물 옵션 함수
  const openOptions = (post) => {
    if (!post) {
      console.error("Post is undefined");
      return;
    }
    Alert.alert(
      "게시물",
      null,
      [
        { text: "수정", onPress: () => editPost(post.post_id, post) },
        {
          text: "삭제",
          onPress: () => deletePost(post.post_id),
          style: "destructive",
        },
        { text: "취소", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    console.log("Filtered posts:", filteredPosts);
  }, [filteredPosts]);

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Ionicons
          name="ios-search"
          size={20}
          color="#000"
          style={styles.searchIcon}
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          console.log("Add button pressed");
          navigation.navigate("Gesigeul");
        }}
      >
        <Ionicons name="ios-add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <ScrollView>
        {filteredPosts.map((post, index) => (
          <View key={post.post_id} style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Text style={styles.postTitle}>게시글 번호 : {post.post_id}</Text>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postDate}>
                {post.createdAt && !isNaN(new Date(post.createdAt).getTime())
                  ? format(new Date(post.createdAt), "yyyy/MM/dd HH:mm")
                  : "날짜 정보 없음"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => openOptions(post)}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
            </TouchableOpacity>
            <Swiper
              style={styles.wrapper}
              showsButtons={false}
              loop={false}
              paginationStyle={styles.pagination}
              dotStyle={styles.dotContainer}
              activeDotStyle={styles.activeDotContainer}
            >
              {(post.images || []).map((uri, idx) => (
                <View key={idx} style={styles.slide}>
                  <Image
                    source={{ uri: uri }}
                    style={styles.postImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </Swiper>
            <View style={styles.dotTextContainer}>
              <Text style={styles.postText}>{post.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF9F9",
    paddingTop: 20,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6E6E6",
    paddingHorizontal: 10,
    borderRadius: 20,
    width: "90%",
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
    backgroundColor: "#F6E6E6",
    color: "#716B6B",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#9D9692",
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    zIndex: 1,
  },
  postContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    padding: 10,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postTitle: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  postDate: {
    fontSize: 12,
    color: "#333",
  },
  wrapper: {
    height: 250,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  postText: {
    fontSize: 16,
    color: "black",
    marginVertical: 10,
  },
  optionsButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  pagination: {
    position: "absolute",
    bottom: -25,
  },
  dotContainer: {
    backgroundColor: "transparent",
    width: 10, // 동그라미 너비 조정
    height: 10, // 동그라미 높이 조정
    borderRadius: 7,
    borderWidth: 1, // 테두리 두께 설정
    borderColor: "#949494", // 테두리 색상 설정
    marginLeft: 3,
    marginRight: 3,
  },
  activeDotContainer: {
    backgroundColor: "#949494",
    width: 11,
    height: 11,
    borderRadius: 6,
    marginLeft: 3,
    marginRight: 3,
  },
  dotTextContainer: {
    marginTop: 20, // 동그라미 아래 텍스트와 간격 조정
  },
});

const saveData = async (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonData);
  } catch (error) {
    console.error("데이터 저장 중 오류 발생:", error);
  }
};

const loadData = async (key) => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    if (jsonData !== null) {
      return JSON.parse(jsonData);
    }
  } catch (error) {
    console.error("데이터 불러오기 중 오류 발생:", error);
  }
  return null;
};

export default Board;
