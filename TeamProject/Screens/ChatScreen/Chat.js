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

const Chat = ({ userId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef();

  useEffect(() => {
    const newSocket = io("http://3.34.6.50:8080");
    setSocket(newSocket);

    // 사용자 ID를 소켓 서버에 전달
    if (userId) {
      newSocket.emit("identify user", userId);
    }

    newSocket.on("room assigned", (roomId) => {
      newSocket.emit("load message", { room_id: roomId });
    });

    newSocket.on("tttest", (loadedMessages) => {
      const updatedMessages = loadedMessages.map((msg) => ({
        ...msg,
        isUserMessage: msg.user_id === userId,
      }));
      setMessages(updatedMessages);
    });

    newSocket.on("chat message", (msgData) => {
      setMessages((prevMessages) => [...prevMessages, msgData]);
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });

    return () => newSocket.disconnect();
  }, [userId]);

  const sendMessage = () => {
    if (socket && message) {
      const msgData = {
        msg: message.trim(),
        user_id: userId,
      };

      socket.emit("chat message", msgData);
      setMessage("");
    }
  };

  const renderMessage = ({ item }) => {
    const isUserMessage = item.user_id === userId;
    return (
      <View
        style={[
          styles.messageBubble,
          isUserMessage ? styles.userMessage : styles.otherMessage,
        ]}
      >
        <Text
          style={
            isUserMessage ? styles.userMessageText : styles.otherMessageText
          }
        >
          {item.Message_text || item.msg}
        </Text>
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
    messageTime: {
      fontSize: 10,
      color: "grey",
    },
  });

  export default Chat;
