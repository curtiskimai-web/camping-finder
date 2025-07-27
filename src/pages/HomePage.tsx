import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CampingSpot } from '../types/camping';
import { campingApiService } from '../services/campingApi';
import SearchFilter from '../components/SearchFilter';
import CampingList from '../components/CampingList';
import Map from '../components/Map';

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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #e74c3c;
`;

const HomePage: React.FC = () => {
  const [campingSpots, setCampingSpots] = useState<CampingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<CampingSpot | null>(null);

  useEffect(() => {
    loadCampingSpots();
  }, []);

  const loadCampingSpots = async () => {
    try {
      setLoading(true);
      setError(null);
      const spots = await campingApiService.getCampingSpots();
      setCampingSpots(spots);
    } catch (err) {
      setError('캠핑장 정보를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpotSelect = (spot: CampingSpot) => {
    setSelectedSpot(spot);
  };

  const handleSearch = async (filter: any) => {
    try {
      setLoading(true);
      const spots = await campingApiService.getCampingSpots(filter);
      setCampingSpots(spots);
    } catch (err) {
      setError('검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <HomeContainer>
        <LeftPanel>
          <LoadingContainer>캠핑장 정보를 불러오는 중...</LoadingContainer>
        </LeftPanel>
        <RightPanel>
          <Map campingSpots={[]} selectedSpot={null} onSpotSelect={() => {}} />
        </RightPanel>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <LeftPanel>
          <ErrorContainer>{error}</ErrorContainer>
        </LeftPanel>
        <RightPanel>
          <Map campingSpots={[]} selectedSpot={null} onSpotSelect={() => {}} />
        </RightPanel>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <LeftPanel>
        <SearchFilter onFilterChange={handleSearch} loading={loading} />
        <CampingList 
          campingSpots={campingSpots} 
          onSpotSelect={handleSpotSelect}
          selectedSpot={selectedSpot}
        />
      </LeftPanel>
      <RightPanel>
        <Map 
          campingSpots={campingSpots} 
          selectedSpot={selectedSpot} 
          onSpotSelect={handleSpotSelect}
        />
      </RightPanel>
    </HomeContainer>
  );
};

export default HomePage; 