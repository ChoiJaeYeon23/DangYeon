import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const weatherIcons = {
    'Clear': require('../assets/clear.png'),
    'Clouds': require('../assets/clouds.png'),
    'Rain': require('../assets/rain.png'),
    'Snow': require('../assets/snow.png'),
    'Dust': require('../assets/dust.png'),
    'Drizzle': require('../assets/drizzle.png'),
    'Fog': require('../assets/fog.png'),
    'Thunderstorm': require('../assets/thunder.png'),
};

const weatherTranslations = {
    'Clear': '맑음',
    'Clouds': '흐림',
    'Rain': '비',
    'Snow': '눈',
    'Dust': '먼지',
    'Drizzle': '이슬비',
    'Fog': '안개',
    'Thunderstorm': '천둥번개',
};

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('위치 권한이 거부되었습니다.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
            setIsLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (currentLocation) {
            const apiKey = '9edb951af86953242ae7a71e5c342ad2'; 
            const { latitude, longitude } = currentLocation;

            axios
                .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
                .then((response) => {
                    setWeatherData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching weather data:', error);
                });
        }
    }, [currentLocation]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>로딩 중...</Text>
            </View>
        );
    }

    if (!weatherData) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>날씨 데이터 불러오는 중...</Text>
            </View>
        );
    }

    const temperature = Math.round(weatherData.main.temp - 273.15);
    const weatherDescription = weatherData.weather[0].main;
    const translatedWeather = weatherTranslations[weatherDescription];

    return (
        <View style={styles.container}>
            <View style={styles.weatherRow}>
                <Image source={weatherIcons[weatherDescription]} style={styles.weatherIcon} />
                <View style={styles.weatherDetails}>
                    <Text style={styles.titleText}>{temperature}°C</Text>
                    <Text style={styles.titleText}>{translatedWeather}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>날씨 정보 새로고침</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFF9F9',
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherDetails: {
        marginLeft: 10,
    },
    titleText: {
        color: '#544848',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    weatherIcon: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    button: {
        backgroundColor: '#FFCECE',
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 20,
        marginTop: 20,
    },
    buttonText: {
        color: '#544848',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Weather;