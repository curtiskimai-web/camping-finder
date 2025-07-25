import React from 'react';
import styled from 'styled-components';
import { CampingSpot } from '../types/camping';

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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const CampingName = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
`;

const PriceTag = styled.span<{ type: 'free' | 'paid' }>`
  background-color: ${props => props.type === 'free' ? '#27ae60' : '#e74c3c'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const CardContent = styled.div`
  margin-bottom: 10px;
`;

const Address = styled.p`
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
`;

const Phone = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const Facilities = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const FacilityTag = styled.span`
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReservationStatus = styled.span<{ available: boolean }>`
  color: ${props => props.available ? '#27ae60' : '#e74c3c'};
  font-size: 12px;
  font-weight: 500;
`;

const LastUpdated = styled.span`
  color: #999;
  font-size: 11px;
`;

interface CampingCardProps {
  campingSpot: CampingSpot;
  isSelected: boolean;
  onClick: () => void;
}

const CampingCard: React.FC<CampingCardProps> = ({ 
  campingSpot, 
  isSelected, 
  onClick 
}) => {
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card isSelected={isSelected} onClick={onClick}>
      <CardHeader>
        <CampingName>{campingSpot.name}</CampingName>
        <PriceTag type={campingSpot.price.type}>
          {campingSpot.price.type === 'free' ? '무료' : '유료'}
        </PriceTag>
      </CardHeader>
      
      <CardContent>
        <Address>📍 {campingSpot.address}</Address>
        <Phone>📞 {campingSpot.phone}</Phone>
        
        {campingSpot.facilities.length > 0 && (
          <Facilities>
            {campingSpot.facilities.map(facility => (
              <FacilityTag key={facility}>
                {facilityIcons[facility] || '🏕️'} {facility}
              </FacilityTag>
            ))}
          </Facilities>
        )}
      </CardContent>
      
      <CardFooter>
        <ReservationStatus available={campingSpot.reservation.available}>
          {campingSpot.reservation.available ? '✅ 예약 가능' : '❌ 예약 불가'}
        </ReservationStatus>
        <LastUpdated>
          업데이트: {formatDate(campingSpot.lastUpdated)}
        </LastUpdated>
      </CardFooter>
    </Card>
  );
};

export default CampingCard; 