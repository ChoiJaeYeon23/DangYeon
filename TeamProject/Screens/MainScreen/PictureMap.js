import React, { useState, useEffect } from 'react';
import { Button, View, Text, Image, Alert, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PictureMap = () => {
  const [regionImages, setRegionImages] = useState({}); // 지역별 사진 URI를 저장하는 객체
  const [selectedImage, setSelectedImage] = useState({}); // 각 지역별로 선택된 이미지 URI를 저장

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
    '경기도': { x: '30.5%', y: '20%' },
    '강원도': { x: '52%', y: '16%' },
    '충청북도': { x: '41%', y: '35%' },
    '충청남도': { x: '25%', y: '39.5%' },
    '전라북도': { x: '32%', y: '53%' },
    '전라남도': { x: '25%', y: '67%' },
    '경상북도': { x: '62%', y: '42%' },
    '경상남도': { x: '54%', y: '61%' },
    '제주특별자치도': { x: '25%', y: '88%' }
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

  const processImages = async (assets) => {
    const addrs = []; //exif 데이터 (위도경도) -> 역지오코딩된 주소 데이터 저장
    let newRegionImages = { ...regionImages }; // 현재 지역별 사진 데이터 복사

    for (const asset of assets) {
      if (asset.exif) {

        const { GPSLatitude, GPSLongitude } = asset.exif;
        if (GPSLatitude && GPSLongitude) {
          const addr = await getReverseGeocodingData(GPSLatitude, GPSLongitude);
          const region = determineRegion(addr || '');
          newRegionImages[region] = newRegionImages[region] || [];
          newRegionImages[region].push(asset.uri);
          addrs.push(addr || '주소를 찾을 수 없음(시군구 도시 주소추가)');
        } else {
          addrs.push('GPS 데이터 없음');
        }
      } else {
      }
    }
    setRegionImages(newRegionImages); // 지역별 사진 데이터 업데이트

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
    const imageUri = selectedImage[region] || uris[0];

    return (
      <TouchableWithoutFeedback key={region} onPress={() => onRegionPress(region)}>
        <Image source={{ uri: imageUri }} style={imageStyle} />
      </TouchableWithoutFeedback>
    );
  };


  // 같은 도(예를들어 경기도)에 사진이 2개이상 들어갔을때 겉으로 표시될 사진 고르는 함수
  const onRegionPress = (region) => {
    if (regionImages[region] && regionImages[region].length > 1) {    // 지역별 사진이 1개 이상 있을 때만 작동
      // 일단? 간단하게 터치시 다음 사진을 보여주는방식임
      const currentIndex = regionImages[region].indexOf(selectedImage[region]) || 0;
      const nextIndex = (currentIndex + 1) % regionImages[region].length;
      setSelectedImage({ ...selectedImage, [region]: regionImages[region][nextIndex] });
    }
  };


  return (
    <ScrollView>
      <View style={styles.container}>
        <Button title="이미지 선택" onPress={pickImage} />
        <View style={styles.mapContainer}>
          <Image source={require('../../assets/8domap.png')} style={styles.mapStyle} />
          {/* 각 사진을 지도에 배치 */}
          {Object.keys(regionImages).map(region => renderImageOnMap(region))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    width: '100%',
    height: 490,
    position: 'relative', 
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
});

export default PictureMap;