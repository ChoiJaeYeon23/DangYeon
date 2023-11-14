import { View, Text, TouchableOpacity } from 'react-native'

const Etc = ({ navigation }) => {
    const goToRanking = () => { //랭킹 화면으로 이동 수정!!!!!!!!
        navigation.navigate('Bullentinboard');
    };
    const goToBucketList = () => { //버킷리스트 화면으로 이동
        navigation.navigate('BucketList');
    };
    const goToAttendanceCheck = () => { //출석체크 화면으로 이동 수정!!!!!!
        navigation.navigate('Entire');
    };
    return (
        <View>
            <TouchableOpacity onPress={goToRanking}>
                <Text>랭킹 보러가기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToBucketList}>
                <Text>버킷리스트 보러가기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToAttendanceCheck}>
                <Text>출석체크 하러가기</Text>
            </TouchableOpacity>
        </View>
    )
}
export default Etc