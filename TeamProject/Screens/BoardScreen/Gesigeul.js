import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native'; // useNavigation 훅 추가

const Gesigeul = () => {
  const [text, setText] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const navigation = useNavigation(); // useNavigation 훅 사용

  const handleCameraPress = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setImageSource(source);
      }
    });
  };

  const handleSavePress = () => {
    console.log('내용 저장: ', text);
    navigation.navigate('Board', { savedText: text }); // Board 화면으로 이동하면서 데이터 전달
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.doneButton} onPress={handleSavePress}>
          <Text style={styles.doneText}>저장</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="내용을 입력하세요."
        placeholderTextColor="#989292"
        multiline
        value={text}
        onChangeText={setText}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
          <Icon name="camera" size={30} color="#808080" />
        </TouchableOpacity>
      </View>
      {imageSource && <Image source={imageSource} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  doneButton: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#FDE0E0',
  },
  doneText: {
    fontSize: 12,
    color: 'black',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
  },
  cameraButton: {
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default Gesigeul;
