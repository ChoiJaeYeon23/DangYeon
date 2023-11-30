import React, { useState, useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import io from "socket.io-client";
import * as ImagePicker from 'expo-image-picker';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(""); // 사용자 입력 메세지
  const [messages, setMessages] = useState([]); // 렌더링메세지

  const flatListRef = useRef();

  useEffect(() => {
    const newSocket = io("http://3.34.6.50:8080");
    setSocket(newSocket);

    newSocket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
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
      <View
        style={[
          styles.messageBubble,
          isUserMessage ? styles.userMessage : styles.otherMessage,
        ]}
      >
        <Text>{item.text}</Text>
      </View>
    );
  };

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("chat message", { msg: message.trim(), coupleId: null });
      console.log(message);
      setMessage("");
    }
  };
  const sendImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '갤러리에 접근하기 위한 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true, // 여러 사진 선택가능
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map(asset => asset.uri);
      setImageUris(uris);
      await processImages(result.assets);
    }
  };
  
  const sendEmoticon = () => { };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <Text>{item}</Text>}
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
    </KeyboardAvoidingView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F9",
  },
  messageList: {
    flex: 1,
    padding: 10,
    fontSize: 18,
  },
  inputSection: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginRight: 10,
    borderRadius: 15,
  },
  iconButton: {
    marginRight: 5,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "#DCF8C6",
    borderRadius: 20,
    marginBottom: 10,
  },
  otherMessage: {
    alignSelf: "flex-start",
    padding: 10,
    backgroundColor: "#ECECEC",
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default Chat;
