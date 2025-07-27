import React, { useState } from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  flex: 1;
`;

const FilterTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 16px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #2980b9;
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ResetButton = styled(Button)`
  background: #95a5a6;
  
  &:hover {
    background: #7f8c8d;
  }
`;

interface SearchFilterProps {
  onFilterChange: (filter: { doName?: string; sigunguName?: string }) => void;
  loading: boolean;
  availableDoList?: Array<{ value: string; label: string }>;
  availableSigunguMap?: { [key: string]: Array<{ value: string; label: string }> };
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  onFilterChange, 
  loading, 
  availableDoList = [], 
  availableSigunguMap = {} 
}) => {
  const [selectedDo, setSelectedDo] = useState<string>('');
  const [selectedSigungu, setSelectedSigungu] = useState<string>('');

  // 실제 데이터에서 추출한 도 목록 사용 (없으면 기본 목록 사용)
  const doList = availableDoList.length > 0 
    ? [{ value: '', label: '전체' }, ...availableDoList]
    : [
        { value: '', label: '전체' },
        { value: '서울특별시', label: '서울특별시' },
        { value: '부산광역시', label: '부산광역시' },
        { value: '대구광역시', label: '대구광역시' },
        { value: '인천광역시', label: '인천광역시' },
        { value: '광주광역시', label: '광주광역시' },
        { value: '대전광역시', label: '대전광역시' },
        { value: '울산광역시', label: '울산광역시' },
        { value: '세종특별자치시', label: '세종특별자치시' },
        { value: '경기도', label: '경기도' },
        { value: '강원도', label: '강원도' },
        { value: '충청북도', label: '충청북도' },
        { value: '충청남도', label: '충청남도' },
        { value: '전라북도', label: '전라북도' },
        { value: '전라남도', label: '전라남도' },
        { value: '경상북도', label: '경상북도' },
        { value: '경상남도', label: '경상남도' },
        { value: '제주특별자치도', label: '제주특별자치도' }
      ];

  // 시/군 목록 (도 선택에 따라 동적으로 변경)
  const getSigunguList = (doName: string) => {
    // 실제 데이터에서 추출한 시군구 목록 사용
    if (availableSigunguMap[doName]) {
      return [{ value: '', label: '전체' }, ...availableSigunguMap[doName]];
    }
    
    // 기본 시군구 목록 (실제 데이터가 없을 때)
    const defaultSigunguMap: { [key: string]: Array<{ value: string; label: string }> } = {
      '서울특별시': [
        { value: '', label: '전체' },
        { value: '강남구', label: '강남구' },
        { value: '강동구', label: '강동구' },
        { value: '강북구', label: '강북구' },
        { value: '강서구', label: '강서구' },
        { value: '관악구', label: '관악구' },
        { value: '광진구', label: '광진구' },
        { value: '구로구', label: '구로구' },
        { value: '금천구', label: '금천구' },
        { value: '노원구', label: '노원구' },
        { value: '도봉구', label: '도봉구' },
        { value: '동대문구', label: '동대문구' },
        { value: '동작구', label: '동작구' },
        { value: '마포구', label: '마포구' },
        { value: '서대문구', label: '서대문구' },
        { value: '서초구', label: '서초구' },
        { value: '성동구', label: '성동구' },
        { value: '성북구', label: '성북구' },
        { value: '송파구', label: '송파구' },
        { value: '양천구', label: '양천구' },
        { value: '영등포구', label: '영등포구' },
        { value: '용산구', label: '용산구' },
        { value: '은평구', label: '은평구' },
        { value: '종로구', label: '종로구' },
        { value: '중구', label: '중구' },
        { value: '중랑구', label: '중랑구' }
      ],
      '경기도': [
        { value: '', label: '전체' },
        { value: '수원시', label: '수원시' },
        { value: '성남시', label: '성남시' },
        { value: '의정부시', label: '의정부시' },
        { value: '안양시', label: '안양시' },
        { value: '부천시', label: '부천시' },
        { value: '광명시', label: '광명시' },
        { value: '평택시', label: '평택시' },
        { value: '동두천시', label: '동두천시' },
        { value: '안산시', label: '안산시' },
        { value: '고양시', label: '고양시' },
        { value: '과천시', label: '과천시' },
        { value: '구리시', label: '구리시' },
        { value: '남양주시', label: '남양주시' },
        { value: '오산시', label: '오산시' },
        { value: '시흥시', label: '시흥시' },
        { value: '군포시', label: '군포시' },
        { value: '의왕시', label: '의왕시' },
        { value: '하남시', label: '하남시' },
        { value: '용인시', label: '용인시' },
        { value: '파주시', label: '파주시' },
        { value: '이천시', label: '이천시' },
        { value: '안성시', label: '안성시' },
        { value: '김포시', label: '김포시' },
        { value: '화성시', label: '화성시' },
        { value: '광주시', label: '광주시' },
        { value: '여주시', label: '여주시' },
        { value: '양평군', label: '양평군' },
        { value: '고양군', label: '고양군' },
        { value: '연천군', label: '연천군' },
        { value: '가평군', label: '가평군' },
        { value: '포천군', label: '포천군' }
      ],
      '강원도': [
        { value: '', label: '전체' },
        { value: '춘천시', label: '춘천시' },
        { value: '원주시', label: '원주시' },
        { value: '강릉시', label: '강릉시' },
        { value: '동해시', label: '동해시' },
        { value: '태백시', label: '태백시' },
        { value: '속초시', label: '속초시' },
        { value: '삼척시', label: '삼척시' },
        { value: '홍천군', label: '홍천군' },
        { value: '횡성군', label: '횡성군' },
        { value: '영월군', label: '영월군' },
        { value: '평창군', label: '평창군' },
        { value: '정선군', label: '정선군' },
        { value: '철원군', label: '철원군' },
        { value: '화천군', label: '화천군' },
        { value: '양구군', label: '양구군' },
        { value: '인제군', label: '인제군' },
        { value: '고성군', label: '고성군' },
        { value: '양양군', label: '양양군' }
      ]
    };

    return defaultSigunguMap[doName] || [{ value: '', label: '전체' }];
  };

  const handleDoChange = (doName: string) => {
    setSelectedDo(doName);
    setSelectedSigungu(''); // 시/군 초기화
    console.log('도 변경:', doName);
    
    // 도 선택 시 자동으로 검색 실행
    const filter: { doName?: string; sigunguName?: string } = {};
    if (doName && doName !== '') filter.doName = doName;
    onFilterChange(filter);
  };

  const handleSearch = () => {
    const filter: { doName?: string; sigunguName?: string } = {};
    if (selectedDo) filter.doName = selectedDo;
    if (selectedSigungu) filter.sigunguName = selectedSigungu;
    
    console.log('검색 필터:', filter);
    onFilterChange(filter);
  };

  const handleReset = () => {
    setSelectedDo('');
    setSelectedSigungu('');
    console.log('필터 초기화');
    onFilterChange({});
  };

  return (
    <FilterContainer>
      <FilterRow>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {loading && <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
            데이터 로딩 중...
          </span>}
          <Select 
            value={selectedDo} 
            onChange={(e) => handleDoChange(e.target.value)}
            disabled={loading}
          >
            {doList.map(doItem => (
              <option key={doItem.value} value={doItem.value}>
                {doItem.label}
              </option>
            ))}
          </Select>
          
          <Select 
            value={selectedSigungu} 
            onChange={(e) => {
              const newSigungu = e.target.value;
              setSelectedSigungu(newSigungu);
              // 시/군 선택 시 자동으로 검색 실행
              const filter: { doName?: string; sigunguName?: string } = {};
              if (selectedDo && selectedDo !== '') filter.doName = selectedDo;
              if (newSigungu && newSigungu !== '') filter.sigunguName = newSigungu;
              console.log('시군구 변경 - 필터:', filter);
              onFilterChange(filter);
            }}
            disabled={loading || !selectedDo}
          >
            {getSigunguList(selectedDo).map(sigunguItem => (
              <option key={sigunguItem.value} value={sigunguItem.value}>
                {sigunguItem.label}
              </option>
            ))}
          </Select>
          
          <ResetButton onClick={handleReset} disabled={loading}>
            초기화
          </ResetButton>
        </div>
      </FilterRow>
    </FilterContainer>
  );
};

export default SearchFilter; 