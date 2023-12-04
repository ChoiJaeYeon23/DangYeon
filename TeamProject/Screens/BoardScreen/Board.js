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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const Board = ({ route }) => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]); // 게시물 목록을 저장
  const [filteredPosts, setFilteredPosts] = useState([]); // 검색한 게시물 목록
  const [searchText, setSearchText] = useState(''); // 검색 텍스트

  // 게시물 불러오는 함수
  useEffect(() => {
    const loadPosts = async () => {
      const savedPosts = await loadData('posts');
      if (savedPosts) {
        setPosts(savedPosts);
      }
    };
    loadPosts();
  }, []);
  // 게시물 저장하는 함수
  const savePosts = async (newPosts) => {
    setPosts(newPosts);
    await saveData('posts', newPosts);
  };
  // 새 게시물이 추가되거나 수정될 때 게시물 목록 업데이트
  useEffect(() => {
    if (route.params?.postData) {
      const newPost = {
        ...route.params.postData,
        id: Math.random().toString(36).substring(7),
        isLiked: false,
        createdAt: new Date().toISOString(),
      };
      setPosts((currentPosts) => [newPost, ...currentPosts]);
      savePosts([newPost, ...posts]);
    }

    if (route.params?.editedData) {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === route.params.editedData.id
            ? { ...route.params.editedData }
            : post
        )
      );
      savePosts(posts);
    }
  }, [route.params?.postData, route.params?.editedData]);
  // '좋아요' 토글 함수
  const toggleLike = (index) => {
    setPosts((currentPosts) => {
      const updatedPosts = [...currentPosts];
      updatedPosts[index].isLiked = !updatedPosts[index].isLiked;
      return updatedPosts;
    });
    savePosts([...posts]);
  };
  // 댓글 화면으로 이동하는 함수
  const goToComments = (postId) => {
    navigation.navigate('Comments', { postId: postId });
  };
  // 게시물 수정 함수
  const editPost = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    if (postToEdit) {
      navigation.navigate('Gesigeul', { editingPost: postToEdit });
    }
  };

  // 게시물 업데이트 관련 useEffect
  useEffect(() => {
    if (route.params?.editedData) {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === route.params.editedData.id
            ? { ...route.params.editedData }
            : post
        )
      );
    }
  }, [route.params?.editedData]);
  // 게시물 삭제 함수
  const deletePost = (postId) => {
    Alert.alert(
      '게시물 삭제',
      '이 게시물을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          onPress: () => {
            const updatedPosts = posts.filter((post) => post.id !== postId);
            savePosts(updatedPosts);
          },
        },
      ]
    );
  };
  // 게시물 옵션 함수
  const openOptions = (postId) => {
    Alert.alert(
      '게시물',
      null,
      [
        { text: '수정', onPress: () => editPost(postId) },
        { text: '삭제', onPress: () => deletePost(postId), style: 'destructive' },
        { text: '취소', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };
  // 검색 텍스트에 따라 게시물 필터링하는 useEffect
  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.text.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchText, posts]);

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Ionicons name="ios-search" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="검색"
          placeholderTextColor="#C7C7CD"
          value={searchText}
          onChangeText={setSearchText} // 검색어 업데이트
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          console.log('Add button pressed');
          navigation.navigate('Gesigeul');
        }}>
        <Ionicons name="ios-add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <ScrollView>
        {filteredPosts.map((post, index) => (
          <View key={post.id} style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postDate}>
                {post.createdAt && !isNaN(new Date(post.createdAt).getTime())
                  ? format(new Date(post.createdAt), 'yyyy/MM/dd HH:mm:ss')
                  : '날짜 정보 없음'}
              </Text>
            </View>
            <TouchableOpacity style={styles.optionsButton} onPress={() => openOptions(post.id)}>
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
              {post.images.map((uri, idx) => (
                <View key={idx} style={styles.slide}>
                  <Image source={{ uri: uri }} style={styles.postImage} resizeMode="contain" />
                </View>
              ))}
            </Swiper>
            <View style={styles.dotTextContainer}>
              <Text style={styles.postText}>{post.text}</Text>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity onPress={() => toggleLike(index)} style={styles.actionButton}>
                <Image
                  source={post.isLiked ? require('../../assets/heart.png') : require('../../assets/Binheart.png')}
                  style={styles.icon}
                />
                <Text style={styles.actionText}>좋아요</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => goToComments(post.id)} style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#333" />
                <Text style={styles.actionText}>댓글 달기</Text>
              </TouchableOpacity>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF9F9',
    paddingTop: 20,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6E6E6',
    paddingHorizontal: 10,
    borderRadius: 20,
    width: '90%',
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
    backgroundColor: '#F6E6E6',
    color: '#716B6B',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#9D9692',
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    zIndex: 1,
  },
  postContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    padding: 10,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTitle: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
    color: '#333',
  },
  wrapper: {
    height: 250,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  postText: {
    fontSize: 16,
    color: 'black',
    marginVertical: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    color: '#333',
  },
  icon: {
    width: 24,
    height: 24,
  },
  optionsButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  pagination: {
    position: 'absolute',
    bottom: -25,
  },
  dotContainer: {
    backgroundColor: 'transparent',
    width: 10, // 동그라미 너비 조정
    height: 10, // 동그라미 높이 조정
    borderRadius: 7,
    borderWidth: 1, // 테두리 두께 설정
    borderColor: '#949494', // 테두리 색상 설정
    marginLeft: 3,
    marginRight: 3,
  },
  activeDotContainer: {
    backgroundColor: '#949494',
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
    console.error('데이터 저장 중 오류 발생:', error);
  }
};

const loadData = async (key) => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    if (jsonData !== null) {
      return JSON.parse(jsonData);
    }
  } catch (error) {
    console.error('데이터 불러오기 중 오류 발생:', error);
  }
  return null;
};

export default Board;