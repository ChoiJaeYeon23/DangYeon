import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Exif from 'react-native-exif';

const PictureMap = () => {
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);

  const selectImage = () => {
    const options = {
      title: '이미지 선택',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('이미지 선택을 취소하였습니다.');
      } else if (response.error) {
        console.log('이미지 피커 오류', response.error);
      } else {
        const source = { uri: response.uri };
        setImageUri(source);
        readImageLocation(response.path);
      }
    });
  };

  const readImageLocation = async (imagePath) => {
    try {
      const exifData = await Exif.getExif(imagePath);
      const { GPSLatitude, GPSLongitude } = exifData;

      if (GPSLatitude && GPSLongitude) {
        setLocation({
          latitude: GPSLatitude,
          longitude: GPSLongitude,
        });
      } else {
        console.log('이미지에 GPS 정보가 없습니다');
      }
    } catch (error) {
      console.error('이미지 데이터를 로딩하는데에 오류가 발생했습니다.', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="이미지를 선택하십시오" onPress={selectImage} />
      {imageUri && <Image source={imageUri} style={{ width: 300, height: 300 }} />}
      {location && (
        <Text>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      )}
    </View>
  );
};

export default PictureMap;
