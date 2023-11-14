import { View, Text, TouchableOpacity } from 'react-native'

const Board = ({ navigation }) => {
    const goToBoard = () => { //게시판 화면으로 이동 수정!!!!!!!!
        navigation.navigate('Board');
    };
    return (
        <View>
            <TouchableOpacity onPress={goToBoard}>
                <Text>게시판 보러가기</Text>
            </TouchableOpacity>
        </View>
    )
}
export default Board