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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { id } from "date-fns/locale";

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
    // 서버로부터 해당 날짜의 이벤트를 로드합니다.
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
        // 로드한 이벤트를 상태에 설정합니다.
        setEvents({ ...events, [day.dateString]: dailyEvents });
      } else {
        throw new Error("Failed to load events for the selected date.");
      }
    } catch (error) {
      console.error("Error loading events for the selected date:", error);
    }

    setShowAddEventModal(true); // 일정 추가 모달을 보여줍니다.
  };

  const closeModal = () => {
    setShowAddEventModal(false);
    setShowEditEventModal(false);
    setText("");
    setEditingEventIndex(null); // 편집 인덱스 초기화
  };

  const saveEvents = async (updatedEvents) => {
    //이벤트 AsyncStorage에 저장
    try {
      await AsyncStorage.setItem("events", JSON.stringify(updatedEvents));
    } catch (error) {
      console.error("일정 저장 실패:", error);
    }
  };

  const handleAddEvent = () => {
    if (text.trim()) {
      const updatedEvents = {
        ...events,
        [selectedDate]: [...(events[selectedDate] || []), text.trim()],
      };
      setEvents(updatedEvents);
      saveEvents(updatedEvents); // 변경된 내용 저장
      add_calendar(selectedDate, text.trim()); // 서버에 이벤트 저장
    }
    closeModal();
  };

  const handleEventPress = (index) => {
    setText(events[selectedDate][index]);
    setEditingEventIndex(index);
    setShowEditEventModal(true); // 일정 수정 모달을 보여줌
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
        updatedEvents[selectedDate] = updatedEvents[selectedDate].map(
          (event, index) => {
            if (index === editingEventIndex) {
              return text.trim();
            }
            return event;
          }
        );
        setEvents(updatedEvents);
        await saveEvents(updatedEvents);
      } else {
        throw new Error(`Server error: ${responseData}`);
      }
    } catch (error) {
      console.error("Failed to update event:", error);
    }

    closeModal();
  };

  const confirmDeleteEvent = (index) => {
    Alert.alert("일정 삭제", "이 일정을 삭제하시겠습니까?", [
      { text: "삭제", onPress: () => deleteEvent(index) },
      { text: "취소", style: "cancel" },
    ]);
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const storedEvents = await AsyncStorage.getItem("events");
        if (storedEvents !== null) {
          setEvents(JSON.parse(storedEvents));
        }
      } catch (error) {
        console.error("일정 로드 실패:", error);
      }
    };

    loadEvents();
  }, []);

  // 게시글 삭제하는 함수
  const deleteEvent = async (id) => {
    try {
      const response = await fetch(
        `http://3.34.6.50:8080/api/del_calendar/${id}`,
        {
          method: "DELETE",
          credentials: "include", // 쿠키/인증 정보를 포함하는 경우
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
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
              {/* 객체가 아닌, 객체의 특정 프로퍼티를 렌더링합니다. */}
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
                <Text style={styles.modalButtonText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => confirmDeleteEvent(editingEventIndex)}
              >
                <Text style={styles.modalButtonText}>삭제</Text>
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
});

export default CalendarScreen;
