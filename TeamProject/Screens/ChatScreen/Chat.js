import{ View, Text, TouchableOpacity } from 'react-native'

const Chat = ({ navigation }) => {
    const goToChat = () => { //채팅 화면으로 이동 수정!!!!!!!!
        navigation.navigate('C');
    };
    return(
        <View>
            <TouchableOpacity onPress={goToChat}>
                <Text>채팅하러 가기</Text>
            </TouchableOpacity>
        </View>
    )
}
export default Chat