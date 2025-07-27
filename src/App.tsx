import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { campingApiService } from './services/campingApi';
import { CampingSpot } from './types/camping';
import CampingList from './components/CampingList';
import Map from './components/Map';
import SearchFilter from './components/SearchFilter';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const TestContent = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
  text-align: right;
  font-size: 24px;
`;

const Status = styled.div<{ success?: boolean }>`
  background: ${props => props.success ? '#27ae60' : '#e74c3c'};
  color: white;
  padding: 10px;
  border-radius: 4px;
  margin: 20px 0;
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
  
  &:hover {
    background: #2980b9;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;
  height: 760px;
`;

const ListSection = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MapSection = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
  display: none;
`;

function App() {
  const [allCampingSpots, setAllCampingSpots] = useState<CampingSpot[]>([]); // 전체 캠핑장 데이터
  const [filteredCampingSpots, setFilteredCampingSpots] = useState<CampingSpot[]>([]); // 필터링된 데이터
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<CampingSpot | null>(null);
  const [currentFilter, setCurrentFilter] = useState<{ doName?: string; sigunguName?: string }>({});
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false); // 데이터 로드 여부
  const [availableDoList, setAvailableDoList] = useState<Array<{ value: string; label: string }>>([]); // 실제 데이터에서 추출한 도 목록
  const [availableSigunguMap, setAvailableSigunguMap] = useState<{ [key: string]: Array<{ value: string; label: string }> }>({}); // 실제 데이터에서 추출한 시군구 목록
  const [sortField, setSortField] = useState<'name' | 'distance'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 도 이름 정규화 매핑 (공통 사용) - 공백 제거 및 통일된 명칭 사용
  const doNameMapping: { [key: string]: string } = {
    // 강원도
    '강원': '강원도',
    '강원도': '강원도',
    '강원특별자치도': '강원도',
    '강원 특별자치도': '강원도',
    
    // 충청북도
    '충북': '충청북도',
    '충청북도': '충청북도',
    '충북특별자치도': '충청북도',
    '충북 특별자치도': '충청북도',
    
    // 충청남도
    '충남': '충청남도',
    '충청남도': '충청남도',
    '충남특별자치도': '충청남도',
    '충남 특별자치도': '충청남도',
    
    // 전라북도
    '전북': '전라북도',
    '전라북도': '전라북도',
    '전북특별자치도': '전라북도',
    '전북 특별자치도': '전라북도',
    
    // 전라남도
    '전남': '전라남도',
    '전라남도': '전라남도',
    '전남특별자치도': '전라남도',
    '전남 특별자치도': '전라남도',
    
    // 경상북도
    '경북': '경상북도',
    '경상북도': '경상북도',
    '경북특별자치도': '경상북도',
    '경북 특별자치도': '경상북도',
    
    // 경상남도
    '경남': '경상남도',
    '경상남도': '경상남도',
    '경남특별자치도': '경상남도',
    '경남 특별자치도': '경상남도',
    
    // 서울특별시
    '서울': '서울특별시',
    '서울시': '서울특별시',
    '서울특별시': '서울특별시',
    '서울 특별시': '서울특별시',
    
    // 부산광역시
    '부산': '부산광역시',
    '부산시': '부산광역시',
    '부산광역시': '부산광역시',
    '부산 광역시': '부산광역시',
    
    // 대구광역시
    '대구': '대구광역시',
    '대구시': '대구광역시',
    '대구광역시': '대구광역시',
    '대구 광역시': '대구광역시',
    
    // 인천광역시
    '인천': '인천광역시',
    '인천시': '인천광역시',
    '인천광역시': '인천광역시',
    '인천 광역시': '인천광역시',
    
    // 광주광역시
    '광주': '광주광역시',
    '광주시': '광주광역시',
    '광주광역시': '광주광역시',
    '광주 광역시': '광주광역시',
    
    // 대전광역시
    '대전': '대전광역시',
    '대전시': '대전광역시',
    '대전광역시': '대전광역시',
    '대전 광역시': '대전광역시',
    
    // 울산광역시
    '울산': '울산광역시',
    '울산시': '울산광역시',
    '울산광역시': '울산광역시',
    '울산 광역시': '울산광역시',
    
    // 세종특별자치시
    '세종': '세종특별자치시',
    '세종시': '세종특별자치시',
    '세종특별자치시': '세종특별자치시',
    '세종 특별자치시': '세종특별자치시',
    
    // 경기도
    '경기': '경기도',
    '경기도': '경기도',
    
    // 제주특별자치도
    '제주': '제주특별자치도',
    '제주도': '제주특별자치도',
    '제주특별자치도': '제주특별자치도',
    '제주 특별자치도': '제주특별자치도'
  };

  // 시군구 이름 정규화 매핑 (공통 사용) - 간단한 버전
  const sigunguNameMapping: { [key: string]: string } = {
    // 공백 제거를 위한 기본 매핑
    '강남구': '강남구',
    '강동구': '강동구',
    '강북구': '강북구',
    '강서구': '강서구',
    '관악구': '관악구',
    '광진구': '광진구',
    '구로구': '구로구',
    '금천구': '금천구',
    '노원구': '노원구',
    '도봉구': '도봉구',
    '동대문구': '동대문구',
    '동작구': '동작구',
    '마포구': '마포구',
    '서대문구': '서대문구',
    '서초구': '서초구',
    '성동구': '성동구',
    '성북구': '성북구',
    '송파구': '송파구',
    '양천구': '양천구',
    '영등포구': '영등포구',
    '용산구': '용산구',
    '은평구': '은평구',
    '종로구': '종로구',
    '중구': '중구',
    '중랑구': '중랑구',
    
    // 주요 시군구들
    '춘천시': '춘천시',
    '원주시': '원주시',
    '강릉시': '강릉시',
    '동해시': '동해시',
    '태백시': '태백시',
    '속초시': '속초시',
    '삼척시': '삼척시',
    '홍천군': '홍천군',
    '횡성군': '횡성군',
    '영월군': '영월군',
    '평창군': '평창군',
    '정선군': '정선군',
    '철원군': '철원군',
    '화천군': '화천군',
    '양구군': '양구군',
    '인제군': '인제군',
    '고성군': '고성군',
    '양양군': '양양군',
    '영덕군': '영덕군',
    '수원시': '수원시',
    '성남시': '성남시',
    '의정부시': '의정부시',
    '안양시': '안양시',
    '부천시': '부천시',
    '광명시': '광명시',
    '평택시': '평택시',
    '동두천시': '동두천시',
    '안산시': '안산시',
    '고양시': '고양시',
    '과천시': '과천시',
    '구리시': '구리시',
    '남양주시': '남양주시',
    '오산시': '오산시',
    '시흥시': '시흥시',
    '군포시': '군포시',
    '의왕시': '의왕시',
    '하남시': '하남시',
    '용인시': '용인시',
    '파주시': '파주시',
    '이천시': '이천시',
    '안성시': '안성시',
    '김포시': '김포시',
    '화성시': '화성시',
    '광주시': '광주시',
    '여주시': '여주시',
    '양평군': '양평군',
    '고양군': '고양군',
    '연천군': '연천군',
    '가평군': '가평군'
  };

    // 전체 캠핑장 데이터를 한 번만 로드
  const loadAllCampingSpots = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('=== 전체 캠핑장 데이터 로드 시작 ===');

      const spots = await campingApiService.getCampingSpots();
      console.log('받은 전체 캠핑장 데이터:', spots);
      console.log('받은 캠핑장 개수:', spots.length);
      
      // 주소 형식 확인 및 도/시군구 추출
      if (spots.length > 0) {
        console.log('=== 주소 형식 확인 ===');
        spots.slice(0, 10).forEach((spot, index) => {
          console.log(`${index + 1}번째 캠핑장 주소:`, spot.address);
        });
        




        // 전체 데이터에서 도/시군구 정보 추출
        const addressInfo = spots.reduce((acc, spot) => {
          if (spot.address) {
            // 주소 파싱 개선 - 공백 제거 및 정규화
            const addressParts = spot.address.split(' ').filter(part => part.trim() !== '');
            if (addressParts.length > 0) {
              // 도 이름 추출 및 정규화 (공백 제거)
              let rawDoName = addressParts[0].trim();
              let rawSigunguName = '';
              
              // 주소 패턴 분석
              if (addressParts.length >= 2) {
                // "서울시 강남구" 같은 경우
                if (rawDoName === '서울시') {
                  rawDoName = '서울특별시';
                  rawSigunguName = addressParts[1];
                }
                // "경상북도 영덕군" 같은 경우
                else if (rawDoName === '경상북도' || rawDoName === '경상남도' || 
                         rawDoName === '충청북도' || rawDoName === '충청남도' ||
                         rawDoName === '전라북도' || rawDoName === '전라남도' ||
                         rawDoName === '강원도' || rawDoName === '경기도') {
                  rawSigunguName = addressParts[1];
                }
                // "부산시 해운대구" 같은 경우
                else if (rawDoName === '부산시' || rawDoName === '대구시' || 
                         rawDoName === '인천시' || rawDoName === '광주시' ||
                         rawDoName === '대전시' || rawDoName === '울산시') {
                  rawSigunguName = addressParts[1];
                }
                // "세종시" 같은 경우
                else if (rawDoName === '세종시') {
                  rawDoName = '세종특별자치시';
                  rawSigunguName = addressParts[1];
                }
                // "제주도" 같은 경우
                else if (rawDoName === '제주도') {
                  rawDoName = '제주특별자치도';
                  rawSigunguName = addressParts[1];
                }
                // 기본 경우
                else {
                  rawSigunguName = addressParts[1];
                }
              }
              
              // 도 이름 정규화
              const normalizedDoName = doNameMapping[rawDoName] || rawDoName;
              
              // 도 목록에 추가 (군이 아닌 경우만)
              if (!normalizedDoName.includes('군')) {
                acc.dos.add(normalizedDoName);
              }
              
              // 시군구 정보가 있으면 추가
              if (rawSigunguName) {
                // 시군구 이름 정규화 (공백 제거)
                const normalizedSigunguName = sigunguNameMapping[rawSigunguName.trim()] || rawSigunguName.trim();
                
                // 해당 도의 시군구 목록에 추가
                if (!acc.sigungus[normalizedDoName]) {
                  acc.sigungus[normalizedDoName] = new Set();
                }
                acc.sigungus[normalizedDoName].add(normalizedSigunguName);
              }
            }
          }
          return acc;
        }, { dos: new Set(), sigungus: {} as { [key: string]: Set<string> } });
        
        console.log('=== 실제 데이터에서 추출한 도 목록 (정규화됨) ===');
        console.log(Array.from(addressInfo.dos).sort());
        
        console.log('=== 실제 데이터에서 추출한 시군구 목록 (정규화됨) ===');
        Object.keys(addressInfo.sigungus).forEach(doName => {
          console.log(`${doName}:`, Array.from(addressInfo.sigungus[doName]).sort());
        });
        
        // 정규화 전후 비교를 위한 로그
        console.log('=== 도 이름 정규화 매핑 ===');
        Object.keys(doNameMapping).forEach(key => {
          console.log(`${key} → ${doNameMapping[key]}`);
        });
        
        console.log('=== 시군구 이름 정규화 매핑 ===');
        Object.keys(sigunguNameMapping).forEach(key => {
          console.log(`${key} → ${sigunguNameMapping[key]}`);
        });
        
        // 실제 데이터에서 추출한 도 목록 설정
        const doList = Array.from(addressInfo.dos).sort().map((doName: any) => ({
          value: doName as string,
          label: doName as string
        }));
        setAvailableDoList(doList);
        
        // 실제 데이터에서 추출한 시군구 목록 설정
        const sigunguMap: { [key: string]: Array<{ value: string; label: string }> } = {};
        Object.keys(addressInfo.sigungus).forEach(doName => {
          sigunguMap[doName] = Array.from(addressInfo.sigungus[doName]).sort().map(sigunguName => ({
            value: sigunguName,
            label: sigunguName
          }));
        });
        setAvailableSigunguMap(sigunguMap);
      }
      
      setAllCampingSpots(spots);
      setFilteredCampingSpots(spots);
      setDataLoaded(true);
      console.log('전체 캠핑장 개수:', spots.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(`API 호출에 실패했습니다: ${errorMessage}`);
      console.error('API 호출 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 로컬 필터링 함수
  const applyFilter = (filter: { doName?: string; sigunguName?: string }) => {
    console.log('=== 로컬 필터링 시작 ===');
    console.log('전체 데이터 개수:', allCampingSpots.length);
    console.log('적용할 필터:', filter);

    let filtered = [...allCampingSpots];

    if (filter.doName) {

      filtered = filtered.filter(spot => {
        if (!spot.address) return false;
        
        // 주소 파싱 (loadAllCampingSpots와 동일한 로직) - 공백 제거
        const addressParts = spot.address.split(' ').filter(part => part.trim() !== '');
        if (addressParts.length === 0) return false;
        
        let rawDoName = addressParts[0].trim();
        
        // 주소 패턴 분석
        if (rawDoName === '서울시') {
          rawDoName = '서울특별시';
        } else if (rawDoName === '세종시') {
          rawDoName = '세종특별자치시';
        } else if (rawDoName === '제주도') {
          rawDoName = '제주특별자치도';
        }
        
        const normalizedDoName = doNameMapping[rawDoName] || rawDoName;
        
        // 필터의 도 이름과 정규화된 주소의 도 이름 비교
        return normalizedDoName === filter.doName;
      });
      console.log('도 필터 적용 후 개수:', filtered.length);
    }

    if (filter.sigunguName) {
      filtered = filtered.filter(spot => {
        if (!spot.address) return false;
        
        // 주소 파싱 (도와 동일한 로직)
        const addressParts = spot.address.split(' ').filter(part => part.trim() !== '');
        if (addressParts.length < 2) return false;
        
        let rawSigunguName = addressParts[1].trim();
        
        // 시군구 이름 정규화
        const normalizedSigunguName = sigunguNameMapping[rawSigunguName] || rawSigunguName;
        
        return normalizedSigunguName === filter.sigunguName;
      });
      console.log('시군구 필터 적용 후 개수:', filtered.length);
    }

    setFilteredCampingSpots(filtered);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
    console.log('최종 필터링된 데이터 개수:', filtered.length);
    
    // 디버깅을 위해 첫 번째 결과 출력
    if (filtered.length > 0) {
      console.log('첫 번째 필터링 결과:', filtered[0]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSpotSelect = (spot: CampingSpot) => {
    setSelectedSpot(spot);
    console.log('선택된 캠핑장:', spot);
  };

  // 정렬된 데이터 생성
  const sortedCampingSpots = React.useMemo(() => {
    return [...filteredCampingSpots].sort((a, b) => {
      if (sortField === 'name') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortDirection === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (sortField === 'distance' && currentLocation) {
        const distanceA = Math.sqrt(
          Math.pow(a.latitude - currentLocation.lat, 2) + 
          Math.pow(a.longitude - currentLocation.lng, 2)
        );
        const distanceB = Math.sqrt(
          Math.pow(b.latitude - currentLocation.lat, 2) + 
          Math.pow(b.longitude - currentLocation.lng, 2)
        );
        return sortDirection === 'asc' ? distanceA - distanceB : distanceB - distanceA;
      }
      return 0;
    });
  }, [filteredCampingSpots, sortField, sortDirection, currentLocation]);

  const handleSort = (field: 'name' | 'distance') => {
    if (field === 'distance' && !currentLocation) {
      return; // 거리 정렬은 현재 위치가 필요
    }
    
    if (sortField === field) {
      // 같은 필드 클릭 시 방향만 변경
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 필드 클릭 시 필드 변경하고 오름차순으로 설정
      setSortField(field);
      setSortDirection('asc');
    }
    
    // 첫 페이지로 이동
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: { doName?: string; sigunguName?: string }) => {
    console.log('=== 필터 변경 ===');
    console.log('이전 필터:', currentFilter);
    console.log('새 필터:', filter);
    
    setCurrentFilter(filter);
    setSelectedSpot(null); // 필터 변경 시 선택된 캠핑장 초기화
    
    // 데이터가 로드된 경우에만 필터링 적용
    if (dataLoaded) {
      if (filter.doName || filter.sigunguName) {
        applyFilter(filter);
      } else {
        // 필터가 비어있으면 전체 데이터 표시
        console.log('필터가 비어있으므로 전체 데이터 표시');
        setFilteredCampingSpots(allCampingSpots);
        setCurrentPage(1);
      }
    }
  };

  // 페이지 로드 시 자동으로 데이터 로드 및 현재 위치 가져오기
  useEffect(() => {
    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log('현재 위치 설정:', position.coords);
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
        }
      );
    }
    
    // 페이지 로드 시 자동으로 캠핑장 데이터 가져오기
    loadAllCampingSpots();
  }, []);

  return (
    <AppContainer>
      <TestContent>
        <Title>🏕️ Camping Finder</Title>
        
        {/* 검색 필터 */}
        <div style={{ marginBottom: '20px' }}>
          <SearchFilter 
            onFilterChange={handleFilterChange} 
            loading={loading}
            availableDoList={availableDoList}
            availableSigunguMap={availableSigunguMap}
          />
        </div>
        
        {error && <Status>{error}</Status>}
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            <LoadingSpinner />
            캠핑장 데이터를 불러오는 중...
          </div>
        )}
        
        {!loading && filteredCampingSpots.length > 0 && (
          <MainContent>
            <ListSection>
              <SectionTitle>📋 캠핑장 목록</SectionTitle>
              <CampingList
                campingSpots={sortedCampingSpots}
                onSpotSelect={handleSpotSelect}
                selectedSpot={selectedSpot}
                totalCount={sortedCampingSpots.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                currentLocation={currentLocation}
                onSort={handleSort}
              />
            </ListSection>
            
            <MapSection>
              <SectionTitle>🗺️ 지도</SectionTitle>
              <Map
                campingSpots={filteredCampingSpots}
                selectedSpot={selectedSpot}
                onSpotSelect={handleSpotSelect}
              />
            </MapSection>
          </MainContent>
        )}
      </TestContent>
    </AppContainer>
  );
}

export default App; 