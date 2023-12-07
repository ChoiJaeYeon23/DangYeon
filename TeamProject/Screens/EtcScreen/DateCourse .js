import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';

const DateCourse = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef();

    const addMessage = (sender, message) => {
        // 새 메시지를 배열의 끝에 추가
        setMessages(previousMessages => [...previousMessages, { sender, message }]);
    };

    const fetchAIResponse = async (prompt) => {
        const apiKey = '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';
        const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.8,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0.5,
                presence_penalty: 0.5,
                stop: ["Human"],
            }),
        };

        setIsLoading(true);
        try {
            const response = await fetch(apiEndpoint, requestOptions);
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            setIsLoading(false);
            return aiResponse;
        } catch (error) {
            console.error('OpenAI API 호출 중 오류 발생:', error);
            setIsLoading(false);
            return 'OpenAI API 호출 중 오류 발생';
        }
    };

    const handleSend = async () => {
        if (inputMessage.length === 0) return;
        addMessage('나', inputMessage);
        const aiResponse = await fetchAIResponse(inputMessage);
        addMessage('챗봇', aiResponse);
        setInputMessage('');
    };

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.messagesContainer}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                {messages.map((msg, index) => (
                    <Text key={index} style={styles.message}>
                        {msg.sender}: {msg.message}
                    </Text>
                ))}
            </ScrollView>
            {isLoading && <Text style={styles.loading}>Loading...</Text>}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="메시지를 입력하세요..."
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    onSubmitEditing={handleSend}
                />
                <Button title="전송" onPress={handleSend} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    messagesContainer: {
        flex: 1,
    },
    message: {
        margin: 4,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    loading: {
        alignSelf: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default DateCourse;
