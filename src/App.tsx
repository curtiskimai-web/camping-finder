import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { campingApiService } from './services/campingApi';
import { CampingSpot } from './types/camping';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const TestContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
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

const CampingList = styled.div`
  margin-top: 20px;
  text-align: left;
`;

const CampingItem = styled.div`
  background: #f8f9fa;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
  border-left: 4px solid #3498db;
`;

function App() {
  const [campingSpots, setCampingSpots] = useState<CampingSpot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApiCall = async () => {
    try {
      setLoading(true);
      setError(null);
      const spots = await campingApiService.getCampingSpots();
      setCampingSpots(spots);
    } catch (err) {
      setError('API 호출에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <TestContent>
        <Title>🏕️ Camping Finder</Title>
        <p>캠핑장 실시간 조회 서비스</p>
        <Status success>✅ 개발 서버가 정상적으로 실행되고 있습니다!</Status>
        <p>현재 시간: {new Date().toLocaleString('ko-KR')}</p>
        <p>React + TypeScript + Vite 환경이 정상 작동 중입니다.</p>
        
        <hr style={{ margin: '20px 0' }} />
        
        <h3>API 테스트</h3>
        <Button onClick={testApiCall} disabled={loading}>
          {loading ? '로딩 중...' : '캠핑장 데이터 가져오기'}
        </Button>
        
        {error && <Status>{error}</Status>}
        
        {campingSpots.length > 0 && (
          <CampingList>
            <h4>캠핑장 목록 ({campingSpots.length}개)</h4>
            {campingSpots.map((spot, index) => (
              <CampingItem key={spot.id || index}>
                <h5>{spot.name}</h5>
                <p>📍 {spot.address}</p>
                <p>📞 {spot.phone}</p>
                <p>💰 {spot.price.type === 'free' ? '무료' : `유료 (${spot.price.amount}원)`}</p>
                <p>🏕️ {spot.facilities.join(', ')}</p>
              </CampingItem>
            ))}
          </CampingList>
        )}
        
        <hr style={{ margin: '20px 0' }} />
        
        <p>다음 단계:</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>공공데이터 포털 API 키 설정 완료 ✅</li>
          <li>Kakao Map API 키 발급 필요</li>
          <li>실제 캠핑장 데이터 연동</li>
          <li>지도 표시 기능 구현</li>
        </ul>
      </TestContent>
    </AppContainer>
  );
}

export default App; 