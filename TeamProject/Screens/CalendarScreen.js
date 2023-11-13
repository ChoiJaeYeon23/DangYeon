import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
    const [text, setText] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [events, setEvents] = useState({});
    const [showAddEventModal, setShowAddEventModal] = useState(false);

    const onChangeText = (inputText) => {
        setText(inputText);
    };

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setText(''); // 모달을 열 때마다 텍스트를 초기화합니다.
        setShowAddEventModal(true);
    };

    const handleAddEvent = () => {
        if (text.trim()) {
            const updatedEvents = {
                ...events,
                [selectedDate]: [...(events[selectedDate] || []), text.trim()]
            };
            setEvents(updatedEvents);
        }
        setShowAddEventModal(false);
        setText(''); 
    };

    const renderEvents = () => {
        const dailyEvents = events[selectedDate] || [];
        return dailyEvents.length > 0 ? (
            <ScrollView style={styles.eventsList}>
                {dailyEvents.map((event, index) => (
                    <View key={index} style={styles.eventListItem}>
                        <View style={styles.pinkSquare} />
                        <Text style={styles.eventText}>{event}</Text>
                    </View>
                ))}
            </ScrollView>
        ) : null;
    };

    const closeModal = () => {
        setShowAddEventModal(false);
    };

    return (
        <View style={styles.container}>
            <Calendar
                style={styles.calendar}
                onDayPress={handleDayPress}
                markedDates={Object.keys(events).reduce((acc, date) => {
                    acc[date] = { marked: true };
                    if (date === selectedDate) {
                        acc[date].selected = true;
                        acc[date].selectedColor = '#FFCCFF';
                    }
                    return acc;
                }, {})}
            />
            {selectedDate && renderEvents()}
            <Modal
                transparent={true}
                animationType="fade"
                visible={showAddEventModal}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalDateText}>Today : {selectedDate}</Text>
                            <TextInput style={styles.input}
                                onChangeText={onChangeText}
                                value={text}
                                placeholder="이 날의 일정을 입력해주세요."
                            />
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddEvent}
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    eventContainer: {
        padding: 10,
        marginTop: 10,
        backgroundColor: '#FFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E9E9E9',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
    },
    eventListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
    },
    pinkSquare: {
        width: 10,
        height: 50,
        backgroundColor: '#FFC0CB',
        marginLeft: 5,
        marginRight: 10,
    },
    eventText: {
        fontSize: 18,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF9F9',
    },
    calendar: {
        paddingBottom: 30,
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderRadius: 30,
        marginTop: 10,
    },
    eventsList: {
        // 이 부분을 적절하게 스타일링하여 일정 리스트를 표시
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalDateText: {
        fontSize: 16,
        marginBottom: 15,
    },
    input: {
        fontSize: 14,
        textAlign: 'center',
        alignSelf: 'center',
        color: '#A0A0A0',
        marginBottom: 15,
    },
    addButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#FFCCFF',
    },
    addButtonText: {
        color: 'white',
        fontSize: 40,
        alignItems: 'center',
    },
});

export default CalendarScreen;
