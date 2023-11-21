import React, { useState } from 'react';
import { Button, View, Text, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PictureMap = () => {
  const [imageExif, setImageExif] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [address, setAddress] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '갤러리에 접근하기 위한 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true,
    });

    if (!result.canceled && result.assets) {
      const selectedAsset = result.assets[0]; // 첫 번째 이미지를 선택
      setImageUri(selectedAsset.uri);

      if (selectedAsset.exif) {
        setImageExif(selectedAsset.exif);
        // 위도와 경도가 있는 경우, 역지오코딩 함수를 호출합니다.
        const { GPSLatitude, GPSLongitude } = selectedAsset.exif;
        if (GPSLatitude && GPSLongitude) {
          const address = await getReverseGeocodingData(GPSLatitude, GPSLongitude);
          // 주소를 상태에 저장하거나 사용자에게 보여줄 수 있습니다.
        }
      } else {
        Alert.alert('EXIF 데이터 없음', '선택된 이미지에 EXIF 데이터가 없습니다.');
        setImageExif(null);
      }
    }
  };



  const getReverseGeocodingData = async (lat, lon) => {
    const apiKey = 'AIzaSyAUoOgEdqAJjl2MbnqQiztR-8Et2_vFQMA'; // Google Maps API 키
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.status === 'OK') {
        const address = json.results[0].formatted_address;
        setAddress(address); // 상태 업데이트
        console.log(address);
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
        {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginBottom: 20 }} />}
        {imageExif && (
          Object.entries(imageExif).map(([key, value]) => (
            <Text key={key}>{`${key}: ${value}`}</Text>
          ))
        )}
        {address && <Text>주소: {address}</Text>}
      </View>
    </ScrollView>
  );

}

export default PictureMap;
