import React, { useState } from 'react';
import { Button, View, Text, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PictureMap = () => {
  const [imageExif, setImageExif] = useState(null);
  const [imageUri, setImageUri] = useState(null);

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
      const selectedAsset = result.assets[0];
      setImageUri(selectedAsset.uri);

      if (selectedAsset.exif) {
        setImageExif(selectedAsset.exif);
        // 콘솔에 EXIF 데이터의 모든 키-값 쌍을 출력
        console.log('EXIF 데이터:');
        Object.entries(selectedAsset.exif).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
      } else {
        Alert.alert('EXIF 데이터 없음', '선택된 이미지에 EXIF 데이터가 없습니다.');
        setImageExif(null);
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
        <Button title="이미지 선택" onPress={pickImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginVertical: 20 }} />}
        {imageExif && (
          Object.entries(imageExif).map(([key, value]) => (
            <Text key={key}>{`${key}: ${value}`}</Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default PictureMap;
