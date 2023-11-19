import React, { useState } from 'react';
import { Button, View, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Exif from 'react-native-exif';

const PictureMap = () => {
  const [imageExif, setImageExif] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('갤러리에 접근하기 위한 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets) {
      result.assets.forEach(asset => {
        Exif.getExif(asset.uri)
          .then(msg => {
            console.log(msg);
            setImageExif(msg.exif);
          })
          .catch(msg => console.error('Error getting EXIF data: ', msg));
      });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Select Image" onPress={pickImage} />
      {imageExif && (
        <View>
          <Text>Latitude: {imageExif.GPSLatitude}</Text>
          <Text>Longitude: {imageExif.GPSLongitude}</Text>
        </View>
      )}
    </View>
  );
}

export default PictureMap;