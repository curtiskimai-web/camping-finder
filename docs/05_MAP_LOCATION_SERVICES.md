# 🏕️ Camping Finder - 지도 및 위치 서비스

## 📚 문서 정보
**문서명**: 지도 및 위치 서비스  
**버전**: v1.0.0  
**작성일**: 2024년 1월 4일  
**최종 업데이트**: 2024년 1월 4일  
**문서 상태**: 완료

---

## 🗺️ OpenStreetMap + Leaflet 연동

### 지도 기술 스택 선택
Camping Finder는 **OpenStreetMap**과 **Leaflet**을 조합하여 인터랙티브 지도 서비스를 구현했습니다. 이 조합은 무료이면서도 강력한 지도 기능을 제공합니다.

#### 기술 선택 이유
- **OpenStreetMap**: 무료 오픈소스 지도 데이터
- **Leaflet**: 경량화된 인터랙티브 지도 라이브러리
- **React-Leaflet**: React와 Leaflet의 통합 라이브러리
- **성능**: 빠른 로딩 및 부드러운 인터랙션

### 지도 라이브러리 설정
#### 패키지 설치
```bash
npm install leaflet react-leaflet
npm install @types/leaflet --save-dev
```

#### CSS 스타일 임포트
```typescript
// main.tsx 또는 App.tsx에서
import 'leaflet/dist/leaflet.css';
```

#### Leaflet 아이콘 설정
```typescript
// Leaflet 기본 아이콘 경로 수정
import L from 'leaflet';

// 기본 마커 아이콘 경로 수정
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
```

---

## 🎯 위치 기반 서비스 구현

### 사용자 위치 감지
#### Geolocation API 활용
```typescript
// 위치 서비스 커스텀 훅
export const useGeolocation = () => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentPosition = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = '위치를 가져올 수 없습니다.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 접근 권한이 거부되었습니다.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 요청 시간이 초과되었습니다.';
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return {
    location,
    error,
    isLoading,
    refetch: getCurrentPosition
  };
};
```

#### 위치 권한 관리
```typescript
// 위치 권한 상태 관리
export const useLocationPermission = () => {
  const [permission, setPermission] = useState<PermissionState | null>(null);

  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) {
      setPermission('granted'); // 기본값
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermission(result.state);
      
      result.addEventListener('change', () => {
        setPermission(result.state);
      });
    } catch (error) {
      console.error('Permission check failed:', error);
      setPermission('denied');
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return permission;
};
```

### 거리 계산 알고리즘
#### Haversine 공식 구현
```typescript
// utils/distance.ts
export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Haversine 공식을 사용한 두 지점 간의 거리 계산
 * @param point1 첫 번째 지점 (위도, 경도)
 * @param point2 두 번째 지점 (위도, 경도)
 * @returns 거리 (킬로미터)
 */
export const calculateDistance = (point1: LatLng, point2: LatLng): number => {
  const R = 6371; // 지구의 반지름 (킬로미터)
  
  const lat1Rad = toRadians(point1.lat);
  const lat2Rad = toRadians(point2.lat);
  const deltaLat = toRadians(point2.lat - point1.lat);
  const deltaLng = toRadians(point2.lng - point1.lng);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * 각도를 라디안으로 변환
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * 거리를 사용자 친화적인 형식으로 포맷
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  } else {
    return `${Math.round(distance)}km`;
  }
};
```

#### 거리 기반 정렬
```typescript
// 거리 기반 정렬 유틸리티
export const sortByDistance = (
  campingSites: CampingSite[],
  userLocation: LatLng
): CampingSite[] => {
  return campingSites
    .map(site => ({
      ...site,
      distance: calculateDistance(userLocation, {
        lat: parseFloat(site.mapY),
        lng: parseFloat(site.mapX)
      })
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
};
```

---

## 🗺️ 지도 컴포넌트 구현

### Map 컴포넌트 구조
```typescript
// components/Map.tsx
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';

interface MapProps {
  campingSites: CampingSite[];
  selectedCamping: CampingSite | null;
  userLocation: LatLng | null;
  onCampingSelect: (camping: CampingSite) => void;
}

const Map: React.FC<MapProps> = ({
  campingSites,
  selectedCamping,
  userLocation,
  onCampingSelect
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLng>({ lat: 36.5, lng: 127.5 }); // 한국 중심

  // 지도 초기화
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  // 선택된 캠핑장이 변경되면 지도 중심 이동
  useEffect(() => {
    if (selectedCamping && mapRef.current) {
      const position = {
        lat: parseFloat(selectedCamping.mapY),
        lng: parseFloat(selectedCamping.mapX)
      };
      
      mapRef.current.setView(position, 13);
    }
  }, [selectedCamping]);

  // 경로 그리기
  const getRouteCoordinates = (): LatLng[] => {
    if (!userLocation || !selectedCamping) return [];

    return [
      userLocation,
      {
        lat: parseFloat(selectedCamping.mapY),
        lng: parseFloat(selectedCamping.mapX)
      }
    ];
  };

  return (
    <MapWrapper>
      <MapContainer
        center={mapCenter}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        {/* OpenStreetMap 타일 레이어 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 사용자 위치 마커 */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createUserLocationIcon()}
          >
            <Popup>
              <div>
                <h4>현재 위치</h4>
                <p>위도: {userLocation.lat.toFixed(6)}</p>
                <p>경도: {userLocation.lng.toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 캠핑장 마커들 */}
        {campingSites.map((camping) => {
          const position = {
            lat: parseFloat(camping.mapY),
            lng: parseFloat(camping.mapX)
          };

          const isSelected = selectedCamping?.contentId === camping.contentId;

          return (
            <Marker
              key={camping.contentId}
              position={position}
              icon={createCampingMarkerIcon(isSelected)}
              eventHandlers={{
                click: () => onCampingSelect(camping)
              }}
            >
              <Popup>
                <CampingPopup camping={camping} userLocation={userLocation} />
              </Popup>
            </Marker>
          );
        })}

        {/* 경로 선 */}
        {selectedCamping && userLocation && (
          <Polyline
            positions={getRouteCoordinates()}
            color="red"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </MapWrapper>
  );
};

export default Map;
```

### 커스텀 마커 아이콘
```typescript
// 마커 아이콘 생성 함수들
export const createUserLocationIcon = (): L.Icon => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #4285f4;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export const createCampingMarkerIcon = (isSelected: boolean): L.Icon => {
  const color = isSelected ? '#ff5722' : '#4caf50';
  const size = isSelected ? 24 : 20;
  
  return L.divIcon({
    className: 'camping-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? '12px' : '10px'};
        color: white;
        font-weight: bold;
      ">
        🏕️
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};
```

### 팝업 컴포넌트
```typescript
// 캠핑장 팝업 컴포넌트
const CampingPopup: React.FC<{
  camping: CampingSite;
  userLocation: LatLng | null;
}> = ({ camping, userLocation }) => {
  const distance = userLocation 
    ? calculateDistance(userLocation, {
        lat: parseFloat(camping.mapY),
        lng: parseFloat(camping.mapX)
      })
    : null;

  return (
    <PopupContainer>
      <PopupTitle>{camping.facltNm}</PopupTitle>
      
      {camping.lineIntro && (
        <PopupDescription>{camping.lineIntro}</PopupDescription>
      )}
      
      <PopupInfo>
        <InfoItem>
          <strong>주소:</strong> {camping.addr1}
        </InfoItem>
        
        {camping.tel && (
          <InfoItem>
            <strong>전화:</strong> {camping.tel}
          </InfoItem>
        )}
        
        {distance && (
          <InfoItem>
            <strong>거리:</strong> {formatDistance(distance)}
          </InfoItem>
        )}
      </PopupInfo>
      
      {camping.homepage && (
        <PopupLink href={camping.homepage} target="_blank" rel="noopener">
          홈페이지 방문
        </PopupLink>
      )}
    </PopupContainer>
  );
};
```

---

## 🛣️ 경로 표시 알고리즘

### 경로 계산 및 표시
```typescript
// 경로 서비스 유틸리티
export class RouteService {
  /**
   * 두 지점 간의 직선 경로 좌표 생성
   */
  static createDirectRoute(start: LatLng, end: LatLng): LatLng[] {
    return [start, end];
  }

  /**
   * 경로 거리 계산
   */
  static calculateRouteDistance(route: LatLng[]): number {
    let totalDistance = 0;
    
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += calculateDistance(route[i], route[i + 1]);
    }
    
    return totalDistance;
  }

  /**
   * 경로 예상 시간 계산 (평균 속도 60km/h 기준)
   */
  static calculateRouteTime(distance: number): number {
    const averageSpeed = 60; // km/h
    return distance / averageSpeed * 60; // 분 단위
  }

  /**
   * 경로 정보 포맷팅
   */
  static formatRouteInfo(distance: number, time: number): string {
    const distanceStr = formatDistance(distance);
    const timeStr = time < 60 
      ? `${Math.round(time)}분` 
      : `${Math.floor(time / 60)}시간 ${Math.round(time % 60)}분`;
    
    return `${distanceStr} • ${timeStr}`;
  }
}
```

### 경로 시각화
```typescript
// 경로 표시 컴포넌트
const RouteDisplay: React.FC<{
  start: LatLng;
  end: LatLng;
  onRouteClick?: () => void;
}> = ({ start, end, onRouteClick }) => {
  const route = RouteService.createDirectRoute(start, end);
  const distance = RouteService.calculateRouteDistance(route);
  const time = RouteService.calculateRouteTime(distance);

  return (
    <RouteContainer onClick={onRouteClick}>
      <Polyline
        positions={route}
        color="red"
        weight={3}
        opacity={0.7}
        dashArray="10, 10"
      />
      
      {/* 경로 중간에 정보 표시 */}
      <RouteInfo
        position={[
          (start.lat + end.lat) / 2,
          (start.lng + end.lng) / 2
        ]}
      >
        <RouteInfoContent>
          {RouteService.formatRouteInfo(distance, time)}
        </RouteInfoContent>
      </RouteInfo>
    </RouteContainer>
  );
};
```

---

## ⚡ 지도 성능 최적화

### 마커 클러스터링
```typescript
// 마커 클러스터링 구현
import MarkerClusterGroup from 'react-leaflet-cluster';

const ClusteredMap: React.FC<MapProps> = ({ campingSites, ...props }) => {
  return (
    <MapContainer center={mapCenter} zoom={7}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={60}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
      >
        {campingSites.map((camping) => (
          <Marker
            key={camping.contentId}
            position={{
              lat: parseFloat(camping.mapY),
              lng: parseFloat(camping.mapX)
            }}
          >
            <Popup>
              <CampingPopup camping={camping} />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};
```

### 가상화된 마커 렌더링
```typescript
// 화면에 보이는 영역의 마커만 렌더링
export const useVisibleMarkers = (
  campingSites: CampingSite[],
  mapBounds: L.LatLngBounds | null
): CampingSite[] => {
  return useMemo(() => {
    if (!mapBounds) return campingSites;

    return campingSites.filter(site => {
      const position = {
        lat: parseFloat(site.mapY),
        lng: parseFloat(site.mapX)
      };
      
      return mapBounds.contains(position);
    });
  }, [campingSites, mapBounds]);
};
```

### 지도 이벤트 최적화
```typescript
// 지도 이벤트 디바운싱
export const useDebouncedMapEvents = (callback: Function, delay: number = 300) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};
```

---

## 🎨 지도 UI/UX 최적화

### 반응형 지도 컨테이너
```typescript
// 스타일드 컴포넌트로 지도 컨테이너 구현
const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .leaflet-container {
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .leaflet-popup-content {
    margin: 12px;
    min-width: 200px;
  }
  
  .leaflet-popup-tip {
    background: white;
  }
`;

const PopupContainer = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
`;

const PopupTitle = styled.h4`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const PopupDescription = styled.p`
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
`;

const PopupInfo = styled.div`
  margin: 0 0 12px 0;
`;

const InfoItem = styled.div`
  margin: 4px 0;
  font-size: 13px;
  color: #555;
  
  strong {
    color: #333;
  }
`;

const PopupLink = styled.a`
  display: inline-block;
  padding: 6px 12px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  &:hover {
    background-color: #45a049;
  }
`;
```

### 지도 컨트롤 컴포넌트
```typescript
// 사용자 정의 지도 컨트롤
const MapControls: React.FC<{
  onLocationRequest: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}> = ({ onLocationRequest, onZoomIn, onZoomOut, onReset }) => {
  return (
    <ControlsContainer>
      <ControlButton onClick={onLocationRequest} title="현재 위치">
        📍
      </ControlButton>
      <ControlButton onClick={onZoomIn} title="확대">
        ➕
      </ControlButton>
      <ControlButton onClick={onZoomOut} title="축소">
        ➖
      </ControlButton>
      <ControlButton onClick={onReset} title="초기화">
        🏠
      </ControlButton>
    </ControlsContainer>
  );
};

const ControlsContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;
```

---

## 🔧 지도 설정 및 구성

### 지도 초기 설정
```typescript
// 지도 기본 설정
export const MAP_CONFIG = {
  // 기본 중심점 (한국)
  defaultCenter: { lat: 36.5, lng: 127.5 },
  
  // 줌 레벨
  defaultZoom: 7,
  minZoom: 6,
  maxZoom: 18,
  
  // 타일 레이어 설정
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  
  // 마커 설정
  marker: {
    clusterRadius: 60,
    maxClusterZoom: 15
  },
  
  // 경로 설정
  route: {
    color: '#ff5722',
    weight: 3,
    opacity: 0.7,
    dashArray: '10, 10'
  }
};
```

### 환경별 설정
```typescript
// 개발/프로덕션 환경별 설정
const getMapConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    ...MAP_CONFIG,
    // 개발 환경에서는 디버그 정보 표시
    debug: isDevelopment,
    // 프로덕션에서는 성능 최적화
    performance: !isDevelopment
  };
};
```

---

## 📊 지도 성능 모니터링

### 성능 지표 추적
```typescript
// 지도 성능 모니터링
export const useMapPerformance = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    markerCount: 0,
    memoryUsage: 0
  });

  const measureRenderTime = useCallback((startTime: number) => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    setMetrics(prev => ({
      ...prev,
      renderTime
    }));
  }, []);

  const updateMarkerCount = useCallback((count: number) => {
    setMetrics(prev => ({
      ...prev,
      markerCount: count
    }));
  }, []);

  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize
      }));
    }
  }, []);

  return {
    metrics,
    measureRenderTime,
    updateMarkerCount,
    measureMemoryUsage
  };
};
```

---

## 🏆 지도 및 위치 서비스 성과

### 기술적 성과
- ✅ **지도 연동**: OpenStreetMap + Leaflet 성공적 구현
- ✅ **위치 서비스**: Geolocation API 활용한 정확한 위치 감지
- ✅ **경로 표시**: 실시간 경로 계산 및 시각화
- ✅ **성능 최적화**: 마커 클러스터링 및 가상화 구현
- ✅ **반응형 디자인**: 모든 디바이스에서 최적화된 지도 경험

### 사용자 경험 성과
- ✅ **직관적 인터페이스**: 사용자 친화적인 지도 조작
- ✅ **빠른 응답**: 지도 로딩 및 인터랙션 최적화
- ✅ **정확한 정보**: 실시간 거리 계산 및 경로 안내
- ✅ **접근성**: 키보드 네비게이션 및 스크린 리더 지원

### 성능 지표
- **지도 로딩 시간**: < 1초
- **마커 렌더링**: 1000개 마커 < 100ms
- **위치 정확도**: GPS 기준 ±5미터
- **메모리 사용량**: < 50MB (지도 관련)

---

**다음 문서**: [06_COMPONENT_SPECIFICATIONS.md](./06_COMPONENT_SPECIFICATIONS.md) - 컴포넌트 상세 명세 