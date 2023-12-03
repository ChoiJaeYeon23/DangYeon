import React, { useState, useEffect } from 'react';
import { View, Image, Alert, Text, ScrollView, StyleSheet, TouchableWithoutFeedback, Modal, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import addimage from '../../assets/add_image.png'
import axios from 'axios';

const PictureMap = () => {
  const [regionImages, setRegionImages] = useState({}); // 지역별 사진 URI를 저장하는 객체
  const [selectedImage, setSelectedImage] = useState({}); // 각 지역별로 선택된 이미지 URI를 저장
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRegion, setCurrentRegion] = useState(null);

  // 인천광역시, 서울특별시            => 경기도
  // 대전광역시, 세종특별자치시        => 충청남도
  // 광주광역시                       => 전라남도
  // 부산광역시, 대구광역시, 울산광역시 => 경상남도
  const regionData = {
    '경기도': [
      '수원', '성남', '의정부', '안양', '부천', '광명', '평택', '동두천', '안산', '고양', '과천', '구리', '남양주',
      '오산', '시흥', '군포', '의왕', '하남', '용인', '파주', '이천', '안성', '김포', '화성', '광주', '양주', '포천',
      '여주', '연천', '가평', '양평', '인천', '서울'
    ],
    '강원도': [
      '춘천', '원주', '강릉', '동해', '태백', '속초', '삼척', '홍천', '횡성', '영월', '평창', '정선', '철원',
      '화천', '양구', '인제', '고성', '양양'
    ],
    '충청북도': [
      '청주', '충주', '제천', '보은', '옥천', '영동', '증평', '진천', '괴산', '음성', '단양', '청원'
    ],
    '충청남도': [
      '천안', '공주', '보령', '아산', '서산', '논산', '계룡', '당진', '금산', '부여', '서천', '청양', '홍성',
      '예산', '태안', '대전', '세종'
    ],
    '전라북도': [
      '전주', '군산', '익산', '정읍', '남원', '김제', '완주', '진안', '무주', '장수', '임실', '순창', '고창', '부안'
    ],
    '전라남도': [
      '목포', '여수', '순천', '나주', '광양', '담양', '곡성', '구례', '고흥', '보성', '화순', '장흥', '강진', '해남',
      '영암', '무안', '함평', '영광', '장성', '완도', '진도', '신안', '광주'
    ],
    '경상북도': [
      '포항', '경주', '김천', '안동', '구미', '영주', '영천', '상주', '문경', '경산', '군위', '의성', '청송', '영양',
      '영덕', '청도', '고령', '성주', '칠곡', '예천', '봉화', '울진', '울릉'
    ],
    '경상남도': [
      '창원', '진주', '통영', '사천', '김해', '밀양', '거제', '양산', '의령', '함안', '창녕', '고성', '남해', '하동',
      '산청', '함양', '거창', '합천', '부산', '대구', '울산'
    ],
    '제주특별자치도': [
      '제주'
    ]
  };

  // 각 도의 위치를 화면상 대략적으로 나타내는 좌표
  const regionCoordinates = {
    '경기도': { x: '30.8%', y: '20.5%' },
    '강원도': { x: '52%', y: '15%' },
    '충청북도': { x: '40%', y: '33.5%' },
    '충청남도': { x: '25%', y: '39.5%' },
    '전라북도': { x: '31.5%', y: '52.7%' },
    '전라남도': { x: '25%', y: '67%' },
    '경상북도': { x: '62.5%', y: '41.5%' },
    '경상남도': { x: '51%', y: '60.5%' },
    '제주특별자치도': { x: '24%', y: '87.5%' }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '갤러리에 접근하기 위한 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true, // 여러 사진 선택가능
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map(asset => asset.uri);
      await processImages(result.assets);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const storedImages = await AsyncStorage.getItem('regionImages');
      if (storedImages !== null) {
        setRegionImages(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error('Failed to load images', error);
    }
  };

  const saveImages = async (images) => {
    try {
      await AsyncStorage.setItem('regionImages', JSON.stringify(images));
    } catch (error) {
      console.error('Failed to save images', error);
    }
  };

  const processImages = async (assets) => {
    let newRegionImages = { ...regionImages };

    for (const asset of assets) {
      if (asset.exif) {
        const { GPSLatitude, GPSLongitude } = asset.exif;
        if (GPSLatitude && GPSLongitude) {
          const addr = await getReverseGeocodingData(GPSLatitude, GPSLongitude);
          const region = determineRegion(addr || '');
          newRegionImages[region] = newRegionImages[region] || [];
          newRegionImages[region].push({ uri: asset.uri, address: addr }); // 이미지 객체에 주소 추가
        }
      }
    }
    setRegionImages(newRegionImages);
    saveImages(newRegionImages);

        
  };

  const getReverseGeocodingData = async (lat, lon) => {

    const apiKey = 'AIzaSyAUoOgEdqAJjl2MbnqQiztR-8Et2_vFQMA';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.status === 'OK') {
        const address = json.results[0].formatted_address;
        console.log(address); // 로그로 주소를 출력
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

  const determineRegion = (address) => {
    if (!address) {
      return '주소 정보 없음';
    }

    for (let [region, cities] of Object.entries(regionData)) {
      const cityMatch = cities.some(city => address.includes(city));
      if (cityMatch) {
        return region;
      }
    }
    return '지역을 결정할 수 없음';
  };  // 역지오코딩으로 나온 결과를 8도 중 하나(데이터는 region에 저장)로 변환해주는 함수

  const renderImageOnMap = (region) => {
    const uris = regionImages[region];
    const coordinates = regionCoordinates[region];

    if (!coordinates || !uris || uris.length === 0) {
      return null;
    }

    const imageStyle = {
      position: 'absolute',
      left: coordinates.x,
      top: coordinates.y,
      width: 50,
      height: 50,
      zIndex: 1,
      borderRadius: 50
    };

    // 선택된 이미지 또는 첫 번째 이미지를 기본적으로 표시
    const imageUri = selectedImage[region] || uris[0].uri

    return (
      <TouchableWithoutFeedback key={region} onPress={() => onRegionPress(region)}>
        <Image source={{ uri: imageUri }} style={imageStyle} />
      </TouchableWithoutFeedback>
    );
  };

  const onRegionPress = (region) => {
    setCurrentRegion(region);
    setModalVisible(true);
  };

  const onImageSelect = (uri) => {
    setSelectedImage({ ...selectedImage, [currentRegion]: uri });
    setModalVisible(false);
  };

  // 사진 삭제 함수
  const deleteImage = (region, uriToDelete) => {
    const updatedImages = regionImages[region].filter(imageData => imageData.uri !== uriToDelete);
    const updatedRegionImages = { ...regionImages, [region]: updatedImages }; // 업데이트된 이미지 목록으로 상태를 설정
    setRegionImages(updatedRegionImages);
    saveImages(updatedRegionImages);
  };

  // 사진선택시 모달을 통해 사진선택하게 만든 함수 및 각 지역에 배열형태로 사진 저장
  const renderModalContent = () => {
    if (!currentRegion || !regionImages[currentRegion]) return null;

    return (
      <View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <AntDesign name="close" size={30} color="black" />
        </TouchableOpacity>
        <ScrollView style={styles.modalContent} contentContainerStyle={styles.scrollViewContent}>
          {regionImages[currentRegion].map((imageData, index) => (
            <View key={index} style={styles.imageContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteImage(currentRegion, imageData.uri)}
              >
                <AntDesign name="delete" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onImageSelect(imageData.uri)}>
                <Image source={{ uri: imageData.uri }} style={styles.modalImage} />
              </TouchableOpacity>
              <Text style={styles.addressText}>{imageData.address}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };







  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={addimage} style={styles.addImage} />
      </TouchableOpacity>
      <View style={styles.mapContainer}>
        <Image source={require('../../assets/8domap.png')} style={styles.mapStyle} />
        {Object.keys(regionImages).map(region => renderImageOnMap(region))}
      </View>
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        {renderModalContent()}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    zIndex: 1, // 다른 요소 위에 보이도록 zIndex 설정
  },
  mapContainer: {
    width: '100%',
    height: '93%',
    position: 'relative',
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
  modalContent: {
    paddingTop: '10%'
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  modalImage: {
    width: 200,
    height: 200,
    margin: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  addImage: {
    left: '44%',
    width: 35,
    height: 30,
    marginTop: '1%'
  },
  imageContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  addressText: {
    textAlign: 'center',
    paddingTop: 5,
    fontSize: 12
  },
  deleteButton: {
    position: 'absolute',
    left: '8%',
    top: '50%',
    padding: 5,
    borderRadius: 10,
    zIndex: 2,
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default PictureMap;