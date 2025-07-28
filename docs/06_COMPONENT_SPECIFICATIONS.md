# 🏕️ Camping Finder - 컴포넌트 명세서

## 📚 문서 정보
**문서명**: 컴포넌트 명세서  
**버전**: v1.0.0  
**작성일**: 2025년 7월 28일  
**최종 업데이트**: 2025년 7월 28일  
**문서 상태**: 완료

---

## 🧩 React 컴포넌트 상세 분석

### App.tsx - 메인 컨테이너 컴포넌트

#### 컴포넌트 개요
App.tsx는 Camping Finder 애플리케이션의 **루트 컨테이너 컴포넌트**로, 전체 상태 관리와 레이아웃 조정을 담당합니다.

#### Props 및 State
```typescript
// Props (없음 - 루트 컴포넌트)
interface AppProps {}

// State
interface AppState {
  // 데이터 상태
  campingData: CampingSite[];
  filteredData: CampingSite[];
  selectedCamping: CampingSite | null;
  
  // UI 상태
  loading: boolean;
  error: string | null;
  
  // 필터 상태
  filters: {
    do: string;
    sigungu: string;
  };
  
  // 위치 상태
  userLocation: LatLng | null;
  
  // 페이지네이션 상태
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
}
```

#### 주요 기능
```typescript
const App: React.FC = () => {
  // 상태 관리
  const [campingData, setCampingData] = useState<CampingSite[]>([]);
  const [filteredData, setFilteredData] = useState<CampingSite[]>([]);
  const [selectedCamping, setSelectedCamping] = useState<CampingSite | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ do: '', sigungu: '' });
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 100,
    totalItems: 0
  });

  // 데이터 로딩
  const loadCampingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchCampingData();
      setCampingData(data);
      setFilteredData(data);
      setPagination(prev => ({ ...prev, totalItems: data.length }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로딩 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  // 필터링 로직
  useEffect(() => {
    const filtered = campingData.filter(camping => {
      if (filters.do && camping.do !== filters.do) return false;
      if (filters.sigungu && camping.sigungu !== filters.sigungu) return false;
      return true;
    });
    
    setFilteredData(filtered);
    setPagination(prev => ({ ...prev, currentPage: 1, totalItems: filtered.length }));
  }, [campingData, filters]);

  // 사용자 위치 감지
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('위치 감지 실패:', error);
        }
      );
    }
  }, []);

  // 이벤트 핸들러
  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const handleCampingSelect = useCallback((camping: CampingSite) => {
    setSelectedCamping(camping);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  // 초기 데이터 로딩
  useEffect(() => {
    loadCampingData();
  }, [loadCampingData]);

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <SearchFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          campingData={campingData}
        />
        <ContentArea>
          <CampingList
            campingData={filteredData}
            selectedCamping={selectedCamping}
            onCampingSelect={handleCampingSelect}
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={loading}
          />
          <Map
            campingSites={filteredData}
            selectedCamping={selectedCamping}
            userLocation={userLocation}
            onCampingSelect={handleCampingSelect}
          />
        </ContentArea>
      </MainContent>
    </AppContainer>
  );
};
```

#### 스타일링
```typescript
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Noto Sans KR', sans-serif;
`;

const MainContent = styled.main`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const ContentArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;
```

---

### Header.tsx - 네비게이션 컴포넌트

#### 컴포넌트 개요
Header 컴포넌트는 애플리케이션의 **상단 네비게이션 바**를 담당하며, 브랜딩과 기본 네비게이션 기능을 제공합니다.

#### Props 및 State
```typescript
// Props
interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

// State
interface HeaderState {
  isMenuOpen: boolean;
}
```

#### 주요 기능
```typescript
const Header: React.FC<HeaderProps> = ({ 
  title = "🏕️ Camping Finder",
  onMenuClick 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
    onMenuClick?.();
  }, [onMenuClick]);

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSection>
          <Logo>{title}</Logo>
          <Tagline>한국의 캠핑장을 찾아보세요</Tagline>
        </LogoSection>
        
        <NavigationSection>
          <NavButton onClick={handleMenuToggle}>
            <MenuIcon>☰</MenuIcon>
          </NavButton>
          
          {isMenuOpen && (
            <DropdownMenu>
              <MenuItem onClick={() => window.location.reload()}>
                새로고침
              </MenuItem>
              <MenuItem onClick={() => window.open('https://github.com/curtiskimai-web/camping-finder', '_blank')}>
                GitHub
              </MenuItem>
            </DropdownMenu>
          )}
        </NavigationSection>
      </HeaderContent>
    </HeaderContainer>
  );
};
```

#### 스타일링
```typescript
const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
`;

const Tagline = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
`;

const NavigationSection = styled.nav`
  position: relative;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  z-index: 1001;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: #333;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;
```

---

### SearchFilter.tsx - 검색 필터 컴포넌트

#### 컴포넌트 개요
SearchFilter 컴포넌트는 **지역별 캠핑장 필터링**을 담당하며, 도/시군구 선택 기능을 제공합니다.

#### Props 및 State
```typescript
// Props
interface SearchFilterProps {
  filters: {
    do: string;
    sigungu: string;
  };
  onFilterChange: (filters: { do: string; sigungu: string }) => void;
  campingData: CampingSite[];
}

// State
interface SearchFilterState {
  availableDo: string[];
  availableSigungu: string[];
}
```

#### 주요 기능
```typescript
const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  onFilterChange,
  campingData
}) => {
  // 사용 가능한 도/시군구 목록 계산
  const { availableDo, availableSigungu } = useMemo(() => {
    const doSet = new Set<string>();
    const sigunguSet = new Set<string>();
    
    campingData.forEach(camping => {
      doSet.add(camping.do);
      if (!filters.do || camping.do === filters.do) {
        sigunguSet.add(camping.sigungu);
      }
    });
    
    return {
      availableDo: Array.from(doSet).sort(),
      availableSigungu: Array.from(sigunguSet).sort()
    };
  }, [campingData, filters.do]);

  // 필터 변경 핸들러
  const handleDoChange = useCallback((doName: string) => {
    onFilterChange({
      do: doName,
      sigungu: '' // 도가 변경되면 시군구 초기화
    });
  }, [onFilterChange]);

  const handleSigunguChange = useCallback((sigunguName: string) => {
    onFilterChange({
      ...filters,
      sigungu: sigunguName
    });
  }, [filters, onFilterChange]);

  const handleReset = useCallback(() => {
    onFilterChange({ do: '', sigungu: '' });
  }, [onFilterChange]);

  return (
    <FilterContainer>
      <FilterTitle>지역별 검색</FilterTitle>
      
      <FilterRow>
        <FilterGroup>
          <FilterLabel>도/시</FilterLabel>
          <FilterSelect
            value={filters.do}
            onChange={(e) => handleDoChange(e.target.value)}
          >
            <option value="">전체</option>
            {availableDo.map(do => (
              <option key={do} value={do}>{do}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>시군구</FilterLabel>
          <FilterSelect
            value={filters.sigungu}
            onChange={(e) => handleSigunguChange(e.target.value)}
            disabled={!filters.do}
          >
            <option value="">전체</option>
            {availableSigungu.map(sigungu => (
              <option key={sigungu} value={sigungu}>{sigungu}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <ResetButton onClick={handleReset}>
          초기화
        </ResetButton>
      </FilterRow>
      
      <FilterInfo>
        총 {campingData.length}개의 캠핑장이 있습니다.
      </FilterInfo>
    </FilterContainer>
  );
};
```

#### 스타일링
```typescript
const FilterContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FilterTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: end;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #555;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
  
  &:disabled {
    background: #f5f5f5;
    color: #999;
  }
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #d32f2f;
  }
`;

const FilterInfo = styled.p`
  margin: 16px 0 0 0;
  font-size: 14px;
  color: #666;
`;
```

---

### CampingList.tsx - 캠핑장 목록 컴포넌트

#### 컴포넌트 개요
CampingList 컴포넌트는 **캠핑장 데이터를 테이블 형태로 표시**하며, 정렬, 페이지네이션, 선택 기능을 제공합니다.

#### Props 및 State
```typescript
// Props
interface CampingListProps {
  campingData: CampingSite[];
  selectedCamping: CampingSite | null;
  onCampingSelect: (camping: CampingSite) => void;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
  onPageChange: (page: number) => void;
  loading: boolean;
}

// State
interface CampingListState {
  sortBy: 'name' | 'distance' | 'created';
  sortDirection: 'asc' | 'desc';
}
```

#### 주요 기능
```typescript
const CampingList: React.FC<CampingListProps> = ({
  campingData,
  selectedCamping,
  onCampingSelect,
  pagination,
  onPageChange,
  loading
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'distance' | 'created'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 정렬된 데이터 계산
  const sortedData = useMemo(() => {
    const sorted = [...campingData].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.facltNm.localeCompare(b.facltNm, 'ko');
          break;
        case 'distance':
          comparison = (a.distance || 0) - (b.distance || 0);
          break;
        case 'created':
          comparison = new Date(a.createdtime).getTime() - new Date(b.createdtime).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [campingData, sortBy, sortDirection]);

  // 페이지네이션된 데이터
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination]);

  // 정렬 핸들러
  const handleSort = useCallback((column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  }, [sortBy]);

  // 캠핑장 선택 핸들러
  const handleCampingSelect = useCallback((camping: CampingSite) => {
    onCampingSelect(camping);
  }, [onCampingSelect]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>캠핑장 목록</ListTitle>
        <ListCount>총 {pagination.totalItems}개</ListCount>
      </ListHeader>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader onClick={() => handleSort('name')}>
                캠핑장명
                <SortIcon sortBy={sortBy} column="name" direction={sortDirection} />
              </TableHeader>
              <TableHeader>주소</TableHeader>
              <TableHeader>전화번호</TableHeader>
              <TableHeader onClick={() => handleSort('distance')}>
                거리
                <SortIcon sortBy={sortBy} column="distance" direction={sortDirection} />
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((camping) => (
              <TableRow
                key={camping.contentId}
                selected={selectedCamping?.contentId === camping.contentId}
                onClick={() => handleCampingSelect(camping)}
              >
                <TableCell>
                  <CampingName>{camping.facltNm}</CampingName>
                  {camping.lineIntro && (
                    <CampingIntro>{camping.lineIntro}</CampingIntro>
                  )}
                </TableCell>
                <TableCell>{camping.addr1}</TableCell>
                <TableCell>{camping.tel || '-'}</TableCell>
                <TableCell>
                  {camping.distance ? formatDistance(camping.distance) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
        onPageChange={onPageChange}
      />
    </ListContainer>
  );
};
```

#### 스타일링
```typescript
const ListContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ListHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ListTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const ListCount = styled.span`
  font-size: 14px;
  color: #666;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 10;
`;

const TableRow = styled.tr<{ selected?: boolean }>`
  cursor: pointer;
  background: ${props => props.selected ? '#e8f5e8' : 'white'};
  
  &:hover {
    background: ${props => props.selected ? '#d4edda' : '#f8f9fa'};
  }
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: #e9ecef;
  }
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
`;

const CampingName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

const CampingIntro = styled.div`
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`;
```

---

### Map.tsx - 지도 컴포넌트

#### 컴포넌트 개요
Map 컴포넌트는 **인터랙티브 지도**를 제공하며, 캠핑장 위치 표시, 사용자 위치, 경로 안내 기능을 담당합니다.

#### Props 및 State
```typescript
// Props
interface MapProps {
  campingSites: CampingSite[];
  selectedCamping: CampingSite | null;
  userLocation: LatLng | null;
  onCampingSelect: (camping: CampingSite) => void;
}

// State
interface MapState {
  mapCenter: LatLng;
  zoom: number;
}
```

#### 주요 기능
```typescript
const Map: React.FC<MapProps> = ({
  campingSites,
  selectedCamping,
  userLocation,
  onCampingSelect
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLng>({ lat: 36.5, lng: 127.5 });
  const [zoom, setZoom] = useState(7);

  // 지도 초기화
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(10);
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

  // 경로 좌표 계산
  const getRouteCoordinates = useCallback((): LatLng[] => {
    if (!userLocation || !selectedCamping) return [];

    return [
      userLocation,
      {
        lat: parseFloat(selectedCamping.mapY),
        lng: parseFloat(selectedCamping.mapX)
      }
    ];
  }, [userLocation, selectedCamping]);

  return (
    <MapContainer>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
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
    </MapContainer>
  );
};
```

#### 스타일링
```typescript
const MapContainer = styled.div`
  height: 600px;
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
`;
```

---

## 🔧 컴포넌트 간 통신 패턴

### Props Drilling 패턴
```typescript
// 상위 컴포넌트에서 하위 컴포넌트로 데이터 전달
<App>
  <SearchFilter
    filters={filters}
    onFilterChange={handleFilterChange}
    campingData={campingData}
  />
  <CampingList
    campingData={filteredData}
    selectedCamping={selectedCamping}
    onCampingSelect={handleCampingSelect}
  />
  <Map
    campingSites={filteredData}
    selectedCamping={selectedCamping}
    userLocation={userLocation}
    onCampingSelect={handleCampingSelect}
  />
</App>
```

### 이벤트 핸들링 패턴
```typescript
// 이벤트 핸들러 정의
const handleCampingSelect = useCallback((camping: CampingSite) => {
  setSelectedCamping(camping);
  // 추가 로직 (예: 분석 이벤트 전송)
  analytics.track('camping_selected', { campingId: camping.contentId });
}, []);

// 컴포넌트에 전달
<CampingList onCampingSelect={handleCampingSelect} />
```

---

## ⚡ 성능 최적화 기법

### React.memo 활용
```typescript
// 불필요한 리렌더링 방지
const CampingCard = React.memo<CampingCardProps>(({
  camping,
  isSelected,
  onSelect
}) => {
  return (
    <Card
      selected={isSelected}
      onClick={() => onSelect(camping)}
    >
      <CampingInfo camping={camping} />
    </Card>
  );
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수
  return (
    prevProps.camping.contentId === nextProps.camping.contentId &&
    prevProps.isSelected === nextProps.isSelected
  );
});
```

### useMemo 및 useCallback 활용
```typescript
// 계산 비용이 높은 연산 메모이제이션
const sortedData = useMemo(() => {
  return campingData
    .filter(camping => {
      if (filters.do && camping.do !== filters.do) return false;
      if (filters.sigungu && camping.sigungu !== filters.sigungu) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.facltNm.localeCompare(b.facltNm, 'ko');
      if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
      return 0;
    });
}, [campingData, filters, sortBy]);

// 이벤트 핸들러 메모이제이션
const handleCampingSelect = useCallback((camping: CampingSite) => {
  setSelectedCamping(camping);
}, []);
```

### 가상화 (Virtualization)
```typescript
// 대용량 리스트 가상화
import { FixedSizeList as List } from 'react-window';

const VirtualizedCampingList = ({ campingData }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <CampingCard camping={campingData[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={campingData.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

---

## 🎯 컴포넌트 설계 원칙

### 단일 책임 원칙 (SRP)
```typescript
// 좋은 예: 단일 책임
const CampingCard = ({ camping, onSelect }) => {
  return (
    <Card onClick={() => onSelect(camping)}>
      <CampingImage src={camping.image} alt={camping.name} />
      <CampingInfo camping={camping} />
    </Card>
  );
};

// 나쁜 예: 여러 책임
const CampingCard = ({ camping }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFavorite = async () => {
    setIsLoading(true);
    await saveFavorite(camping.id);
    setIsFavorite(true);
    setIsLoading(false);
  };
  
  return (
    <Card>
      {/* UI 렌더링 + 상태 관리 + API 호출 */}
    </Card>
  );
};
```

### Props 인터페이스 설계
```typescript
// 명확한 Props 인터페이스
interface CampingCardProps {
  camping: CampingSite;
  onSelect: (camping: CampingSite) => void;
  isSelected?: boolean;
  showDistance?: boolean;
  className?: string;
}

// 기본값 설정
const CampingCard: React.FC<CampingCardProps> = ({
  camping,
  onSelect,
  isSelected = false,
  showDistance = true,
  className
}) => {
  // 컴포넌트 구현
};
```

### 이벤트 핸들링 패턴
```typescript
// 이벤트 핸들러 설계
const handleCampingSelect = useCallback((camping: CampingSite) => {
  setSelectedCamping(camping);
  // 부모 컴포넌트에 알림
  onCampingSelect?.(camping);
}, [onCampingSelect]);

// 이벤트 전파 방지
const handleCardClick = (e: React.MouseEvent, camping: CampingSite) => {
  e.preventDefault();
  e.stopPropagation();
  handleCampingSelect(camping);
};
```

---

## 🏆 컴포넌트 성과

### 기술적 성과
- ✅ **모듈화**: 재사용 가능한 컴포넌트 구조
- ✅ **성능 최적화**: React.memo, useMemo, useCallback 활용
- ✅ **타입 안전성**: TypeScript Props 인터페이스 정의
- ✅ **접근성**: ARIA 라벨 및 키보드 네비게이션 지원
- ✅ **반응형**: 모든 디바이스에서 최적화된 레이아웃

### 사용자 경험 성과
- ✅ **직관적 인터페이스**: 명확한 컴포넌트 구조
- ✅ **빠른 응답**: 최적화된 렌더링 성능
- ✅ **일관된 디자인**: 통일된 스타일링 시스템
- ✅ **에러 처리**: 사용자 친화적 에러 표시

### 개발자 경험 성과
- ✅ **코드 재사용성**: 모듈화된 컴포넌트 설계
- ✅ **유지보수성**: 명확한 책임 분리
- ✅ **테스트 가능성**: 순수 함수 및 컴포넌트
- ✅ **문서화**: 상세한 Props 및 기능 명세

---

**다음 문서**: [07_DATA_MODELS_TYPES.md](./07_DATA_MODELS_TYPES.md) - 데이터 모델 및 타입 상세 분석 