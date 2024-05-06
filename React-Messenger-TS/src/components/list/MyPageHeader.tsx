import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { usersState } from '../state/userState';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [users] = useRecoilState(usersState);

  const userProfile = users.find(user => user.id === 0);

  const handleBackButtonClick = () => {
    navigate(-1); // 뒤로가기 로직
  };

  return (
    <HeaderContainer>
      <TopBar>
        <BackButton src='/assets/back.png' alt='Back' onClick={handleBackButtonClick} />
        <ProfileLabel>프로필</ProfileLabel>
      </TopBar>
      
      {userProfile && (
        <UserProfileSection>
          <ProfileImg src={userProfile.profileImage} alt="Profile" />
          <ProfileInfo>
            <ProfileName>{userProfile.name}</ProfileName>
            <PhoneNumber>{userProfile.phoneNumber}</PhoneNumber>
          </ProfileInfo>
        </UserProfileSection>
      )}
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
display: flex;
flex-direction: column;
width: 100%;
background-color: #F7F8FC;

  @media (max-width: 768px) {
    background-color: #ffffff;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 53px;
  background-color: #F7F8FC;

`;

const UserProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 26px;
  background-color: #F7F8FC;

`;

const ProfileLabel = styled.span`
  font-size: 17px;
  color: #1F1F1F;
  font-weight: 600;
  margin: 0 auto; 
`;

const BackButton = styled.img`
  background: none;
  border: none;
  cursor: pointer;
  width: 8.5px;
  height: 17px;
  transition: transform 0.1s ease;
  margin-left: 16px;
  margin-right: -16px;
  &:active {
    transform: scale(0.9);
  }
`;
const ProfileName = styled.span`
font-size: 25px;
color: #1F1F1F;
font-weight: 700;
margin-top: 20px;
`
const ProfileImg = styled.img`
  width: 110px;
  height: 110px;
`;
const ProfileInfo = styled.div`
width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;

`;
const PhoneNumber = styled.span`

  font-size: 15px;
  color: #63666A;
  margin-top: 12px;
  margin-bottom:31px;
`;

export default Header;
