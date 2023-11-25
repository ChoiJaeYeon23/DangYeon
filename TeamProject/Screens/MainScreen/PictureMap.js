import React, { useState } from 'react';
import { Button, View, Text, Image, Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PictureMap = () => {
  const [imageExifs, setImageExifs] = useState([]);
  const [imageUris, setImageUris] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const regionCoordinates = {
    '경기도': { x: 100, y: 200 },
    // 나머지 8도에 대한 좌표도 추가해야함..
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '갤러리에 접근하기 위한 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map(asset => asset.uri);
      setImageUris(uris);
      await processImages(result.assets);
    }
  };

  const processImages = async (assets) => {
    const exifs = [];
    const addrs = [];

    for (const asset of assets) {
      if (asset.exif) {
        exifs.push(asset.exif);

        const { GPSLatitude, GPSLongitude } = asset.exif;
        if (GPSLatitude && GPSLongitude) {
          const addr = await getReverseGeocodingData(GPSLatitude, GPSLongitude);
          addrs.push(addr || '주소를 찾을 수 없음');
        } else {
          addrs.push('GPS 데이터 없음');
        }
      } else {
        exifs.push('EXIF 데이터 없음');
        addrs.push('주소 정보 없음');
      }
    }

    setImageExifs(exifs);
    setAddresses(addrs);
  };

  const getReverseGeocodingData = async (lat, lon) => {
    const apiKey = 'AIzaSyAUoOgEdqAJjl2MbnqQiztR-8Et2_vFQMA'; // Google Maps API 키를 사용하세요
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.status === 'OK') {
        const address = json.results[0].formatted_address;
        return address;
      } else {
        console.log(json.error_message);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const renderImageOnMap = (uri, address) => {
    const region = determineRegion(address);
    const coordinates = regionCoordinates[region];

    if (!coordinates) {
      return null; // 좌표가 없는 경우 렌더링하지 않음
    }

    const imageStyle = {
      position: 'absolute',
      left: coordinates.x,
      top: coordinates.y,
      width: 50, // 이미지 크기 조정 필요
      height: 50, // 이미지 크기 조정 필요
    };

    return (
      <Image
        key={uri}
        source={{ uri }}
        style={imageStyle}
      />
    );
  };
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <Button title="이미지 선택" onPress={pickImage} />
        <View style={styles.mapContainer}>
          {/* 대한민국 8도 지도 이미지 */}
          <Image source={require('../../assets/8domap.png')} style={styles.mapStyle} />
          {/* 각 사진을 지도에 배치 */}
          {addresses.map((address, index) => renderImageOnMap(imageUris[index], address))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    position: 'relative',
    width: '100%', // 지도의 크기에 맞게 조정
    height: 400, // 지도의 높이에 맞게 조정
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
});

export default PictureMap;