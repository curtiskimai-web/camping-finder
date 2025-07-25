import React from 'react';
import styled from 'styled-components';
import { CampingSpot } from '../types/camping';
import CampingCard from './CampingCard';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ListTitle = styled.h2`
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
`;

const ResultCount = styled.span`
  color: #666;
  font-size: 14px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

interface CampingListProps {
  campingSpots: CampingSpot[];
  onSpotSelect: (spot: CampingSpot) => void;
  selectedSpot: CampingSpot | null;
}

const CampingList: React.FC<CampingListProps> = ({ 
  campingSpots, 
  onSpotSelect, 
  selectedSpot 
}) => {
  if (campingSpots.length === 0) {
    return (
      <ListContainer>
        <ListHeader>
          <ListTitle>캠핑장 목록</ListTitle>
          <ResultCount>0개</ResultCount>
        </ListHeader>
        <EmptyMessage>
          검색 조건에 맞는 캠핑장이 없습니다.
        </EmptyMessage>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>캠핑장 목록</ListTitle>
        <ResultCount>{campingSpots.length}개</ResultCount>
      </ListHeader>
      
      {campingSpots.map((spot) => (
        <CampingCard
          key={spot.id}
          campingSpot={spot}
          isSelected={selectedSpot?.id === spot.id}
          onClick={() => onSpotSelect(spot)}
        />
      ))}
    </ListContainer>
  );
};

export default CampingList; 