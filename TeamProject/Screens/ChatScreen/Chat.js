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

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomID, setRoomId] = useState(null);
  const [userId, setUserId] = useState("");
  const flatListRef = useRef();

  useEffect(() => {
    if (userId) {
      const newSocket = io("http://3.34.6.50:8080");
      setSocket(newSocket);

      newSocket.emit("identify user", userId);

      newSocket.on("assign room", (id) => {
        setRoomId(id);
        newSocket.emit("join room");
      });

      newSocket.on("chat message", (msgData) => {
        setMessages((prevMessages) => [...prevMessages, msgData]);
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      });

      return () => newSocket.disconnect();
    }
  }, [userId]);

  const handleUserIdChange = (text) => {
    // 사용자 ID가 입력되어 있지 않은 경우만 변경을 허용
    if (!roomID) {
      setUserId(text);
    }
  };

  const sendMessage = () => {
    if (socket && message && roomID) {
      const msgData = {
        msg: message.trim(),
        room_id: roomID,
        isUserMessage: true,
      };

      socket.emit("chat message", msgData);
      setMessage("");
      setMessages((prevMessages) => [...prevMessages, msgData]);
    }
  };

  const renderMessage = ({ item }) => {
    return (
      <View
        style={[
          styles.messageBubble,
          item.isUserMessage ? styles.userMessage : styles.otherMessage,
        ]}
      >
        <Text>{item.msg}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={handleUserIdChange}
            placeholder="사용자 ID를 입력해주세요."
            editable={!roomID} // 입력이 되면 편집 금지
          />
          <TouchableOpacity onPress={() => setUserId(userId)}>
            <Feather name="user" size={22} color="black" />
          </TouchableOpacity>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messageList}
        />
        <View style={styles.inputSection}>
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
    backgroundColor: "#FFF9F9",
  },
  messageList: {
    flex: 1,
    padding: 10,
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
    borderColor: "gray",
    padding: 10,
    marginRight: 10,
    borderRadius: 15,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
});

export default Chat;
