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
        const apiKey = '안녕';
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
            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
                throw new Error('응답에 적절한 데이터가 없습니다.');
            }
            const aiResponse = data.choices[0].message.content;
            setIsLoading(false);
            return aiResponse;
        } catch (error) {
            console.error('OpenAI API 호출 중 오류 발생:', error);
            setIsLoading(false);
            return `오류: ${error.message}`;
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
                    <Text
                        key={index}
                        style={[styles.message, msg.sender === '챗봇' ? styles.chatbotMessage : null]}>
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
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>전송</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF9F9', // 흰색 배경 설정
    },
    messagesContainer: {
        flex: 1,
    },
    message: {
        margin: 4,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1, // 테두리 두께 추가
        borderColor: '#ccc', // 테두리 색상 추가
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
    chatbotMessage: {
        backgroundColor: '#d1f7c4', // 연두색 배경
    },
});

export default DateCourse;
