import React, { useState } from 'react';
import { Button, View, Text, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PictureMap = () => {
  const [imageExifs, setImageExifs] = useState([]);
  const [imageUris, setImageUris] = useState([]);
  const [addresses, setAddresses] = useState([]);

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
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Google Maps API 키를 사용하세요
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

  return (
    <ScrollView>
      <View>
        <Button title="이미지 선택" onPress={pickImage} />
        {imageUris.map((uri, index) => (
          <View key={index}>
            <Image source={{ uri }} style={{ width: 200, height: 200, marginBottom: 20 }} />
            {imageExifs[index] && (
              Object.entries(imageExifs[index]).map(([key, value]) => (
                <Text key={key}>{`${key}: ${value}`}</Text>
              ))
            )}
            {addresses[index] && <Text>주소: {addresses[index]}</Text>}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default PictureMap;
