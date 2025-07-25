import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CampingSpot } from '../types/camping';
import { campingApiService } from '../services/campingApi';

const DetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DetailCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const HeaderSection = styled.div`
  padding: 30px;
  border-bottom: 1px solid #ecf0f1;
`;

const CampingTitle = styled.h1`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 28px;
`;

const PriceTag = styled.span<{ type: 'free' | 'paid' }>`
  background-color: ${props => props.type === 'free' ? '#27ae60' : '#e74c3c'};
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-left: 10px;
`;

const Address = styled.p`
  margin: 10px 0;
  color: #666;
  font-size: 16px;
`;

const Phone = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 16px;
`;

const ContentSection = styled.div`
  padding: 30px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 20px;
`;

const Facilities = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FacilityTag = styled.span`
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  color: #666;
`;

const ReservationButton = styled.a`
  display: inline-block;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  margin-top: 10px;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #e74c3c;
`;

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campingSpot, setCampingSpot] = useState<CampingSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCampingSpotDetail(id);
    }
  }, [id]);

  const loadCampingSpotDetail = async (spotId: string) => {
    try {
      setLoading(true);
      setError(null);
      const spot = await campingApiService.getCampingSpotDetail(spotId);
      if (spot) {
        setCampingSpot(spot);
      } else {
        setError('캠핑장 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError('캠핑장 정보를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate('/')}>
          ← 목록으로 돌아가기
        </BackButton>
        <LoadingContainer>캠핑장 정보를 불러오는 중...</LoadingContainer>
      </DetailContainer>
    );
  }

  if (error || !campingSpot) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate('/')}>
          ← 목록으로 돌아가기
        </BackButton>
        <ErrorContainer>{error || '캠핑장 정보를 찾을 수 없습니다.'}</ErrorContainer>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackButton onClick={() => navigate('/')}>
        ← 목록으로 돌아가기
      </BackButton>
      
      <DetailCard>
        <HeaderSection>
          <CampingTitle>
            {campingSpot.name}
            <PriceTag type={campingSpot.price.type}>
              {campingSpot.price.type === 'free' ? '무료' : '유료'}
            </PriceTag>
          </CampingTitle>
          <Address>📍 {campingSpot.address}</Address>
          <Phone>📞 {campingSpot.phone}</Phone>
        </HeaderSection>
        
        <ContentSection>
          <SectionTitle>시설 정보</SectionTitle>
          {campingSpot.facilities.length > 0 ? (
            <Facilities>
              {campingSpot.facilities.map(facility => (
                <FacilityTag key={facility}>
                  {facilityIcons[facility] || '🏕️'} {facility}
                </FacilityTag>
              ))}
            </Facilities>
          ) : (
            <p>시설 정보가 없습니다.</p>
          )}
          
          <SectionTitle>이용 안내</SectionTitle>
          <Description>{campingSpot.description}</Description>
          
          <InfoGrid>
            <InfoItem>
              <InfoLabel>운영시간</InfoLabel>
              <InfoValue>{campingSpot.operatingHours}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>예약 상태</InfoLabel>
              <InfoValue>
                {campingSpot.reservation.available ? '예약 가능' : '예약 불가'}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>예약 방법</InfoLabel>
              <InfoValue>{campingSpot.reservation.method}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>마지막 업데이트</InfoLabel>
              <InfoValue>
                {new Date(campingSpot.lastUpdated).toLocaleDateString('ko-KR')}
              </InfoValue>
            </InfoItem>
          </InfoGrid>
          
          {campingSpot.reservation.available && campingSpot.reservation.method !== '예약 불가' && (
            <ReservationButton href={campingSpot.reservation.method} target="_blank">
              예약하기
            </ReservationButton>
          )}
        </ContentSection>
      </DetailCard>
    </DetailContainer>
  );
};

export default DetailPage; 