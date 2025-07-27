import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CampingSpot } from '../types/camping';
import { calculateMapBounds, getDistanceFromCurrentLocation } from '../utils/distance';

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

const LocationButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;

  &:hover {
    background: #f8f9fa;
  }
`;

const RouteButton = styled.button`
  position: absolute;
  top: 50px;
  right: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;

  &:hover {
    background: #f8f9fa;
  }
`;

const MapInfo = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  z-index: 1000;
`;

const DistanceInfo = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(52, 152, 219, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 1000;
  max-width: 200px;
  word-wrap: break-word;
`;

interface MapProps {
  campingSpots: CampingSpot[];
  selectedSpot: CampingSpot | null;
  onSpotSelect: (spot: CampingSpot) => void;
}

const Map: React.FC<MapProps> = ({ campingSpots, selectedSpot, onSpotSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLineRef = useRef<any>(null); // 경로 라인 참조
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<string>('');

  useEffect(() => {
    // Leaflet CSS 로드
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Leaflet JavaScript 로드
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => {
      console.log('Leaflet 로드 완료');
      setMapLoaded(true);
      initMap();
    };
    script.onerror = () => {
      console.error('Leaflet 로드 실패');
    };
    document.head.appendChild(script);
  }, []);

  const getCurrentLocation = (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.log('위치 정보를 가져올 수 없습니다:', error);
            // 기본 위치 (서울)
            const defaultLocation = { lat: 37.5665, lng: 126.9780 };
            setCurrentLocation(defaultLocation);
            resolve(defaultLocation);
          }
        );
      } else {
        console.log('Geolocation이 지원되지 않습니다.');
        const defaultLocation = { lat: 37.5665, lng: 126.9780 };
        setCurrentLocation(defaultLocation);
        resolve(defaultLocation);
      }
    });
  };

  const initMap = async () => {
    if (!mapRef.current || !window.L) return;

    try {
      // 현재 위치 가져오기
      const location = await getCurrentLocation();

      // 지도 초기화
      const map = window.L.map(mapRef.current).setView([location.lat, location.lng], 8);

      // OpenStreetMap 타일 레이어 추가
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      // 현재 위치 마커 추가
      const currentMarker = window.L.marker([location.lat, location.lng])
        .addTo(map)
        .bindPopup('<b>현재 위치</b>');

      updateMarkers();
    } catch (error) {
      console.error('지도 초기화 오류:', error);
    }
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.L) return;

    // 기존 마커들 제거
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // 새로운 마커들 추가
    campingSpots.forEach((spot) => {
      const isSelected = selectedSpot?.id === spot.id;
      
      // 거리 정보 계산
      let distanceText = '';
      if (currentLocation) {
        const distance = getDistanceFromCurrentLocation(
          currentLocation.lat,
          currentLocation.lng,
          spot.latitude,
          spot.longitude
        );
        distanceText = ` | 거리: ${distance}`;
      }
      
      // 마커 아이콘 설정
      const icon = window.L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background: ${isSelected ? '#e74c3c' : '#3498db'};
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">🏕️</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = window.L.marker([spot.latitude, spot.longitude], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 5px 0; font-size: 14px; color: ${isSelected ? '#e74c3c' : '#2c3e50'};">
              ${spot.name} ${isSelected ? '📍' : ''}
            </h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${spot.address}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">
              <span style="color: ${spot.price.type === 'free' ? '#27ae60' : '#e74c3c'};">
                ${spot.price.type === 'free' ? '무료' : '유료'}
              </span>
              ${spot.reservation.available ? ' | 예약 가능' : ' | 예약 불가'}
            </p>
            ${distanceText ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #3498db; font-weight: bold;">${distanceText}</p>` : ''}
          </div>
        `);

      // 마커 클릭 이벤트
      marker.on('click', () => {
        onSpotSelect(spot);
      });

      markersRef.current.push(marker);
    });

    // 선택된 캠핑장이 있으면 현재 위치와 함께 자동 스케일 적용
    if (selectedSpot && currentLocation) {
      const bounds = calculateMapBounds(
        currentLocation.lat,
        currentLocation.lng,
        selectedSpot.latitude,
        selectedSpot.longitude
      );
      
      // 두 지점을 모두 포함하는 영역으로 지도 이동
      mapInstanceRef.current.setView(bounds.center, bounds.zoom);
      
      // 거리 정보 업데이트
      const distance = getDistanceFromCurrentLocation(
        currentLocation.lat,
        currentLocation.lng,
        selectedSpot.latitude,
        selectedSpot.longitude
      );
      setDistanceInfo(`현재 위치에서 ${distance} 거리에 있습니다`);
      
      // 경로 그리기 (현재 위치 → 선택된 캠핑장)
      drawRoute(
        currentLocation.lat,
        currentLocation.lng,
        selectedSpot.latitude,
        selectedSpot.longitude
      );
      
      // 선택된 마커의 팝업 열기
      const selectedMarker = markersRef.current.find(marker => {
        const latlng = marker.getLatLng();
        return latlng.lat === selectedSpot.latitude && latlng.lng === selectedSpot.longitude;
      });
      
      if (selectedMarker) {
        selectedMarker.openPopup();
      }
    } else if (selectedSpot) {
      // 현재 위치가 없는 경우 선택된 캠핑장만 중앙에 표시
      const position = [selectedSpot.latitude, selectedSpot.longitude];
      mapInstanceRef.current.setView(position, 6);
      setDistanceInfo('');
      
      // 경로 제거
      clearRoute();
      
      // 선택된 마커의 팝업 열기
      const selectedMarker = markersRef.current.find(marker => {
        const latlng = marker.getLatLng();
        return latlng.lat === selectedSpot.latitude && latlng.lng === selectedSpot.longitude;
      });
      
      if (selectedMarker) {
        selectedMarker.openPopup();
      }
    } else {
      setDistanceInfo('');
      // 선택된 캠핑장이 없으면 경로 제거
      clearRoute();
    }
  };

  // 경로 그리기 함수
  const drawRoute = (startLat: number, startLng: number, endLat: number, endLng: number) => {
    if (!mapInstanceRef.current || !window.L) return;

    // 기존 경로 라인 제거
    if (routeLineRef.current) {
      mapInstanceRef.current.removeLayer(routeLineRef.current);
    }

    // 새로운 경로 라인 생성 (빨간색 굵은 선)
    const routeLine = window.L.polyline(
      [[startLat, startLng], [endLat, endLng]],
      {
        color: 'red',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5' // 점선 효과
      }
    ).addTo(mapInstanceRef.current);

    routeLineRef.current = routeLine;
    console.log('경로 그리기 완료:', { startLat, startLng, endLat, endLng });
  };

  // 경로 제거 함수
  const clearRoute = () => {
    if (routeLineRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
      console.log('경로 제거 완료');
    }
  };

  const moveToCurrentLocation = () => {
    if (mapInstanceRef.current && currentLocation) {
      mapInstanceRef.current.setView([currentLocation.lat, currentLocation.lng], 8);
    }
  };

  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      updateMarkers();
    }
  }, [campingSpots, selectedSpot, mapLoaded]);

  return (
    <MapContainer>
      <MapElement ref={mapRef} />
      <LocationButton onClick={moveToCurrentLocation}>
        📍 현재 위치
      </LocationButton>
      {routeLineRef.current && (
        <RouteButton onClick={clearRoute}>
          🗑️ 경로 제거
        </RouteButton>
      )}
      {distanceInfo && (
        <DistanceInfo>
          📏 {distanceInfo}
        </DistanceInfo>
      )}
      <MapInfo>
        OpenStreetMap 사용
      </MapInfo>
      {!mapLoaded && (
        <MapPlaceholder>
          <div>
            <p>지도를 불러오는 중...</p>
            <p style={{ fontSize: '12px', marginTop: '10px' }}>
              OpenStreetMap을 사용합니다.
            </p>
          </div>
        </MapPlaceholder>
      )}
    </MapContainer>
  );
};

// Leaflet 타입 선언
declare global {
  interface Window {
    L: any;
  }
}

export default Map; 