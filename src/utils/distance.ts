// 두 지점 간의 거리를 계산하는 함수 (Haversine 공식 사용)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // km 단위
  return distance;
}

// 거리를 포맷팅하는 함수
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  } else {
    return `${Math.round(distance)}km`;
  }
}

// 현재 위치와 캠핑장 간의 거리를 계산하고 포맷팅하는 함수
export function getDistanceFromCurrentLocation(
  currentLat: number,
  currentLon: number,
  campingLat: number,
  campingLon: number
): string {
  const distance = calculateDistance(currentLat, currentLon, campingLat, campingLon);
  return formatDistance(distance);
}

// 현재 위치와 캠핑장 간의 거리를 숫자로 반환하는 함수 (정렬용)
export function getDistanceFromCurrentLocationNumber(
  currentLat: number,
  currentLon: number,
  campingLat: number,
  campingLon: number
): number {
  return calculateDistance(currentLat, currentLon, campingLat, campingLon);
}

// 두 지점을 모두 포함하는 지도의 중심점과 줌 레벨을 계산하는 함수
export function calculateMapBounds(
  currentLat: number,
  currentLon: number,
  campingLat: number,
  campingLon: number
): { center: [number, number]; zoom: number } {
  // 두 지점의 중간점을 중심으로 설정
  const centerLat = (currentLat + campingLat) / 2;
  const centerLon = (currentLon + campingLon) / 2;
  
  // 두 지점 간의 거리 계산
  const distance = calculateDistance(currentLat, currentLon, campingLat, campingLon);
  
  // 거리에 따른 줌 레벨 계산
  let zoom = 15; // 기본 줌 레벨
  
  if (distance > 100) {
    zoom = 8; // 100km 이상
  } else if (distance > 50) {
    zoom = 9; // 50-100km
  } else if (distance > 20) {
    zoom = 10; // 20-50km
  } else if (distance > 10) {
    zoom = 11; // 10-20km
  } else if (distance > 5) {
    zoom = 12; // 5-10km
  } else if (distance > 2) {
    zoom = 13; // 2-5km
  } else if (distance > 1) {
    zoom = 14; // 1-2km
  } else {
    zoom = 15; // 1km 미만
  }
  
  return {
    center: [centerLat, centerLon],
    zoom
  };
} 