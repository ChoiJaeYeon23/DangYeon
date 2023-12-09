import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
    Modal,
    FlatList,
    KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import calendar from "../../assets/calendar.png";
import * as ImagePicker from "expo-image-picker";

const UserInfo = ({ navigation }) => {
    const [name, setName] = useState(""); //이름
    const [birthday, setBirthday] = useState(""); //생년월일
    const [meetingDay, setMeetingDay] = useState(""); //처음 만난 날
    const [bloodType, setBloodType] = useState(""); //혈액형
    const [isBirthdayPickerVisible, setIsBirthdayPickerVisible] = useState(false); //생년월일 picker
    const [isMeetingDayPickerVisible, setIsMeetingDayPickerVisible] =
        useState(false); //처음 만난 날 picker
    const [profilePic, setProfilePic] = useState(null); // 프로필 사진
    const [isBloodTypeModalVisible, setIsBloodTypeModalVisible] = useState(false); // 혈액형 모달
    const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
    const [user1_name, setuser1_name] = useState("");
    const [user2_name, setuser2_name] = useState("");

    const validateInput = () => {
        if (!name) return "이름을 입력해주세요.";
        if (!birthday) return "생년월일을 입력해주세요.";
        if (!meetingDay) return "처음 만난 날을 입력해주세요.";
        if (!bloodType) return "혈액형을 선택해주세요.";
        return "";
    };

    // 서버로부터 유저 정보 가져옴
    const loaduserInfos = async () => {
        try {
            const response = await fetch("http://3.34.6.50:8080/api/userInfos", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const userInfos = await response.json();
                if (userInfos) {
                    setName(userInfos.username);
                    setBirthday(userInfos.birthday);
                    setMeetingDay(userInfos.meetingDay);
                    setBloodType(userInfos.blood_type);
                    setProfilePic([{ uri: userInfos.user_image }]);
                }
            } else {
                console.error("Failed to fetch username");
            }
        } catch (error) {
            console.error("Error fetching meeting day:", error);
        }
    }



    useEffect(() => {
        loadusernames();
        loaduserInfos();
        //사용자 이미지 불러오는 함수
    }, []);


    // 서버로부터 사용자 이름들 가져오는 코드
    const loadusernames = async () => {
        try {
            const response = await fetch("http://3.34.6.50:8080/api/usersname", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const usersnamedata = await response.json();
                if (usersnamedata && usersnamedata.length > 0) {
                    setuser1_name(usersnamedata[0].username);
                    setuser2_name(usersnamedata[1].username);
                }
            } else {
                console.error("Failed to fetch username");
            }
        } catch (error) {
            console.error("Error fetching meeting day:", error);
        }
    };




    // 저장누르면 사용자 개인 프로필 수정하는 함수
    const saveProfileData = async (assets) => {
        for (const asset of assets) {
            const formData = new FormData()
            formData.append("img", {
                uri: asset.uri,
                name: `upload-${Date.now()}.jpg`,
                type: "image/jpeg",
            })

            if (asset) {

                // 기타 사용자 데이터 추가
                formData.append("username", name);
                formData.append("birthday", birthday);
                formData.append("meetingDay", meetingDay);
                formData.append("bloodType", bloodType);

                console.log("수정된 프로필 : ", formData)
                try {
                    const response = await fetch("http://3.34.6.50:8080/api/userInfo_modify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: formData,
                    })


                    if (!response.ok) {
                        throw new Error("Server response not OK");
                    }
                    const data = await response.json();
                    console.log("사용자 정보가 업데이트 되었습니다:", data)
                    alert("프로필 수정 완료");

                } catch (error) {
                    console.log("사용자 정보를 업데이트 하는 중 에러가 발생했습니다:", error)
                }
            }
        }
    };


    //회원탈퇴 클라이언트 요청 코드
    const member_withdrawal = () => {
        Alert.alert(
            "회원 탈퇴",
            "회원을 탈퇴할 경우 모든 데이터가 삭제됩니다. 계속 하시겠습니까?",
            [
                { text: "취소", onPress: () => { }, style: "cancel" },
                { text: "탈퇴", onPress: () => memberDelete() }, //memberDelete :  사용자가 "탈퇴" 버튼을 눌렀을 때 호출되는 이벤트 핸들러
            ],
            { cancelable: false }
        );
    };

    const memberDelete = () => {
        fetch("http://3.34.6.50:8080/api/member_withdrawal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    //탈퇴가 성공적으로 이루어지면 클라이언트에게 알림
                    Alert.alert("탈퇴 완료", "회원 탈퇴가 정상적으로 처리되었습니다.", [
                        { text: "확인", onPress: () => navigation.navigate("Login") },
                    ]);
                } else {
                    throw new Error("회원탈퇴에 실패하였습니다.");
                }
            })
            .catch((error) => {
                Alert.alert("오류", error.message);
            });
    };

    // 생년월일 변경
    const onBirthdayChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setIsBirthdayPickerVisible(Platform.OS === "ios");
        setBirthday(currentDate.toISOString().split("T")[0]);
    };

    // 처음 만난 날 변경
    const onMeetingDayChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setIsMeetingDayPickerVisible(Platform.OS === "ios");
        setMeetingDay(currentDate.toISOString().split("T")[0]);
    };

    // 생년월일 표시
    const showBirthdayPicker = () => {
        setIsBirthdayPickerVisible(true);
    };

    // 처음 만난 날 표시
    const showMeetingDayPicker = () => {
        setIsMeetingDayPickerVisible(true);
    };

    // 이름 입력을 처리하는 함수
    const handleNameChange = (text) => {
        if ([...text].length <= 6) {
            // 한글을 포함한 문자열의 길이 계산
            setName(text);
        }
    };

    // 사진 선택하는 함수
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("권한 필요", "갤러리에 접근하기 위한 권한이 필요합니다.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled && result.assets) {
            setProfilePic(result.assets)
        }
    };

    const couplebreak = () => {
        //커플 연결 끊기 확인 화면으로 이동
        navigation.navigate("CheckCoupleBreak");
    };

    const goToLogout = () => {
        // 로그아웃 서버 요청 코드
        fetch("http://3.34.6.50:8080/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    navigation.navigate("Login");
                } else {
                    Alert.alert("로그아웃 실패");
                }
            })
            .catch((error) => {
                console.error("Logout Error", error);
                Alert.alert("네트워크 오류 발생");
            });
    };

    // 혈액형 선택 모달 표시 함수
    const showBloodTypeModal = () => {
        setIsBloodTypeModalVisible(true);
    };

    // 혈액형 선택 처리 함수
    const selectBloodType = (type) => {
        setBloodType(type);
        setIsBloodTypeModalVisible(false); // 모달 숨기기
    };

    // 혈액형 데이터
    const bloodTypes = ["A", "B", "O", "AB"];

    // 혈액형 선택 항목 렌더링 함수
    const renderBloodTypeItem = ({ item }) => (
        <TouchableOpacity
            style={styles.bloodTypeItem}
            onPress={() => selectBloodType(item)}
        >
            <Text style={styles.bloodTypeText}>{item}형</Text>
        </TouchableOpacity>
    );

    const Separator = () => <View style={styles.separator} />;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                enableAutomaticScroll={Platform.OS === "ios"}
            >
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        {!profilePic && (
                            <Text style={styles.photoPromptText}>
                                프로필 사진을 입력해주세요!
                            </Text>
                        )}
                        <TouchableOpacity style={styles.iconContainer} onPress={pickImage}>
                            {profilePic ? (
                                <Image
                                    source={{ uri: profilePic.uri }}
                                    style={{ width: 50, height: 50, borderRadius: 25 }}
                                />
                            ) : (
                                <Image
                                    source={require("../../assets/imageicon.png")}
                                    style={styles.icon}
                                />
                            )}
                        </TouchableOpacity>
                        <Text style={styles.titleText}>
                            {user1_name} 💖 {user2_name}
                        </Text>
                    </View>
                    <Separator />
                    <View style={styles.inputRow}>
                        <Text style={styles.inputLabel}>이름</Text>
                        <TextInput
                            onChangeText={handleNameChange}
                            value={name}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputRow}>
                        <Text style={styles.inputLabel}>생년월일</Text>
                        <View style={styles.dateInputContainer}>
                            <TextInput
                                value={birthday}
                                style={styles.dateInput}
                                editable={false}
                            />
                            <TouchableOpacity onPress={showBirthdayPicker}>
                                <Image source={calendar} style={styles.calendar} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.datePickerContainer}>
                            {isBirthdayPickerVisible && (
                                <DateTimePicker
                                    testID="birthdayPicker"
                                    value={birthday ? new Date(birthday) : new Date()}
                                    mode="date"
                                    display="calendar"
                                    onChange={onBirthdayChange}
                                />
                            )}
                        </View>
                    </View>
                    <View style={styles.inputRow}>
                        <Text style={styles.inputLabel}>처음 만난 날</Text>
                        <View style={styles.dateInputContainer}>
                            <TextInput
                                value={meetingDay}
                                style={styles.dateInput}
                                editable={false}
                                onPress={showMeetingDayPicker}
                            />
                            <TouchableOpacity onPress={showMeetingDayPicker}>
                                <Image source={calendar} style={styles.calendar} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.datePickerContainer}>
                            {isMeetingDayPickerVisible && (
                                <DateTimePicker
                                    testID="meetingDayPicker"
                                    value={meetingDay ? new Date(meetingDay) : new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onMeetingDayChange}
                                />
                            )}
                        </View>
                    </View>
                    <View style={styles.inputRowColumn}>
                        <Text style={styles.inputLabel}>혈액형</Text>
                        <TouchableOpacity onPress={showBloodTypeModal}>
                            <Text style={styles.bloodText}>
                                {bloodType ? `${bloodType}형` : "혈액형 선택"}
                            </Text>
                        </TouchableOpacity>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={isBloodTypeModalVisible}
                            onRequestClose={() => {
                                setIsBloodTypeModalVisible(false);
                            }}
                        >
                            <TouchableOpacity
                                style={styles.centeredView}
                                activeOpacity={1}
                                onPressOut={() => setIsBloodTypeModalVisible(false)}
                            >
                                <View style={styles.modalView}>
                                    <FlatList
                                        data={bloodTypes}
                                        renderItem={renderBloodTypeItem}
                                        keyExtractor={(item) => item}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>
                    <Separator />
                    <View style={styles.saveButtonContainer}>
                        <TouchableOpacity style={styles.Button} onPress={async () => {
                            await saveProfileData(profilePic)
                            await loaduserInfos()
                            await loadusernames()
                        }}>
                            <Text style={styles.ButtonText}>저장</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={couplebreak} style={styles.Button2}>
                                <Text style={styles.ButtonText2}>커플 연결 끊기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Button2}>
                                <Text style={styles.ButtonText3}>l</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={goToLogout} style={styles.Button2}>
                                <Text style={styles.ButtonText2}>로그아웃</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.memberDelete}
                            onPress={member_withdrawal}
                        >
                            <Text style={styles.memberDeleteText}>회원 탈퇴</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#FFF9F9",
    },
    headerContainer: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 40,
    },
    titleText: {
        textAlign: "center",
        color: "#544848",
        fontSize: 28,
        fontWeight: "bold",
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20,
        position: "relative",
    },
    icon: {
        width: 35,
        height: 35,
    },
    photoPromptText: {
        position: "absolute",
        bottom: "100%",
        fontSize: 13,
        color: "#707070",
        textAlign: "center",
        backgroundColor: "rgba(255,255,255,0.8)",
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "60%",
        marginBottom: 20,
        marginRight: 40,
    },
    inputRowColumn: {
        flexDirection: "row",
        alignItems: "center",
        width: "60%",
        marginBottom: 15,
        marginRight: 35,
    },
    inputLabel: {
        fontSize: 20,
        color: "#544848",
        textAlign: "center",
        width: "40%",
        marginRight: 15,
    },
    input: {
        height: 40,
        width: "60%",
        borderBottomWidth: 1,
        borderBottomColor: "#A0A0A0",
        marginBottom: 15,
        fontSize: 18,
        textAlign: "center",
    },
    saveButtonContainer: {
        width: "40%",
        alignItems: "center",
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "80%",
    },
    Button: {
        backgroundColor: "#FFCECE",
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: "center",
        alignSelf: "center",
        width: "60%",
        borderWidth: 1,
        borderColor: "black",
        padding: 5,
        borderRadius: 15,
        marginBottom: 30,
    },
    ButtonText: {
        color: "#544848",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    Button2: {
        marginTop: 10,
        alignSelf: "center",
        width: "70%",
    },
    ButtonText2: {
        color: "#544848",
        fontSize: 16,
        textAlign: "center",
    },
    ButtonText3: {
        color: "#544848",
        fontSize: 22,
        textAlign: "center",
    },
    separator: {
        height: 1,
        width: "80%",
        backgroundColor: "#737373",
        marginVertical: 20,
    },
    bloodText: {
        fontSize: 18,
        textAlign: "center",
        marginLeft: 30,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        margin: 20,
        width: 200,
        height: 200,
        backgroundColor: "white",
        borderRadius: 25,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bloodTypeItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    bloodTypeText: {
        fontSize: 18,
        textAlign: "center",
    },
    dateInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "60%",
        borderBottomWidth: 1,
        borderBottomColor: "#A0A0A0",
        marginBottom: 15,
    },
    dateInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        textAlign: "center",
        marginLeft: 10,
    },
    calendar: {
        marginLeft: 10,
        width: 25,
        height: 25,
    },
    datePickerContainer: {
        marginLeft: -25,
        width: "9%",
    },
    memberDelete: {
        padding: 10,
        borderRadius: 10,
        marginTop: 25,
    },
    memberDeleteText: {
        color: "red",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default UserInfo;
