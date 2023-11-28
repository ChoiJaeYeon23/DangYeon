import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PictureMap from './PictureMap';
import Weather from './Weather';

const Main = ({ navigation }) => {
    const goToPictureMap = () => { //사진지도 화면으로 이동 수정!!!!!!!!
        navigation.navigate('PictureMap');
    };
    const goToCalendar = () => { //캘린더 화면으로 이동
        navigation.navigate('CalendarScreen');
    };
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.weatherWidget}>
                    <Weather />
                </View>
                <TouchableOpacity onPress={goToCalendar} style={styles.anniversary}>
                    <Text style={styles.anniversaryText}>사랑한 지</Text>
                    <Text style={styles.anniversaryText2}>100일 째</Text>
                    <Text style={styles.anniversaryText}>수쨩 💖 원우</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.map}>
                <PictureMap />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#FFF9F9',
    },
    topContainer: {
        paddingTop: 10,
        paddingHorizontal: 20, // 좌우 여백 설정
        alignItems: 'center', // 수직 방향으로 중앙 정렬
    },
    weatherWidget: {
        position: 'absolute', // 날씨 위젯을 위해 절대 위치 사용
        left: 50, // 왼쪽 정렬
        width: 100, // 날씨 위젯의 너비
        height: 100, // 날씨 위젯의 높이
        alignItems: 'center', // 내부 텍스트 등을 중앙에 배치
        justifyContent: 'center', // 내부 텍스트 등을 중앙에 배치
    },
    anniversary: {
        position: 'absolute',
        right: 50,
        marginTop: 10,
    },
    anniversaryText: {
        color: '#544848',
        fontSize: 20,
        textAlign: 'center',
        margin: 2,
    },
    anniversaryText2: {
        color: '#544848',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
        justifyContent: 'center', // 지도를 중앙에 배치
        borderWidth: 1, // 테두리 두께
        borderColor: 'black',
        margin: 20,
        marginTop: 90,
    }
});

export default Main