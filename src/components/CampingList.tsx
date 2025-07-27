import React from 'react';
import styled from 'styled-components';
import { CampingSpot } from '../types/camping';
import { getDistanceFromCurrentLocation } from '../utils/distance';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  overflow: hidden;
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
  text-align: center;
`;

const ResultCount = styled.span`
  color: #666;
  font-size: 14px;
`;

const TableContainer = styled.div`
  border: 1px solid #e0e0e0;
  flex: 1;
  max-height: 600px;
  display: flex;
  flex-direction: column;
`;

const TableHeader = styled.div`
  overflow-x: auto;
  border-bottom: 2px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
`;

const TableBody = styled.div`
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
`;

const HeaderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
`;

const Th = styled.th<{ sortable?: boolean; width?: string }>`
  background: #f8f9fa;
  padding: 12px 8px;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  user-select: none;
  transition: background-color 0.2s;
  position: sticky;
  top: 0;
  z-index: 5;
  width: ${props => props.width || 'auto'};

  &:hover {
    background: ${props => props.sortable ? '#e9ecef' : '#f8f9fa'};
  }
`;

const Td = styled.td<{ width?: string }>`
  padding: 10px 8px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
  width: ${props => props.width || 'auto'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Tr = styled.tr<{ isSelected?: boolean }>`
  background: ${props => props.isSelected ? '#e3f2fd' : 'white'};
  cursor: pointer;
  transition: background-color 0.2s;
  border-left: ${props => props.isSelected ? '4px solid #3498db' : 'none'};

  &:hover {
    background: ${props => props.isSelected ? '#e3f2fd' : '#f5f5f5'};
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 15px;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.isActive ? '#3498db' : '#ddd'};
  background: ${props => props.isActive ? '#3498db' : 'white'};
  color: ${props => props.isActive ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.isActive ? '#2980b9' : '#f8f9fa'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #666;
  font-size: 14px;
  margin: 0 15px;
`;

const PriceTag = styled.span<{ type: 'free' | 'paid' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.type === 'free' ? '#e8f5e8' : '#fff3cd'};
  color: ${props => props.type === 'free' ? '#2d5a2d' : '#856404'};
`;

const FacilityTag = styled.span`
  display: inline-block;
  padding: 2px 6px;
  margin: 1px;
  background: #e9ecef;
  color: #495057;
  border-radius: 10px;
  font-size: 11px;
`;



interface CampingListProps {
  campingSpots: CampingSpot[];
  onSpotSelect: (spot: CampingSpot) => void;
  selectedSpot: CampingSpot | null;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  currentLocation?: { lat: number; lng: number } | null;
  onSort?: (field: 'name' | 'distance') => void;
}

const CampingList: React.FC<CampingListProps> = ({ 
  campingSpots, 
  onSpotSelect, 
  selectedSpot,
  totalCount = 0,
  currentPage = 1,
  onPageChange,
  currentLocation,
  onSort
}) => {
  const itemsPerPage = 100;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  // 현재 페이지에 해당하는 데이터만 표시
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = campingSpots.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleHeaderClick = (field: 'name' | 'distance') => {
    if (field === 'distance' && !currentLocation) {
      return; // 거리 정렬은 현재 위치가 필요
    }
    
    if (onSort) {
      onSort(field);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

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
        <ResultCount>총 {totalCount}개 중 {currentPageData.length}개 표시</ResultCount>
      </ListHeader>
      
      <TableContainer>
        <TableHeader>
          <HeaderTable>
            <thead>
              <tr>
                <Th width={currentLocation ? "8%" : "10%"}>번호</Th>
                <Th width={currentLocation ? "20%" : "22%"} sortable onClick={() => handleHeaderClick('name')}>
                  캠핑장명
                </Th>
                <Th width={currentLocation ? "25%" : "28%"}>{currentLocation ? "주소" : "주소"}</Th>
                <Th width={currentLocation ? "12%" : "13%"}>{currentLocation ? "전화번호" : "전화번호"}</Th>
                <Th width={currentLocation ? "10%" : "12%"}>{currentLocation ? "가격" : "가격"}</Th>
                <Th width={currentLocation ? "15%" : "15%"}>{currentLocation ? "시설" : "시설"}</Th>
                <Th width={currentLocation ? "10%" : "10%"}>{currentLocation ? "예약" : "예약"}</Th>
                {currentLocation && (
                  <Th width="10%" sortable onClick={() => handleHeaderClick('distance')}>
                    거리
                  </Th>
                )}
              </tr>
            </thead>
          </HeaderTable>
        </TableHeader>
        <TableBody>
          <Table>
            <tbody>
              {currentPageData.map((spot, index) => (
                <Tr 
                  key={spot.id}
                  isSelected={selectedSpot?.id === spot.id}
                  onClick={() => onSpotSelect(spot)}
                >
                  <Td width={currentLocation ? "8%" : "10%"}>{startIndex + index + 1}</Td>
                  <Td width={currentLocation ? "20%" : "22%"} style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {spot.name}
                  </Td>
                  <Td width={currentLocation ? "25%" : "28%"} style={{ wordBreak: 'break-all' }}>
                    {spot.address}
                  </Td>
                  <Td width={currentLocation ? "12%" : "13%"}>{spot.phone || '-'}</Td>
                  <Td width={currentLocation ? "10%" : "12%"}>
                    <PriceTag type={spot.price.type}>
                      {spot.price.type === 'free' ? '무료' : 
                       spot.price.amount ? `${spot.price.amount.toLocaleString()}원` : '유료'}
                    </PriceTag>
                  </Td>
                  <Td width={currentLocation ? "15%" : "15%"}>
                    {spot.facilities.slice(0, 3).map((facility, idx) => (
                      <FacilityTag key={idx}>{facility}</FacilityTag>
                    ))}
                    {spot.facilities.length > 3 && (
                      <span style={{ color: '#666', fontSize: '11px' }}>
                        +{spot.facilities.length - 3}
                      </span>
                    )}
                  </Td>
                  <Td width={currentLocation ? "10%" : "10%"}>
                    <span style={{ 
                      color: spot.reservation.available ? '#28a745' : '#dc3545',
                      fontWeight: '500'
                    }}>
                      {spot.reservation.available ? '가능' : '불가'}
                    </span>
                  </Td>
                  {currentLocation && (
                    <Td width="10%">
                      <span style={{ 
                        color: '#3498db',
                        fontWeight: '500',
                        fontSize: '12px'
                      }}>
                        {getDistanceFromCurrentLocation(
                          currentLocation.lat,
                          currentLocation.lng,
                          spot.latitude,
                          spot.longitude
                        )}
                      </span>
                    </Td>
                  )}
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableBody>
      </TableContainer>

      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            처음
          </PageButton>
          <PageButton 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </PageButton>
          
          {getPageNumbers().map(page => (
            <PageButton
              key={page}
              isActive={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PageButton>
          ))}
          
          <PageButton 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </PageButton>
          <PageButton 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            마지막
          </PageButton>
          
          <PageInfo>
            {currentPage} / {totalPages} 페이지
          </PageInfo>
        </PaginationContainer>
      )}
    </ListContainer>
  );
};

export default CampingList; 