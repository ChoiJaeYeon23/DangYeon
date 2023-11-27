import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput, Modal, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['kr'] = {
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘'
};
LocaleConfig.defaultLocale = 'kr';

const CalendarScreen = () => {
    const [text, setText] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [events, setEvents] = useState({});
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [showEditEventModal, setShowEditEventModal] = useState(false);
    const [editingEventIndex, setEditingEventIndex] = useState(null);

    const onChangeText = (inputText) => {
        setText(inputText);
    };

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setText('');
        setShowAddEventModal(true); // 일정 추가 모달을 보여줌
    };

    const closeModal = () => {
        setShowAddEventModal(false);
        setShowEditEventModal(false);
        setText('');
        setEditingEventIndex(null); // 편집 인덱스 초기화
    };

    const handleAddEvent = () => {
        if (text.trim()) {
            const updatedEvents = {
                ...events,
                [selectedDate]: [...(events[selectedDate] || []), text.trim()],
            };
            setEvents(updatedEvents);
        }
        closeModal();
    };

    const handleEventPress = (index) => {
        setText(events[selectedDate][index]);
        setEditingEventIndex(index);
        setShowEditEventModal(true); // 일정 수정 모달을 보여줌
    };

    const handleEditEvent = () => {
        if (text.trim()) {
            const updatedEvents = { ...events };
            updatedEvents[selectedDate][editingEventIndex] = text.trim();
            setEvents(updatedEvents);
        }
        closeModal();
    };

    const confirmDeleteEvent = (index) => {
        Alert.alert(
            "일정 삭제",
            "이 일정을 삭제하시겠습니까?",
            [
                { text: "삭제", onPress: () => deleteEvent(index) },
                { text: "취소", style: "cancel" }
            ]
        );
    };

    const deleteEvent = (index) => {
        const updatedEvents = { ...events };
        updatedEvents[selectedDate].splice(index, 1);
        if (updatedEvents[selectedDate].length === 0) {
            delete updatedEvents[selectedDate];
        }
        setEvents(updatedEvents);
    };

    const renderEvents = () => {
        const dailyEvents = events[selectedDate] || [];
        return dailyEvents.length > 0 ? (
            <ScrollView style={styles.eventsList}>
                {dailyEvents.map((event, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.eventListItem}
                        onPress={() => handleEventPress(index)}
                        onLongPress={() => confirmDeleteEvent(index)}
                    >
                        <View style={styles.pinkSquare} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.eventText}>{event}</Text>
                            <Text style={styles.dataText}>{selectedDate}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        ) : null;
    };

    // 일정 추가 모달
    const renderAddEventModal = () => (
        <Modal
            transparent={true}
            animationType="fade"
            visible={showAddEventModal}
            onRequestClose={closeModal}
        >
            <TouchableWithoutFeedback onPress={closeModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalDateText}>오늘 : {selectedDate}</Text>
                        <TextInput
                            style={styles.input}
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
    );

    // 일정 수정 모달
    const renderEditEventModal = () => (
        <Modal
            transparent={true}
            animationType="fade"
            visible={showEditEventModal}
            onRequestClose={closeModal}
        >
            <TouchableWithoutFeedback onPress={closeModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeText}
                            value={text}
                            placeholder="일정 내용 수정"
                        />
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={handleEditEvent}
                        >
                            <Text style={styles.editButtonText}>수정</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );

    const renderCustomHeader = (date) => {
        const headerDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
        return (
            <View>
                <Text style={styles.customHeaderText}>{headerDate}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Calendar
                style={styles.calendar}
                onDayPress={handleDayPress}
                locale="kr"
                renderHeader={renderCustomHeader}
                theme={{
                    todayTextColor: '#F08080',
                    arrowColor: '#F08080',
                }}
                markedDates={Object.keys(events).reduce((acc, date) => {
                    acc[date] = { marked: true };
                    if (date === selectedDate) {
                        acc[date].selected = true;
                        acc[date].selectedColor = '#FA8072';
                    }
                    return acc;
                }, {})}
            />
            {selectedDate && renderEvents()}
            {renderAddEventModal()}
            {renderEditEventModal()}
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
    customHeaderText: {
        fontSize: 21,
        textAlign: 'center',
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
        width: 8,
        height: 35,
        backgroundColor: '#FFC0CB',
        marginLeft: 5,
        marginRight: 10,
    },
    eventText: {
        fontSize: 18,
        marginBottom: 5,
    },
    dataText: {
        fontSize: 10,
        color: '#A9A9A9',
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
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalDateText: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        fontSize: 18,
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: 15,
    },
    addButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#FFCECE',
    },
    addButtonText: {
        color: 'white',
        fontSize: 40,
        textAlign: 'center',
        lineHeight: 45,
    },
    editButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        backgroundColor: '#FFCECE',
        paddingVertical: 4,
        paddingHorizontal: 5,
    },
    editButtonText: {
        fontSize: 16,
        textAlign: 'center',
    }
});

export default CalendarScreen;
