import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { selectedUserState } from '../state/selectedUserState';
import { usersState } from '../state/userState';
import { messagesState } from '../state/messageState';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useRecoilState(selectedUserState);
  const [users] = useRecoilState(usersState);
  const [initialSelectedUserId, setInitialSelectedUserId] = useState(selectedUserId);
  const messages = useRecoilValue(messagesState);

  // selectedUserId가 변경될 때마다 초기 selectedUserId 업데이트
  useEffect(() => {
    if (selectedUserId !== 0) {
      setInitialSelectedUserId(selectedUserId);
    }
  }, [selectedUserId]);

  const selectedUser = users.find(user => user.id === selectedUserId) ?? users[0];

  const handleBackButtonClick = () => {
    navigate(-1); // 뒤로가기 로직
  };

  const handleCallButtonClick = () => { //전화걸기 버튼 활성화!!
    if (selectedUser && selectedUser.phoneNumber) {
        navigate('/phone', { state: { phoneNumber: selectedUser.phoneNumber } });
    } else {
        console.log('전화번호가 없습니다.');
    }
};

  const toggleUser = () => {
    // 메시지가 있는지 확인
    const hasMessages = messages.some(message => message.senderId === selectedUserId || message.receiverId === selectedUserId);
    if (!hasMessages && selectedUserId !== 0) {
      console.log("No messages available for toggling.");
      return; // 메시지가 없으면 토글못하게막음
    }
    setSelectedUserId(prevSelectedUserId => prevSelectedUserId === 0 ? initialSelectedUserId : 0);
    console.log(selectedUser.id);
  };

  return (
    <HeaderContainer>
      <LeftContainer>
        <BackButton src='/assets/back.png' alt='Back' onClick={handleBackButtonClick}/>
        <ProfileContainer onClick={toggleUser}>
          <ProfilePic src={selectedUser.profileImage} alt="Profile" />
          <Name>{selectedUser.name}</Name>
        </ProfileContainer>
      </LeftContainer>
      <CallButton src='/assets/Call.png' alt='Call' onClick={handleCallButtonClick}/>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #F7F8FC;
  color: white;
  
  width: 100%;
  max-height: 54px;

  @media (max-width: 768px) {
    background-color: #ffffff;
  }

`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 11px
`;

const BackButton = styled.img`
  background: none;
  border: none;
  cursor: pointer;

  width: 8.5px; 
  height: 17px; 
  margin-left: 16px;
  margin-right: 33.5px;
  margin-top: 6px;

  transition: transform 0.1s ease; 

  &:active {
    transform: scale(0.9);
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ProfilePic = styled.img`
  width: 37px;
  height: 37px;
  border-radius: 50%;
  margin-right: 13px;
  margin-top: 6px;
`;

const Name = styled.h2`
  font-size: 20px;
  color: #1F1F1F;
  font-weight: 600;
  margin-top: 6px;
`;

const CallButton = styled.img`
  background: none;
  border: none;
  cursor: pointer;
  width: 25px;
  height: 25px;
  margin-right: 25px;
  margin-bottom: 11px

  transition: transform 0.1s ease; 

  &:active {
    transform: scale(0.9);
  }
`;

export default Header;