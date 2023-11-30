import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // 키보드창
import AsyncStorage from '@react-native-async-storage/async-storage';

const Comments = ({ route }) => {
  const [comment, setComment] = useState(''); // 현재 입력 중인 댓글
  const [commentList, setCommentList] = useState([]); // 댓글 목록

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSaveComment = async () => {
    if (comment.trim() !== '') {
      const currentTime = new Date();
      const formattedDate = formatDate(currentTime);
      const formattedTime = formatTime(currentTime);
      const newComment = {
        text: comment,
        date: formattedDate,
        time: formattedTime,
      };
      const updatedCommentList = [...commentList, newComment];
      setCommentList(updatedCommentList);
      setComment('');

      // 댓글 목록을 AsyncStorage에 저장
      try {
        await AsyncStorage.setItem('commentList', JSON.stringify(updatedCommentList));
      } catch (error) {
        console.error('댓글 저장 실패:', error);
      }
    }
  };

  useEffect(() => {
    // 앱이 시작될 때 AsyncStorage에서 댓글 목록을 로드
    const loadCommentList = async () => {
      try {
        const storedCommentList = await AsyncStorage.getItem('commentList');
        if (storedCommentList !== null) {
          setCommentList(JSON.parse(storedCommentList));
        }
      } catch (error) {
        console.error('댓글 로드 실패:', error);
      }
    };

    loadCommentList();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20} // 추가된 부분
      >
        {commentList.map((item, index) => (
          <View key={index} style={styles.commentItem}>
            <Text>{item.text}</Text>
            <View style={styles.commentInfo}>
              <Text style={styles.commentDate}>{item.date}</Text>
              <Text style={styles.commentTime}>{item.time}</Text>
            </View>
          </View>
        ))}
      </KeyboardAwareScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="댓글을 입력하세요"
          onChangeText={handleCommentChange}
          value={comment}
          autoFocus={true} // 키보드 부분
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveComment}
        >
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F9',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 200, // 여분의 공간을 늘림
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6E6E6',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  saveButton: {
    backgroundColor: '#9D9692',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
  },
  commentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  commentDate: {
    fontSize: 12,
    color: 'gray',
  },
  commentTime: {
    fontSize: 12,
    color: 'gray',
  },
});

export default Comments;
