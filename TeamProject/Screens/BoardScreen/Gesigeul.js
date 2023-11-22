import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const Gesigeul = () => {
  const [text, setText] = useState('');
  const [imageSources, setImageSources] = useState([]);
  const navigation = useNavigation();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '갤러리에 접근하기 위한 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      setImageSources(result.assets.map(asset => ({ uri: asset.uri })));
    }
  };

  const handleSavePress = () => {
    console.log('내용 저장: ', text);

    // 저장할 데이터 구조 생성
    const postData = {
      text: text,
      images: imageSources.map(source => source.uri)
    };

    // 예시: 콘솔에 데이터 출력
    console.log('저장할 데이터: ', postData);

    // 다음 화면으로 데이터 전달
    navigation.navigate('Board', { postData: postData });
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
      <ScrollView horizontal style={styles.imageScroll}>
        {imageSources.map((source, index) => (
          <Image key={index} source={source} style={styles.image} />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <Icon name="camera" size={30} color="#808080" />
        </TouchableOpacity>
      </View>
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
  imageScroll: {
    height: 210, // 이미지의 높이 + 여백
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 10,
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
});

export default Gesigeul;
