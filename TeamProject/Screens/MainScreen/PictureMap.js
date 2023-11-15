import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

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

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('사용자가 이미지 선택을 취소했습니다.');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setImageUri(source);

        // 메타데이터에서 위도와 경도 추출
        const { latitude, longitude } = response;
        if (latitude && longitude) {
          setLocation({ latitude, longitude });
        }
      }
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="이미지 선택" onPress={selectImage} />
      {imageUri && <Image source={imageUri} style={{ width: 300, height: 300 }} />}
      {location && (
        <Text>
          위도: {location.latitude}, 경도: {location.longitude}
        </Text>
      )}
    </View>
  );
};

export default PictureMap;
