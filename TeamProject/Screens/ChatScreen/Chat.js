import React, { useState, useEffect, useRef } from "react";
import { KeyboardAvoidingView, Platform, View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const flatListRef = useRef();

  useEffect(() => {
    const newSocket = io("http://3.34.6.50:8080");
    setSocket(newSocket);

    newSocket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      // 메시지 상태가 업데이트 될 때마다 최신 메시지로 스크롤합니다.
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });

    return () => newSocket.disconnect();
  }, []);

  const renderMessage = ({ item }) => {
    const isUserMessage = item.isUser; // 메시지 객체의 isUser 속성을 기반으로 사용자 메시지 여부 판단
    return (
      <View style={[
        styles.messageBubble,
        isUserMessage ? styles.userMessage : styles.otherMessage
      ]}>
        <Text>{item.text}</Text>
      </View>
    );
  };

  const sendMessage = () => {
    if (socket && message.trim()) {
      // 서버에 메시지를 보냅니다.
      socket.emit("chat message", {
        text: message.trim(),
      });
      setMessage(""); // 입력 필드 초기화
    }
  };

  const sendImage = () => {

  }

  const sendEmoticon = () => {

  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" === "50%"} // iOS는 padding을 사용하고 Android는 height 조정
      keyboardVerticalOffset={Platform.OS === "ios" === 64} // 필요에 따라 iOS에서 키보드 오프셋 조정
    >
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messageList}
        />
        <View style={styles.inputSection}>
          <TouchableOpacity onPress={sendImage} style={styles.iconButton}>
            <Feather name="image" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={sendEmoticon} style={styles.iconButton}>
            <Feather name="smile" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="메세지를 입력해주세요."
          />
          <TouchableOpacity onPress={sendMessage}>
            <Feather name="send" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF9F9',
  },
  messageList: {
    padding: 10,
    fontSize: 18
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginLeft: 5,
    marginRight: 5
  },
  iconButton: {
    marginHorizontal: 2,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: '#DCF8C6',
    borderRadius: 20,
    marginBottom: 10,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: '#ECECEC',
    borderRadius: 20,
    marginBottom: 10,
  }
});

export default Chat;