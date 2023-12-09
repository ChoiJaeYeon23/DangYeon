import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Clipboard from "expo-clipboard";

const CoupleConnect = ({ navigation }) => {
    const [inviteCode, setInviteCode] = useState("");
    const [text, setText] = useState("");

    // 서버에서 초대코드를 가져오는 함수
    const fetchInviteCode = () => {
        fetch("http://3.34.6.50:8080/api/generate-invite-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code) {
                    setInviteCode(data.code);
                }
            })
            .catch((error) => console.error("Error fetching invite code:", error));
    };

    // 커플 연결 요청 함수
    const goToProfileInput = async () => {
        if (text.trim() === "") {
            Alert.alert("오류", "코드를 입력해주세요.");
            return;
        }

        try {
            const response = await fetch("http://3.34.6.50:8080/api/connect-couple", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inviteCode: text }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "코드가 일치하지 않습니다.");
            }

            navigation.navigate("MainTab");
        } catch (error) {
            console.error("Error connecting couple:", error);
            Alert.alert("실패", error.message || "코드가 일치하지 않습니다.");
        }
    };

    const onChangeText = (inputText) => {
        setText(inputText);
    };

    const copyToClipboard = () => {
        Clipboard.setString(inviteCode);
        Alert.alert("복사", `클립보드에 복사된 초대코드: ${inviteCode}`);
    };

    useEffect(() => {
        fetchInviteCode();
    }, []);

    const Separator = () => <View style={styles.separator} />;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={false}
                keyboardShouldPersistTaps='handled'
            >
                <View style={styles.container}>
                    <Text style={styles.titleText}>서로의 초대코드를 입력하세요.</Text>
                    <Separator />
                    <Text style={styles.codeTitle}>내 초대코드</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text style={styles.code}>{inviteCode}</Text>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
                            <Text style={styles.buttonText}>복사</Text>
                        </TouchableOpacity>
                    </View>
                    <Separator />
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>상대방의 초대코드를 입력하세요.</Text>
                        <TextInput
                            onChangeText={onChangeText}
                            value={text}
                            placeholder="전달받은 코드 입력"
                            style={styles.input}
                        />
                    </View>
                    <TouchableOpacity onPress={goToProfileInput} style={styles.connectButton}>
                        <Text style={styles.connectButtonText}>연결하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                        style={styles.connectButton}
                    >
                        <Text style={styles.connectButtonText}>로그인 화면으로 이동하기</Text>
                    </TouchableOpacity>
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
    titleText: {
        textAlign: "center",
        marginBottom: 20,
        color: "#544848",
        fontSize: 24,
        fontWeight: "bold",
    },
    codeContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    codeTitle: {
        textAlign: "center",
        fontSize: 22,
        marginBottom: 20,
        color: "#544848",
        fontWeight: "bold",
    },
    code: {
        textAlign: "center",
        fontSize: 18,
        marginVertical: 8,
        marginLeft: 90,
    },
    button: {
        backgroundColor: "#EBDBDB",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 15,
        marginRight: 40,
    },
    buttonText: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 17,
    },
    inputContainer: {
        width: "100%",
    },
    inputTitle: {
        textAlign: "center",
        marginBottom: 8,
        fontSize: 18,
        marginBottom: 10,
        color: "#544848",
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        width: "80%",
        borderBottomColor: "#A0A0A0",
        marginBottom: 15,
        fontSize: 18,
        textAlign: "center",
        alignSelf: "center",
    },
    connectButton: {
        backgroundColor: "#FFCECE",
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 15,
    },
    connectButtonText: {
        textAlign: "center",
        color: "#544848",
        fontWeight: "bold",
        fontSize: 20,
    },
    separator: {
        height: 1,
        width: "80%",
        backgroundColor: "#737373",
        marginBottom: 50,
    },
});

export default CoupleConnect;