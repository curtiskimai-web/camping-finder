# 🏕️ Camping Finder - 컴포넌트 설계 문서

## 📋 개요

이 문서는 Camping Finder 프로젝트의 React 컴포넌트 구조와 설계 방침을 정의합니다.

---

## 🏗️ 컴포넌트 아키텍처

### 전체 구조
```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Header.tsx      # 헤더 컴포넌트
│   ├── SearchFilter.tsx # 검색 필터 컴포넌트
│   ├── CampingList.tsx # 캠핑장 리스트 컴포넌트
│   ├── CampingCard.tsx # 캠핑장 카드 컴포넌트
│   └── Map.tsx         # 지도 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx    # 홈페이지
│   └── DetailPage.tsx  # 상세페이지
└── App.tsx             # 메인 앱 컴포넌트
```

---

## 🧩 컴포넌트 상세 설계

### 1. App.tsx (메인 앱 컴포넌트)

**역할**: 전체 앱의 라우팅과 레이아웃 관리

**Props**: 없음

**State**: 없음

**주요 기능**:
- React Router 설정
- 전역 레이아웃 구성
- 헤더 포함

**스타일링**:
```typescript
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  padding-top: 60px;
`;
```

**사용 예시**:
```typescript
function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/camping/:id" element={<DetailPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}
```

---

### 2. Header.tsx (헤더 컴포넌트)

**역할**: 네비게이션 헤더

**Props**: 없음

**State**: 없음

**주요 기능**:
- 로고 표시
- 네비게이션 메뉴
- 반응형 디자인

**스타일링**:
```typescript
const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
`;
```

**네비게이션 메뉴**:
- 홈
- 검색
- 즐겨찾기

---

### 3. SearchFilter.tsx (검색 필터 컴포넌트)

**역할**: 캠핑장 검색 필터

**Props**:
```typescript
interface SearchFilterProps {
  onSearch: (filter: SearchFilter) => void;
}
```

**State**:
```typescript
const [filter, setFilter] = useState<SearchFilter>({
  region: { province: '', city: '' },
  facilities: [],
  priceRange: 'all',
  reservationAvailable: false,
  keyword: ''
});
```

**주요 기능**:
- 지역별 검색 (시/도, 시/군/구)
- 키워드 검색
- 가격대 필터 (전체/무료/유료)
- 예약 가능 여부 필터
- 검색 및 초기화 버튼

**지역 데이터**:
```typescript
const provinces = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', 
  '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
  '경기도', '강원도', '충청북도', '충청남도', 
  '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
];
```

**이벤트 핸들러**:
- `handleProvinceChange`: 시/도 변경
- `handleCityChange`: 시/군/구 변경
- `handleSearch`: 검색 실행
- `handleReset`: 필터 초기화

---

### 4. CampingList.tsx (캠핑장 리스트 컴포넌트)

**역할**: 캠핑장 목록 표시

**Props**:
```typescript
interface CampingListProps {
  campingSpots: CampingSpot[];
  onSpotSelect: (spot: CampingSpot) => void;
  selectedSpot: CampingSpot | null;
}
```

**State**: 없음

**주요 기능**:
- 캠핑장 목록 렌더링
- 선택된 캠핑장 하이라이트
- 빈 목록 상태 처리
- 결과 개수 표시

**조건부 렌더링**:
```typescript
if (campingSpots.length === 0) {
  return <EmptyMessage>검색 조건에 맞는 캠핑장이 없습니다.</EmptyMessage>;
}
```

---

### 5. CampingCard.tsx (캠핑장 카드 컴포넌트)

**역할**: 개별 캠핑장 정보 카드

**Props**:
```typescript
interface CampingCardProps {
  campingSpot: CampingSpot;
  isSelected: boolean;
  onClick: () => void;
}
```

**State**: 없음

**주요 기능**:
- 캠핑장 기본 정보 표시
- 시설 아이콘 표시
- 가격 정보 표시
- 예약 상태 표시
- 선택 상태 시각적 피드백

**시설 아이콘 매핑**:
```typescript
const facilityIcons: { [key: string]: string } = {
  electricity: '⚡',
  hotWater: '🔥',
  shower: '🚿',
  toilet: '🚽',
  parking: '🅿️',
  store: '🏪',
  pool: '🏊',
  playground: '🎠'
};
```

**스타일링**:
```typescript
const Card = styled.div<{ isSelected: boolean }>`
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.isSelected ? '#3498db' : 'transparent'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;
```

---

### 6. Map.tsx (지도 컴포넌트)

**역할**: 카카오맵을 통한 캠핑장 위치 표시

**Props**:
```typescript
interface MapProps {
  campingSpots: CampingSpot[];
  selectedSpot: CampingSpot | null;
  onSpotSelect: (spot: CampingSpot) => void;
}
```

**State**: 없음

**Refs**:
```typescript
const mapRef = useRef<HTMLDivElement>(null);
const mapInstanceRef = useRef<any>(null);
const markersRef = useRef<any[]>([]);
```

**주요 기능**:
- 카카오맵 API 로드
- 캠핑장 마커 표시
- 마커 클릭 이벤트
- 인포윈도우 표시
- 선택된 캠핑장으로 지도 이동

**카카오맵 초기화**:
```typescript
const initMap = () => {
  const options = {
    center: new window.kakao.maps.LatLng(36.5, 127.5), // 한국 중심
    level: 8
  };
  mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);
};
```

**마커 업데이트**:
```typescript
const updateMarkers = () => {
  // 기존 마커 제거
  markersRef.current.forEach(marker => marker.setMap(null));
  
  // 새 마커 추가
  campingSpots.forEach(spot => {
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(spot.latitude, spot.longitude),
      map: mapInstanceRef.current
    });
    
    // 클릭 이벤트
    window.kakao.maps.event.addListener(marker, 'click', () => {
      onSpotSelect(spot);
    });
  });
};
```

---

### 7. HomePage.tsx (홈페이지)

**역할**: 메인 페이지 (검색 + 리스트 + 지도)

**Props**: 없음

**State**:
```typescript
const [campingSpots, setCampingSpots] = useState<CampingSpot[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [selectedSpot, setSelectedSpot] = useState<CampingSpot | null>(null);
```

**주요 기능**:
- 캠핑장 데이터 로드
- 검색 필터 처리
- 로딩/에러 상태 관리
- 좌측 패널 (검색 + 리스트)
- 우측 패널 (지도)

**레이아웃**:
```typescript
const HomeContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px);
`;

const LeftPanel = styled.div`
  width: 50%;
  padding: 20px;
  overflow-y: auto;
`;

const RightPanel = styled.div`
  width: 50%;
  position: relative;
`;
```

**이벤트 핸들러**:
- `loadCampingSpots`: 초기 데이터 로드
- `handleSpotSelect`: 캠핑장 선택
- `handleSearch`: 검색 실행

---

### 8. DetailPage.tsx (상세페이지)

**역할**: 캠핑장 상세 정보 표시

**Props**: 없음

**State**:
```typescript
const [campingSpot, setCampingSpot] = useState<CampingSpot | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**주요 기능**:
- URL 파라미터에서 캠핑장 ID 추출
- 상세 정보 API 호출
- 상세 정보 표시
- 뒤로가기 기능
- 예약 링크 제공

**라우팅 파라미터**:
```typescript
const { id } = useParams<{ id: string }>();
```

**데이터 로드**:
```typescript
const loadCampingSpotDetail = async (spotId: string) => {
  try {
    setLoading(true);
    const spot = await campingApiService.getCampingSpotDetail(spotId);
    setCampingSpot(spot);
  } catch (err) {
    setError('캠핑장 정보를 불러오는데 실패했습니다.');
  } finally {
    setLoading(false);
  }
};
```

---

## 🎨 스타일링 가이드

### 1. Styled Components 사용

**기본 원칙**:
- 컴포넌트별로 스타일 정의
- Props를 통한 동적 스타일링
- 일관된 색상 팔레트 사용

**색상 팔레트**:
```typescript
// 주요 색상
const colors = {
  primary: '#3498db',      // 파란색 (버튼, 링크)
  secondary: '#2c3e50',    // 진한 파란색 (헤더)
  success: '#27ae60',      // 초록색 (성공, 무료)
  danger: '#e74c3c',       // 빨간색 (에러, 유료)
  warning: '#f39c12',      // 주황색 (경고)
  info: '#95a5a6',         // 회색 (정보)
  light: '#ecf0f1',        // 연한 회색 (배경)
  dark: '#2c3e50',         // 진한 회색 (텍스트)
  white: '#ffffff',        // 흰색
  black: '#000000'         // 검은색
};
```

### 2. 반응형 디자인

**브레이크포인트**:
```typescript
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1200px'
};
```

**미디어 쿼리 예시**:
```typescript
const ResponsiveContainer = styled.div`
  padding: 20px;
  
  @media (max-width: ${breakpoints.tablet}) {
    padding: 10px;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 5px;
  }
`;
```

### 3. 애니메이션

**기본 트랜지션**:
```typescript
const AnimatedCard = styled.div`
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;
```

---

## 🔄 상태 관리

### 1. 로컬 상태 (useState)

**사용 사례**:
- 폼 입력값
- UI 상태 (로딩, 에러)
- 선택된 아이템

**예시**:
```typescript
const [filter, setFilter] = useState<SearchFilter>({
  region: { province: '', city: '' },
  facilities: [],
  priceRange: 'all',
  reservationAvailable: false,
  keyword: ''
});
```

### 2. 부모-자식 통신

**Props를 통한 데이터 전달**:
```typescript
// 부모 컴포넌트
<CampingList 
  campingSpots={campingSpots} 
  onSpotSelect={handleSpotSelect}
  selectedSpot={selectedSpot}
/>

// 자식 컴포넌트
interface CampingListProps {
  campingSpots: CampingSpot[];
  onSpotSelect: (spot: CampingSpot) => void;
  selectedSpot: CampingSpot | null;
}
```

### 3. 이벤트 핸들링

**콜백 함수 패턴**:
```typescript
const handleSearch = (filter: SearchFilter) => {
  // 검색 로직
  setCampingSpots(filteredSpots);
};

<SearchFilter onSearch={handleSearch} />
```

---

## 🧪 테스트 전략

### 1. 단위 테스트

**테스트 대상**:
- 유틸리티 함수
- 데이터 변환 함수
- 컴포넌트 렌더링

**테스트 도구**:
- Jest
- React Testing Library

### 2. 통합 테스트

**테스트 대상**:
- 컴포넌트 간 상호작용
- API 호출
- 사용자 플로우

### 3. E2E 테스트

**테스트 대상**:
- 전체 사용자 시나리오
- 검색 → 선택 → 상세보기 플로우

---

## 📱 반응형 디자인

### 1. 모바일 최적화

**레이아웃 변경**:
```typescript
const MobileLayout = styled.div`
  @media (max-width: 768px) {
    flex-direction: column;
    
    .left-panel {
      width: 100%;
      height: 50%;
    }
    
    .right-panel {
      width: 100%;
      height: 50%;
    }
  }
`;
```

### 2. 터치 인터페이스

**터치 친화적 디자인**:
- 충분한 터치 영역 (최소 44px)
- 스와이프 제스처 지원
- 터치 피드백 제공

---

## ♿ 접근성 (Accessibility)

### 1. ARIA 라벨

**예시**:
```typescript
<button 
  aria-label="캠핑장 검색"
  onClick={handleSearch}
>
  검색
</button>
```

### 2. 키보드 네비게이션

**포커스 관리**:
```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};
```

### 3. 스크린 리더 지원

**의미있는 HTML 구조**:
```typescript
<main role="main">
  <h1>캠핑장 검색</h1>
  <section aria-label="검색 필터">
    {/* 검색 필터 내용 */}
  </section>
</main>
```

---

*이 문서는 컴포넌트 변경사항에 따라 지속적으로 업데이트됩니다.* 