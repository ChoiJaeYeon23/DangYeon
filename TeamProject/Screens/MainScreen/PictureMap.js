import React, { useState, useEffect } from 'react';
import { Button, View, Text, Image, Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PictureMap = () => {
  const [imageUris, setImageUris] = useState([]);
  const [addresses, setAddresses] = useState([]);

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
    '제주특별자치도':[
      '제주'
    ]
  };

  // 각 도의 위치를 대략적으로 나타내는 좌표 (이 값들은 예시이며, 실제 값을 조정해야 합니다)
  const regionCoordinates = {
    '경기도': { x: '30%', y: '40%' },
    '강원도': { x: '45%', y: '30%' },
    '충청북도': { x: '35%', y: '50%' },
    '충청남도': { x: '30%', y: '60%' },
    '전라북도': { x: '20%', y: '70%' },
    '전라남도': { x: '20%', y: '80%' },
    '경상북도': { x: '55%', y: '65%' },
    '경상남도': { x: '60%', y: '75%' },
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
      setImageUris(uris);
      await processImages(result.assets);
    }
  };

  const processImages = async (assets) => {
    const exifs = []; //exif 데이터 저장
    const addrs = []; //exif 데이터 (위도경도) -> 역지오코딩된 주소 데이터 저장

    for (const asset of assets) {
      if (asset.exif) {
        exifs.push(asset.exif);

        const { GPSLatitude, GPSLongitude } = asset.exif;
        if (GPSLatitude && GPSLongitude) {
          const addr = await getReverseGeocodingData(GPSLatitude, GPSLongitude);
          addrs.push(addr || '주소를 찾을 수 없음(시군구 도시 주소추가)');
        } else {
          addrs.push('GPS 데이터 없음');
        }
      } else {
        exifs.push('EXIF 데이터 없음');
      }
    }

    setAddresses(addrs);
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
  };

  const renderImageOnMap = (uri, address) => {
    const region = determineRegion(address);
    const coordinates = regionCoordinates[region];

    if (!coordinates) {
      return null; // 좌표가 없는 경우 렌더링하지 않음
    }

    const imageStyle = {
      position: 'absolute',
      left: coordinates.x,
      top: coordinates.y,
      width: 50, // 이미지 크기 조정
      height: 50, // 이미지 크기 조정
      zIndex: 1,
    };

    return (
      <Image
        key={uri}
        source={{ uri }}
        style={imageStyle}
      />
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Button title="이미지 선택" onPress={pickImage} />
        <View style={styles.mapContainer}>
          {/* 지도 이미지 경로가 올바른지 확인하세요 */}
          <Image source={require('../../assets/8domap.png')} style={styles.mapStyle} />
          {/* 각 사진을 지도에 배치 */}
          {imageUris.map((uri, index) => renderImageOnMap(uri, addresses[index]))}
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
    width: '100%', // 지도의 너비
    height: 490, // 지도의 높이
    position: 'relative', // 자식 요소들을 절대 위치로 배치하기 위함
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
});

export default PictureMap;