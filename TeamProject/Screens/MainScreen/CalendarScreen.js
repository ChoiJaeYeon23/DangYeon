import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["kr"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "kr";

const CalendarScreen = () => {
  const [text, setText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState({});
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState(null);

  // 서버에 일정을 저장하게 요청하는 함수
  const add_calendar = async (selectedDate, text) => {
    console.log(`Saving event for date: ${selectedDate}, text: ${text}`);
    try {
      const response = await fetch(
        "http://3.34.6.50:8080/api/calendar_schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: selectedDate, text }),
          credentials: "include",
        }
      );
      const responseData = await response.text();
      if (response.ok) {
        console.log("Event saved:", responseData);
        // 새로운 이벤트를 로컬 상태에 추가
        const newEvent = { schedule_date: selectedDate, schedule_text: text };
        const updatedEvents = events[selectedDate]
          ? [...events[selectedDate], newEvent]
          : [newEvent];
        setEvents({ ...events, [selectedDate]: updatedEvents });
        Alert.alert("일정을 저장하였습니다.");
      } else {
        throw new Error(`Server error: ${responseData}`);
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  // 서버로부터 캘린더 일정을 로드하는 함수
  const calendar_load = async () => {
    console.log("Loading events from server...");
    try {
      const response = await fetch("http://3.34.6.50:8080/api/calendar_load", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const loadedEvents = await response.json();
        console.log("Events loaded:", loadedEvents);
        const markedDates = {};
        loadedEvents.forEach((event) => {
          markedDates[event.schedule_date] = {
            marked: true,
            dotColor: "red",
            activeOpacity: 0,
          };
        });
        setEvents(markedDates);
      } else {
        throw new Error("Failed to load events from server.");
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  useEffect(() => {
    calendar_load();
  }, []);

  const onChangeText = (inputText) => {
    setText(inputText);
  };

  const handleDayPress = async (day) => {
    setSelectedDate(day.dateString);
    setText("");

    try {
      const response = await fetch(
        `http://3.34.6.50:8080/api/load_calendar_text?date=${day.dateString}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const dailyEvents = await response.json();
        if (dailyEvents.length > 0) {
          // 해당 날짜에 이벤트가 있을 경우
          setEvents({ ...events, [day.dateString]: dailyEvents });
        } else {
          // 해당 날짜에 이벤트가 없을 경우
          if (events[day.dateString]) {
            // 이벤트가 이미 표시된 경우는 표시를 유지합니다.
            setEvents({ ...events, [day.dateString]: [] });
          } else {
            // 이벤트가 표시되지 않은 경우는 이벤트 추가 모달을 표시합니다.
            setShowAddEventModal(true);
          }
        }
      } else {
        throw new Error("Failed to load events for the selected date.");
      }
    } catch (error) {
      console.error("Error loading events for the selected date:", error);
    }
  };

  const closeModal = () => {
    setShowAddEventModal(false);
    setShowEditEventModal(false);
    setText("");
    setEditingEventIndex(null); // 편집 인덱스 초기화
  };

  const handleAddEvent = async () => {
    if (text.trim()) {
      const newEvent = {
        schedule_date: selectedDate,
        schedule_text: text.trim(),
        schedule_id: new Date().getTime() // 임시 ID 할당
      };
      // 서버에 저장
      await add_calendar(selectedDate, text.trim());
      // 상태 업데이트
      const updatedEvents = events[selectedDate]
        ? [...events[selectedDate], newEvent]
        : [newEvent];
      setEvents({ ...events, [selectedDate]: updatedEvents });
    }
    closeModal();
  };
  // 선택한 일정 수정하는 함수
  const handleEditEvent = async () => {
    if (!text.trim()) {
      Alert.alert("Validation", "Please enter the event text.");
      return;
    }

    try {
      const response = await fetch(
        `http://3.34.6.50:8080/api/calendar_text_update/${editingEventIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: text.trim(), date: selectedDate }),
          credentials: "include",
        }
      );
      const responseData = await response.text();
      if (response.ok) {
        console.log("Event updated:", responseData);
        const updatedEvents = { ...events };
        // 이 부분에서 수정된 이벤트의 정보를 업데이트합니다.
        updatedEvents[selectedDate] = updatedEvents[selectedDate].map(
          (event) => {
            if (event.schedule_id === editingEventIndex) {
              return { ...event, schedule_text: text.trim() };
            }
            return event;
          }
        );
        setEvents(updatedEvents);
      } else {
        throw new Error(`Server error: ${responseData}`);
      }
    } catch (error) {
      console.error("Failed to update event:", error);
    }
    Alert.alert("수정을 완료하였습니다.");
    closeModal();
  };

  const confirmDeleteEvent = (schedule_id) => {
    Alert.alert("일정 삭제", "이 일정을 삭제하시겠습니까?", [
      {
        text: "삭제",
        onPress: () => deleteEvent(schedule_id), //schedule_id를 사용하여 해당 일정 삭제
      },
      { text: "취소", style: "cancel" },
    ]);
  };

  // 일정 삭제하는 함수
  const deleteEvent = async (schedule_id) => {
    try {
      const response = await fetch(
        `http://3.34.6.50:8080/api/del_calendar/${schedule_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }
      console.log("Event deleted successfully");
      calendar_load();
      closeModal();

      Alert.alert("삭제를 완료하였습니다.");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEventPress = (event) => {
    setText(event.schedule_text);
    setEditingEventIndex(event.schedule_id); // 이벤트의 ID 또는 고유 식별자를 저장
    setShowEditEventModal(true); // 이벤트 수정 모달을 표시
  };

  const renderEvents = () => {
    const dailyEvents = events[selectedDate] || [];
    return dailyEvents.length > 0 ? (
      <ScrollView style={styles.eventsList}>
        {dailyEvents.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.eventListItem}
            onPress={() => handleEventPress(event)}
            onLongPress={() => confirmDeleteEvent(event.schedule_id)}
          >
            <View style={styles.pinkSquare} />
            <View style={{ flex: 1 }}>
              <Text style={styles.eventText}>{event.schedule_text}</Text>
              <Text style={styles.dataText}>{event.schedule_date}</Text>
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
            <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // 일정 수정 및 삭제 모달
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
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={[styles.modalButton, styles.editButton]}
                onPress={handleEditEvent}
              >
                <Text style={styles.text}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => confirmDeleteEvent(editingEventIndex)}
              >
                <Text style={styles.text}>삭제</Text>
              </TouchableOpacity>
            </View>
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
        key={Object.keys(events).length}
        style={styles.calendar}
        onDayPress={handleDayPress} // 날짜를 누를 때 실행될 함수
        locale="kr" // Locale 설정을 'kr'로 설정
        renderHeader={renderCustomHeader} // 사용자 정의 헤더 렌더링 함수
        theme={{
          todayTextColor: "#F08080", // 오늘 날짜의 텍스트 색상
          arrowColor: "#F08080", // 달력 화살표 색상
        }}
        markedDates={Object.keys(events).reduce((acc, date) => {
          // 특정 날짜에 마크를 표시하는 객체 생성
          acc[date] = { marked: true };
          if (date === selectedDate) {
            // 선택된 날짜 스타일 지정
            acc[date].selected = true;
            acc[date].selectedColor = "#FA8072";
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
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E9E9E9",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
  },
  customHeaderText: {
    fontSize: 21,
    textAlign: "center",
  },
  eventListItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  pinkSquare: {
    width: 8,
    height: 35,
    backgroundColor: "#FFC0CB",
    marginLeft: 5,
    marginRight: 10,
  },
  eventText: {
    fontSize: 18,
    marginBottom: 5,
  },
  dataText: {
    fontSize: 10,
    color: "#A9A9A9",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF9F9",
  },
  calendar: {
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: "#E9E9E9",
    borderRadius: 30,
    marginTop: 10,
  },
  eventsList: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalDateText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 18,
  },
  input: {
    fontSize: 18,
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#FFCECE",
  },
  addButtonText: {
    color: "white",
    fontSize: 40,
    textAlign: "center",
    lineHeight: 45,
  },
  editButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "#FFCECE",
    paddingVertical: 4,
    paddingHorizontal: 5,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "pink",
    paddingVertical: 4,
    paddingHorizontal: 5,
  },
  editButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    marginHorizontal: 7,
    width: 40,
    height: 30,
  },
});

export default CalendarScreen;
