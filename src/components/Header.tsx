import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    color: #3498db;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #34495e;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo to="/">
        🏕️ Camping Finder
      </Logo>
      <Nav>
        <NavLink to="/">홈</NavLink>
        <NavLink to="/search">검색</NavLink>
        <NavLink to="/favorites">즐겨찾기</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 