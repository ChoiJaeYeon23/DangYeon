import { View, Text, TouchableOpacity } from 'react-native'

const Main = ({ navigation }) => {
    // const goToPictureMap = () => { //사진지도 화면으로 이동 수정!!!!!!!!
    //     navigation.navigate('PictureMap');
    // };
    const goToWeather = () => { //날씨 화면으로 이동
        navigation.navigate('Weather');
    };
    const goToCalendar = () => { //캘린더 화면으로 이동 수정!!!!!!
        navigation.navigate('CalendarScreen');
    };
    return (
        <View>
            {/* <TouchableOpacity onPress={goToPictureMap}>
                <Text>사진지도 보러가기</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={goToWeather}>
                <Text>날씨 보러가기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToCalendar}>
                <Text>캘린더 보러가기</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Main