import React, { useState, useEffect } from "react";
import { View, TextInput, Button, FlatList, Text } from "react-native";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io("http://13.236.248.201");
    setSocket(newSocket);

    newSocket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 50, padding: 10 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
        style={{ flex: 1 }}
      />
      <TextInput
        style={{ height: 40, borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={message}
        onChangeText={setMessage}
      />
      <Button onPress={sendMessage} title="Send Message" />
    </View>
  );
};

export default Chat;
