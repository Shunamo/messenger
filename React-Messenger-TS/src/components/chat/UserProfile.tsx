import React from 'react';
import styled from 'styled-components';

interface UserProfileProps {
  profileImage: string;
  name: string;
  phoneNumber: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ profileImage, name, phoneNumber }) => {
  return (
    <ProfileContainer>
      <ProfileImage src={profileImage} alt="Profile" />
      <Name>{name}</Name>
      <PhoneNumber>{phoneNumber}</PhoneNumber>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 26px;
`;

const ProfileImage = styled.img`
  width: 110px;
  height: 110px;
  margin-bottom: 25px;
`;

const Name = styled.div`
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const PhoneNumber = styled.div`
  color: #63666A;
  font-size: 15px;
`;

export default UserProfile;
