import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { usersState } from '../state/userState';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import IphoneHeader from '../main/IphoneHeader';
import IphoneFooter from '../main/IphoneFooter';
import NavigatingFooter from './NavigateFooter';
import FriendListHeader from './FriendListHeader';
import { selectedUserState } from '../state/selectedUserState';
import { messagesState } from '../state/messageState'; 
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';



const pageTransitionVariants = { //페이지 전환 애니메이션
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};


const FriendList = () => {
  const navigate = useNavigate();
  const users = useRecoilValue(usersState);
  const [selectedUserId, setSelectedUserId] = useRecoilState(selectedUserState); 
  const messages = useRecoilValue(messagesState);
  const [friendCount, setFriendCount] = useState(0); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = () => {
    // 편집 버튼 핸들러..
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId); // 사용자 클릭시 selectedUserId 상태 업데이트
  };

  const handleCallIconClick = (phoneNumber: string): void => {
   
    navigate('/phone', { state: { phoneNumber } }); //핸드폰번호랑 같이 전화화면으로넘어가기
  };

  useEffect(() => {
    setFriendCount(users.filter(user => user.id !== 0).length); // 자기 자신을 뺀 친구 수
  }, [users]);

  const filteredUsers = users.filter(user => user.id !== 0 &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <motion.div
    variants={pageTransitionVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3 }}
    >
      <Container>
        <AppContainer>
          <IphoneHeader src='/assets/Status Bar.svg' />
          <FriendListHeader 
            onEditClick={handleEditClick} 
            onSearchChange={handleSearchChange} 
            searchTerm={searchTerm}
          />
          <FriendListContainer>
              <FriendCount>친구 {friendCount}명</FriendCount>
              <FriendListUl>
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                 
                  <FriendListItem>
                    <FriendImage src={user.profileImage} alt={user.name} style={{width:"37px", height:"37px"}}/>
                    <FriendInfo> 
                      <Link 
                        to={`/chat/${user.id}`} 
                        key={user.id} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        onClick={() => handleUserClick(user.id)}
                      >
                        <FriendName>{user.name}</FriendName>
                      </Link>
                        <CallIcon 
                          src="/assets/Call (3).png"
                          onClick={() => handleCallIconClick(user.phoneNumber)}/>
                    </FriendInfo>
                  </FriendListItem>
                )) : (
                  <NoResultsContainer>
                 <MagnifyingGlass src="/assets/Group 7.svg"/>
                <NoResults>{`'${searchTerm}'에 대한 결과 없음`}</NoResults>
                <NoResults2>맞춤법을 확인하거나 새로운 검색을 시도하십시오.</NoResults2>
              </NoResultsContainer>
            )}
          </FriendListUl>
        </FriendListContainer>
        <NavigatingFooter/>
        <IphoneFooter src='/assets/Home Indicator.png' backgroundColor='#F7F8FC'/>
      </AppContainer>
      </Container>
    </motion.div>
  );
};
export default FriendList;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center; 
  height: 100vh; 
  width: 100vw; 
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 

  width: 100vw; 
  height: 100vh; 
  background-color: #FFFFFF; 

  @media (min-width: 768px) { 
    max-width: 375px;
    max-height: 812px;
    min-height: 812px;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const FriendListContainer = styled.div`
max-width: 375px;
width: 100%;
display: flex;

flex-direction: column;
flex: 1;
  overflow-y: auto;
`;

const FriendListUl = styled.ul`
  list-style: none;
  padding: 0;
`;

const FriendListItem = styled.li`
  padding: 11px 15px;
  display: flex;
  margin-bottom: 4px;
`;

const FriendImage = styled.img`
  width: 54px;
  height: 54px;
  border-radius: 50%;
`;

const FriendInfo = styled.span`
font-family: pretendard;
  margin: 6px 0px 6px 11px;
  width:280px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;


const FriendName = styled.div`
font-size: 17px;
  font-weight: 600;
`;

const CallIcon = styled.img`
width: 30px;
hwight:30px;
cursor: pointer;
`;

const FriendCount = styled.div`
  font-family: Pretanard;
  font-size: 15px;
  margin-left: 15px;
  margin-bottom: 2px;
  color: #63666A;
  width:
`;



const NoResults = styled.div`
max-width:292px;
text-align: center;
margin-top: 20px;
font-size: 19px;
color: #1F1F1F;
font-weight: 600;
`;
const NoResults2 = styled.div`
max-width:292px;
text-align: center;
font-size: 16px;
font-weight: 500;
color: #8D949E;
margin-top: 8px;
`;

const NoResultsContainer = styled.div`
display:flex;
width:100%;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100%;
margin-top: 127px; //임의로 조정..

`;
const MagnifyingGlass=styled.img`
width:40px;
height:40px;
`;