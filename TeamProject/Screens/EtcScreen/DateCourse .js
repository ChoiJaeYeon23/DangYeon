import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import ApiKeys from '../../ApiKeys';

const DateCourse = () => {
    const [inputMessage, setInputMessage] = useState(''); // 사용자 입력 메시지
    const [messages, setMessages] = useState([]); // 대화 목록
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const scrollViewRef = useRef(); // 스클롤 뷰

    // 메시지 추가 함수
    const addMessage = (sender, message) => {
        setMessages(previousMessages => [...previousMessages, { sender, message }]);
    };
    // AI 응답을 가져오는 함수
    const fetchAIResponse = async (prompt) => {
        const apiKey = ApiKeys.OPENAI_API_KEY;
        console.log("Loaded API Key:", apiKey); // 로드된 API 키 확인
           const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        // API 요청 옵션 설정
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

        setIsLoading(true); // 로딩 상태 시작
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
            setIsLoading(false); // 로딩 상태 종료
            return aiResponse;
        } catch (error) {
            console.error('OpenAI API 호출 중 오류 발생:', error);
            setIsLoading(false); // 로딩 상태 종료
            return `오류: ${error.message}`;
        }
    };
    // 메시지 전송 핸들러
    const handleSend = async () => {
        if (inputMessage.trim() === '') return; // 입력란이 비었는지 확인

        addMessage('나', inputMessage); // 메시지 추가
        const aiResponse = await fetchAIResponse(inputMessage); // AI 응답 받기
        addMessage('챗봇', aiResponse); // AI 응답 메시지 추가

        setInputMessage(''); // 입력란을 비움
    };
    // 메시지 목록이 업데이트될 때 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} 
            >
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
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF9F9', 
    },
    messagesContainer: {
        flex: 1,
    },
    message: {
        margin: 4,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1, 
        borderColor: '#ccc', 
    },
    loading: {
        alignSelf: 'center',
    },
    inputContainer: {
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
    chatbotMessage: {
        backgroundColor: '#d1f7c4', 
    },
    sendButton: {
        padding: 10,
        backgroundColor: '#FFCECE', 
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    sendButtonText: {
        color: '#000',
    },
});

export default DateCourse;
