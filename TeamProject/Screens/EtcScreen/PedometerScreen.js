import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';

const PedometerScreen = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");

  const YOUR_DISTANCE_THRESHOLD = 0.5; // 거리 임계값
  const otherUserPosition = {
    latitude: 37.7749,
    longitude: -122.4194,
  };

  // 라디안으로 변환하는 함수
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // 두 위치 간의 거리 계산 함수
  const checkDistance = (userPosition, otherUserPosition) => {
    // 거리 계산 로직...
  };

  // 위치 권한 요청 및 위치 추적
  const requestLocationPermissionAndTrack = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: 50 }, (position) => {
      setUserPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  useEffect(() => {
    requestLocationPermissionAndTrack();

    Pedometer.isAvailableAsync().then(
      (result) => {
        setIsPedometerAvailable(result ? "yes" : "no");
      },
      (error) => {
        setIsPedometerAvailable("no");
      }
    );

    const subscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
    });

    return () => subscription.remove();
  }, []);

  const startPedometer = () => {
    Pedometer.startPedometerUpdatesFromDate(new Date().getTime(), (data) => {
      setSteps(data.numberOfSteps);
    });
  };

  const isWithinDistance = userPosition && checkDistance(userPosition, otherUserPosition);

  return (
    <View>
      <Text>걸음 수: {steps}</Text>
      <TouchableOpacity
        onPress={startPedometer}
        disabled={!isWithinDistance || isPedometerAvailable !== "yes"}>
        <Text>만보기 시작</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PedometerScreen;
