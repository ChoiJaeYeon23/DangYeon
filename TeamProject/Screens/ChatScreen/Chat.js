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
  const [userIdSubmitted, setUserIdSubmitted] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    const newSocket = io("http://3.34.6.50:8080");
    setSocket(newSocket);

    if (userIdSubmitted) {
      newSocket.emit("identify user", userId);
      newSocket.emit("request room assignment"); // room 할당 요청
    }

    newSocket.on("room assigned", (roomId) => {
      setRoomId(roomId); // 할당된 방 ID 설정
    });

    newSocket.on("chat message", (msgData) => {
      setMessages((prevMessages) => [...prevMessages, msgData]);
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });

    return () => newSocket.disconnect();
  }, [userIdSubmitted]);

  const submitUserId = () => {
    setUserIdSubmitted(true);
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
        {!userIdSubmitted && (
          <View style={styles.inputSection}>
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              placeholder="사용자 ID를 입력해주세요."
              editable={!userIdSubmitted}
            />
            <TouchableOpacity onPress={submitUserId}>
              <Feather name="check" size={22} color="black" />
            </TouchableOpacity>
          </View>
        )}

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
