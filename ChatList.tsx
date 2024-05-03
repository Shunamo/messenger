import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { usersState } from '../state/userState';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import IphoneHeader from '../main/IphoneHeader';
import IphoneFooter from '../main/IphoneFooter';
import NavigatingFooter from './NavigateFooter';
import ChatListHeader from './ChatListHeader';
import { selectedUserState } from '../state/selectedUserState'; // selectedUserId 상태 추가
import { messagesState } from '../state/messageState'; 
import { motion } from 'framer-motion';


const pageTransitionVariants = { //페이지 전환 애니메이션
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const ChatList = () => {
  const users = useRecoilValue(usersState);
  const [selectedUserId, setSelectedUserId] = useRecoilState(selectedUserState); // selectedUserId 상태 추가
  const messages = useRecoilValue(messagesState);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => { //편집버튼핸들러
    setIsEditing(!isEditing);
  };
  const handleDeleteMessage = (userId: number) => { //챗팅 삭제 핸들러
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => { //검색핸들러
  };


  const handleUserClick = (userId: number) => {
    const userMessages = messages.filter(
      message => message.senderId === userId || message.receiverId === userId
    );

    if (userMessages.length > 0) {
      // 사용자가 선택되었고 메시지가 있을 때
      setSelectedUserId(userId);
    } else {
      // 메시지가 없을 때
      // 선택된 사용자 ID를 0로 설정
      setSelectedUserId(0);
    }
  };

  const getLastMessage = (userId: number) => {
    const userMessages = messages.filter(
      message => message.senderId === userId || message.receiverId === userId
    );
    return userMessages[userMessages.length - 1]; // 가장 마지막 메시지 반환
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace('오전', 'AM').replace('오후', 'PM').replace('AM', '오전').replace('PM', '오후'); // 'AM'과 'PM'을 한국어 '오전', '오후'로 변경
  };
  
  const getLastMessageTime = (userId: number) => {
    const lastMessage = getLastMessage(userId);
    return lastMessage ? new Date(lastMessage.timestamp).getTime() : 0;
  };
  
  const filteredUsers = users.filter(user =>
    user.id !== 0 && (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      messages.some(msg =>
        (msg.senderId === user.id || msg.receiverId === user.id) &&
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) &&
    messages.some(msg => (msg.senderId === user.id || msg.receiverId === user.id)) // 대화 내용이 있는 사용자만 렌더링
  ).sort((a, b) => {
    return getLastMessageTime(b.id) - getLastMessageTime(a.id); // 최신 메시지가 위로 오도록 정렬
  });
  

  return (
  <motion.div
    variants={pageTransitionVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.2 }}
  >
    <Container>
      <AppContainer>
      <IphoneHeader src='/assets/Status Bar.svg'/>
        <ChatListHeader 
          onEditClick={handleEditClick} 
          onSearchChange={handleSearchChange} 
          searchTerm={searchTerm}
          isEditing={isEditing}
        />
        <ChatListContainer>
          {filteredUsers.length > 0 ? (
            <ChatListUl>
              {filteredUsers.map(user => {
                const lastMessage = getLastMessage(user.id);
                return (
                  <Link 
                    to={`/chat/${user.id}`} 
                    key={user.id} 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onClick={() => handleUserClick(user.id)}
                  >
                    <FriendListItem>
                      <FriendImage src={user.profileImage} alt={user.name} />
                      <FriendInfo>
                        <NameTimeContainer>
                          <FriendName>{user.name}</FriendName>
                          {isEditing ? (
                            <DeleteButton onClick={() => handleDeleteMessage(user.id)}>삭제</DeleteButton>
                           ) :(
                            <MessageTime>{lastMessage ? `${formatMessageTime(lastMessage.timestamp)}`: null}</MessageTime>
                          )}
                        </NameTimeContainer>
                        <LastMessageText>{lastMessage ? lastMessage.text : "No messages"}</LastMessageText>
                      </FriendInfo>
                    </FriendListItem>
                  </Link>
                );
              })}
            </ChatListUl>
          ) : (
            <NoResultsContainer>
              <MagnifyingGlass src="/assets/Group 7.svg"/>
              <NoResults>{`'${searchTerm}'에 대한 결과 없음`}</NoResults>
              <NoResults2>맞춤법을 확인하거나 새로운 검색을 시도하십시오.</NoResults2>
            </NoResultsContainer>
          )}
        </ChatListContainer>
        <NavigatingFooter/>
        <IphoneFooter src='/assets/Home Indicator.png' backgroundColor='#F7F8FC'/>
      </AppContainer>
    </Container>
  </motion.div>

  );
};

export default ChatList;



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

const ChatListContainer = styled.div`
  flex: 1;
  display: flex;            
  overflow-y: auto;          
  width: 100%;   
 `;

const ChatListUl = styled.ul`
display: flex;
flex-direction: column;

  list-style: none;
  width: 100%;
`;

const FriendListItem = styled.li`

  display: flex;
  justify-content: center;
  padding: 6px 0;
  position: relative;
  margin-bottom: 4px;
  width: 100%;  
`;

const FriendImage = styled.img`
  width: 54px;
  height: 54px;
  border-radius: 50%;
`;

const FriendInfo = styled.span`
font-family: pretendard;
  margin: 0px 0px 0px 11px;
  width:280px;
`;

const LastMessageText = styled.div`
  font-size: 15px;
  color: #8D949E;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 4px;
  `;
const FriendName = styled.div`
font-size: 19px;
  font-weight: 600;
`;
const MessageTime = styled.span`
  font-size: 14px;
  color: #8D949E;
`;
const NameTimeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%; 
  `

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
const MagnifyingGlass=styled.img`
width:40px;
height:40px;
`;
const NoResultsContainer = styled.div`
display:flex;
width:100%;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100%;
margin-top: 164px;
`;
const DeleteButton = styled.button` //ㅠㅠㅠ임의로만들어본 삭제버튼
font-family: Pretendard;
font-weight:600;
position: absolute; 
width: 62px;
height: 62px;
right: 15px;
top: 0px;
background-color: red;
border:none;
color:white;
`;
