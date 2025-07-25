import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CampingSpot } from '../types/camping';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const MapElement = styled.div`
  width: 100%;
  height: 100%;
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ecf0f1;
  color: #666;
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

interface MapProps {
  campingSpots: CampingSpot[];
  selectedSpot: CampingSpot | null;
  onSpotSelect: (spot: CampingSpot) => void;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const Map: React.FC<MapProps> = ({ campingSpots, selectedSpot, onSpotSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // 카카오맵 API 로드
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        initMap();
      } else {
        const kakaoMapApiKey = process.env.VITE_KAKAO_MAP_API_KEY || 'YOUR_KAKAO_MAP_API_KEY';
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&libraries=services`;
        script.onload = () => {
          window.kakao.maps.load(() => {
            initMap();
          });
        };
        document.head.appendChild(script);
      }
    };

    loadKakaoMap();
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(36.5, 127.5), // 한국 중심
      level: 8
    };

    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);
    updateMarkers();
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    // 기존 마커들 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 새로운 마커들 추가
    campingSpots.forEach(spot => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(spot.latitude, spot.longitude),
        map: mapInstanceRef.current
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onSpotSelect(spot);
      });

      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 5px 0; font-size: 14px;">${spot.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${spot.address}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">
              <span style="color: ${spot.price.type === 'free' ? '#27ae60' : '#e74c3c'};">
                ${spot.price.type === 'free' ? '무료' : '유료'}
              </span>
              ${spot.reservation.available ? ' | 예약 가능' : ' | 예약 불가'}
            </p>
          </div>
        `
      });

      // 마커에 마우스 오버 시 인포윈도우 표시
      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        infowindow.open(mapInstanceRef.current, marker);
      });

      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close();
      });

      markersRef.current.push(marker);
    });

    // 선택된 캠핑장이 있으면 해당 위치로 이동
    if (selectedSpot) {
      const position = new window.kakao.maps.LatLng(
        selectedSpot.latitude, 
        selectedSpot.longitude
      );
      mapInstanceRef.current.panTo(position);
      mapInstanceRef.current.setLevel(6);
    }
  };

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [campingSpots, selectedSpot]);

  return (
    <MapContainer>
      <MapElement ref={mapRef} />
      {!window.kakao && (
        <MapPlaceholder>
          <div>
            <p>지도를 불러오는 중...</p>
            <p style={{ fontSize: '12px', marginTop: '10px' }}>
              카카오맵 API 키가 필요합니다.
            </p>
          </div>
        </MapPlaceholder>
      )}
    </MapContainer>
  );
};

export default Map; 