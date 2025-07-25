import React, { useState } from 'react';
import styled from 'styled-components';
import { SearchFilter as SearchFilterType } from '../types/camping';

const FilterContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const FilterTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 18px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const SearchButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const ResetButton = styled.button`
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-left: 10px;
  
  &:hover {
    background-color: #7f8c8d;
  }
`;

interface SearchFilterProps {
  onSearch: (filter: SearchFilterType) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
  const [filter, setFilter] = useState<SearchFilterType>({
    region: { province: '', city: '' },
    facilities: [],
    priceRange: 'all',
    reservationAvailable: false,
    keyword: ''
  });

  const provinces = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시', 
    '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
    '경기도', '강원도', '충청북도', '충청남도', 
    '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
  ];

  const cities = {
    '경기도': ['수원시', '성남시', '의정부시', '안양시', '부천시', '광명시', '평택시', '동두천시', '안산시', '고양시', '과천시', '구리시', '남양주시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '용인시', '파주시', '이천시', '안성시', '김포시', '화성시', '광주시', '여주시', '양평군', '고양군', '연천군', '가평군', '포천군'],
    '강원도': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
    '충청북도': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
    '충청남도': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
    '전라북도': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
    '전라남도': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
    '경상북도': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
    '경상남도': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군']
  };

  const handleProvinceChange = (province: string) => {
    setFilter(prev => ({
      ...prev,
      region: { province, city: '' }
    }));
  };

  const handleCityChange = (city: string) => {
    setFilter(prev => ({
      ...prev,
      region: { ...prev.region, city }
    }));
  };

  const handleSearch = () => {
    onSearch(filter);
  };

  const handleReset = () => {
    setFilter({
      region: { province: '', city: '' },
      facilities: [],
      priceRange: 'all',
      reservationAvailable: false,
      keyword: ''
    });
    onSearch({
      region: { province: '', city: '' },
      facilities: [],
      priceRange: 'all',
      reservationAvailable: false,
      keyword: ''
    });
  };

  return (
    <FilterContainer>
      <FilterTitle>🔍 캠핑장 검색</FilterTitle>
      
      <FilterRow>
        <FilterGroup>
          <Label>지역</Label>
          <Select 
            value={filter.region.province} 
            onChange={(e) => handleProvinceChange(e.target.value)}
          >
            <option value="">전체</option>
            {provinces.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </Select>
        </FilterGroup>
        
        {filter.region.province && cities[filter.region.province as keyof typeof cities] && (
          <FilterGroup>
            <Label>시/군/구</Label>
            <Select 
              value={filter.region.city} 
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="">전체</option>
              {cities[filter.region.province as keyof typeof cities].map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Select>
          </FilterGroup>
        )}
      </FilterRow>

      <FilterRow>
        <FilterGroup>
          <Label>검색어</Label>
          <Input
            type="text"
            placeholder="캠핑장명을 입력하세요"
            value={filter.keyword}
            onChange={(e) => setFilter(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </FilterGroup>
      </FilterRow>

      <FilterRow>
        <FilterGroup>
          <Label>가격</Label>
          <Select
            value={filter.priceRange}
            onChange={(e) => setFilter(prev => ({ ...prev, priceRange: e.target.value as any }))}
          >
            <option value="all">전체</option>
            <option value="free">무료</option>
            <option value="paid">유료</option>
          </Select>
        </FilterGroup>
        
        <FilterGroup>
          <Label>
            <Checkbox
              type="checkbox"
              checked={filter.reservationAvailable}
              onChange={(e) => setFilter(prev => ({ ...prev, reservationAvailable: e.target.checked }))}
            />
            예약 가능한 캠핑장만
          </Label>
        </FilterGroup>
      </FilterRow>

      <FilterRow>
        <SearchButton onClick={handleSearch}>검색</SearchButton>
        <ResetButton onClick={handleReset}>초기화</ResetButton>
      </FilterRow>
    </FilterContainer>
  );
};

export default SearchFilter; 