import React, { useState, useEffect } from 'react';
import { View, Image, Alert, Text, ScrollView, StyleSheet, TouchableWithoutFeedback, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import addimage from '../../assets/add_image.png'

const PictureMap = () => {
  const [regionImages, setRegionImages] = useState({}); // 지역별 사진 URI를 저장하는 객체
  const [selectedImage, setSelectedImage] = useState({}); // 각 지역별로 선택된 이미지 URI를 저장
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // 이미지에 저장된 위도경도를 구글 역지오코딩 API를 활용해 주소로 변환 후 주소에 포함된 시를 검색 후 해당되는 8도(+제주도)(경기도.. 강원도.. 제주도.. 등 ) 중 하나에 저장
  const processImages = async (assets) => {
    for (const asset of assets) {
      const formData = new FormData();
      formData.append("img", {
        uri: asset.uri,
        name: `upload-${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      if (asset.exif) {
        const { GPSLatitude, GPSLongitude } = asset.exif;
        if (GPSLatitude && GPSLongitude) {
          const addr = await getReverseGeocodingData(GPSLatitude, GPSLongitude);
          const region = determineRegion(addr || '');

          formData.append("address", addr);
          formData.append("region", region);

          console.log("여기라고", formData)
          try {
            const response = await fetch("http://3.34.6.50:8080/api/upload_images", {
              method: "POST",
              body: formData,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            if (!response.ok) {
              throw new Error("Server response not OK");
            }

            const data = await response.json();
            console.log("Image uploaded:", data);
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        }
      }
    }
  };



  // 역지오코딩(구글맵 지오코딩api 활용) 
  const getReverseGeocodingData = async (lat, lon) => {

    const apiKey = 'AIzaSyAUoOgEdqAJjl2MbnqQiztR-8Et2_vFQMA';
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

  // 역지오코딩으로 나온 결과를 8도 중 하나(데이터는 region에 저장)로 변환해주는 함수
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
  };


  // 서버로부터 이미지 가져오기
  const fetchImages = async () => {
    try {
      const response = await fetch(`http://3.34.6.50:8080/api/get_images`);
      if (!response.ok) {
        throw new Error("Server response not OK");
      }
      const data = await response.json();
  
      // 지역별로 이미지 그룹화
      const groupedImages = {};
      const initialSelectedImage = {};
  
      data.forEach(image => {
        const region = image.image_region || '기타';
        if (!groupedImages[region]) {
          groupedImages[region] = [];
          initialSelectedImage[region] = image.image_uri; // 첫 번째 이미지를 기본 이미지로 설정
        }
        groupedImages[region].push({ uri: image.image_uri, address: image.image_address, id: image.image_id });
      });
  
      setRegionImages(groupedImages);
      setSelectedImage(initialSelectedImage); // 초기 선택된 이미지 설정
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  
  useEffect(() => {
    fetchImages();
  }, []);
  

  // 8도(+제주도)반환 결과 및 사진 uri를 8도이미지 위 해당하는 도에 이미지형태(배열)로 저장
  const renderImageOnMap = (region) => {
    // 지역별 이미지 URI 배열 가져오기
    const uris = regionImages[region];
    if (!uris || uris.length === 0) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }

    // 지역별 좌표 가져오기
    const coordinates = regionCoordinates[region];
    if (!coordinates) {
      return null;
    }

    // 이미지 스타일 정의
    const imageStyle = {
      position: 'absolute',
      left: coordinates.x,
      top: coordinates.y,
      width: 50,
      height: 50,
      zIndex: 1,
      borderRadius: 25 // 원형 이미지로 표시
    };

    // 선택된 이미지 또는 첫 번째 이미지를 기본적으로 표시
    const imageUri = selectedImage[region] || uris[0];

    return (
      <TouchableWithoutFeedback key={region} onPress={() => onRegionPress(region)}>
        <Image source={{ uri: imageUri }} style={imageStyle} />
      </TouchableWithoutFeedback>
    );
  };

  useEffect(() => {
    // selectedImage 상태가 변경될 때마다 실행되는 로직
  }, [selectedImage]);



  // 각 도에 저장된 이미지 클릭시 해당 도에 저장된 사진 및 해당주소 모달화면 보여주기
  const onRegionPress = (region) => {
    setCurrentRegion(region);
    setModalVisible(true);
  };
  // 모달화면에서 이미지 클릭시 Main화면에 보여질 각 도에 해당하는 이미지(프로필이미지) 선택
  const onImageSelect = (uri) => {
    setSelectedImage({ ...selectedImage, [currentRegion]: uri });
    setModalVisible(false);
  };

  // 이미지 삭제 함수
  const deleteImage = async (region, imageToDelete) => {
    try {
      const response = await fetch(`http://3.34.6.50:8080/api/delete_image/${imageToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedImages = regionImages[region].filter(image => image.id !== imageToDelete.id);
        setRegionImages({ ...regionImages, [region]: updatedImages });
      } else {
        console.error('Failed to delete image from server');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };


  // 사진선택시 모달을 통해 사진선택하게 만든 함수 및 각 지역에 배열형태로 사진 저장
  const renderModalContent = () => {
    if (!currentRegion || !regionImages[currentRegion]) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
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
                onPress={() => deleteImage(currentRegion, imageData)}
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
      <Modal visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
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