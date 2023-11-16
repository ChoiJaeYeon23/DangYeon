import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import { Feather } from '@expo/vector-icons';

const Chat = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // 초기 메시지 상태 설정
        setMessages([
            {
                _id: 1,
                text: '안녕?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: '너',
                },
            },
            {
                _id: 2,
                text: '어 그래 안녕',
                createdAt: new Date(),
                user: {
                    _id: 1,
                    name: '나',
                },
            },
        ]);
    }, []);

    const onSend = useCallback((newMessages = []) => {
        // 새 메시지를 기존 메시지에 추가
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    }, []);

    const renderBubble = (props) => {
        // 말풍선 스타일링
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#FFCECE' // 오른쪽 말풍선 배경색
                    },
                    left: {
                        backgroundColor: '#FFF9F9' // 왼쪽 말풍선 배경색
                    },
                }}
                textStyle={{
                    right: {
                        color: '#544848', // 오른쪽 말풍선 텍스트 색상
                    },
                    left: {
                        color: '#544848', // 왼쪽 말풍선 텍스트 색상
                    },
                }}
            />
        );
    };

    const renderSend = (props) => {
        // 전송 버튼 커스터마이징
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <Feather name="send" size={22} color="black" />
                </View>
            </Send>
        );
    };

    const renderActions = () => {
        // 액션 버튼 커스터마이징
        return (
            <View style={styles.actionsContainer}>
                <TouchableOpacity >
                    <Feather name="image" size={24} color="black" style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="smile" size={24} color="black" style={styles.actionIcon} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderComposer = (props) => {
        // 입력란 커스터마이징
        return (
            <Composer {...props} textInputStyle={styles.composerTextInput} />
        );
    };

    const renderInputToolbar = (props) => {
        // 입력 툴바 커스터마이징
        return (
            <InputToolbar
                {...props}
                renderActions={renderActions}
                renderComposer={renderComposer}
                containerStyle={styles.inputToolbar}
            />
        );
    };

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id: 1, }} // 현재 사용자의 ID
                inverted={true}
                renderBubble={renderBubble}
                renderSend={renderSend}
                renderInputToolbar={renderInputToolbar} // 커스텀 입력 툴바 사용
                placeholder='메시지를 입력하세요.' // 입력란 플레이스홀더
                alwaysShowSend // 항상 전송 버튼을 보여줌
                scrollToBottom // 메시지 목록의 최하단으로 스크롤
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF9F9' // 배경색 설정
    },
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        marginLeft: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
    },
    actionIcon: {
        marginHorizontal: 5,
    },
    composerTextInput: {
        flex: 1,
        marginRight: 50,
        marginLeft: 50,
        textAlign: 'center',
    },
    inputToolbar: {
        backgroundColor: '#FFF9F9',
        paddingVertical: 5,
        padding: 8,
        alignItems: 'center',
    },
});

export default Chat;
