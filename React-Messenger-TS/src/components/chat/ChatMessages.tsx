import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { messagesState, Message } from '../state/messageState';
import { selectedUserState } from '../state/selectedUserState';
import { usersState, User } from '../state/userState';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import EmojiModal from './EmojiModal';




//날짜 형식에 맞게 포맷팅하기 (12월 25일 (월) 이런식)
const formatShortDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const month = date.toLocaleString('ko-KR', { month: 'long' });
  const day = date.toLocaleString('ko-KR', { day: '2-digit' });
  const weekday = date.toLocaleString('ko-KR', { weekday: 'short' });

  return `${month} ${day} (${weekday})`;
};




const ChatMessages: React.FC = () => { //상턔관리 변수들
  const selectedUserId = useRecoilValue(selectedUserState);
  const messages = useRecoilValue<Message[]>(messagesState);
  const userProfiles = useRecoilValue<User[]>(usersState);

  const [activeModalMessageId, setActiveModalMessageId] = useState<string | null>(null); //공감 모달이 열린 메세지의 ID저장해야돼서
  const [selectedEmojis, setSelectedEmojis] = useState<{ [key: string]: string }>({});
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [lastSelectedUserId, setLastSelectedUserId] = useState<number | null>(null);


  const findUserProfileImage = (userId: number): string | undefined => {
    const userProfile = userProfiles.find(profile => profile.id === userId);
    return userProfile?.profileImage;
  };


 // 필터링된 메시지:0이랑 선택된 유저 간의 메시지만 표시
 useEffect(() => {
    if (selectedUserId !== 0) {
      setLastSelectedUserId(selectedUserId);
    } 
    const newFilteredMessages = selectedUserId === 0 && lastSelectedUserId
      ? messages.filter(message => 
          message.senderId === lastSelectedUserId || message.receiverId === lastSelectedUserId
        )
      : messages.filter(message => 
          message.senderId === selectedUserId || message.receiverId === selectedUserId
        );
    setFilteredMessages(newFilteredMessages);
  }, [selectedUserId, messages, lastSelectedUserId]);



useEffect(() => {
  console.log("Selected User ID:", selectedUserId);
  console.log("Filtered Messages:", filteredMessages);
}, [selectedUserId, filteredMessages]);


  //날짜로 메세지 그룹화하기 (꼬리물기)
  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: { [key: string]: Message[][] } = {}; // 그룹화된 메세지를 저장
    messages.forEach((message) => {
        const dateKey = formatShortDate(message.timestamp); // 기준: 날짜

        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }

        const lastGroup = grouped[dateKey][grouped[dateKey].length - 1];
        const lastMessage = lastGroup && lastGroup[lastGroup.length - 1];

        if (
            lastMessage &&
            lastMessage.senderId === message.senderId && // 자신이 보낸 메세지가 마지막 것인지
            Math.abs(new Date(message.timestamp).getMinutes() - new Date(lastMessage.timestamp).getMinutes()) < 1 // 분이 달라지면 꼬리물기!!
        ) {
            lastGroup.push(message); // 꼬리물기
        } else {
            grouped[dateKey].push([message]); // 새 그룹 (시간 뜨게)
        }
    });

    return grouped;
};



  const groupedMessages = groupMessagesByDate(filteredMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }; //메세지 보냈을 때 스크롤 자동으로 맨 아래로 이동!!




  // 이모지 선택 핸들러
  const handleEmojiSelect = (messageId: string, emojiUrl: string) => {
    setSelectedEmojis(prev => {
      if (prev[messageId] === emojiUrl) {
        const newEmojis = { ...prev };
        delete newEmojis[messageId];
        localStorage.removeItem(`selectedEmojis_${messageId}`); 
        return newEmojis;
      } else {
        const newEmojis = { ...prev, [messageId]: emojiUrl };
        localStorage.setItem(`selectedEmojis_${messageId}`, JSON.stringify(newEmojis[messageId]));
        return newEmojis;
      }
    });
    setActiveModalMessageId(null); 
  };



  //모달창 열고닫는 토글 핸들러
  const toggleEmojiModalForMessage = (messageId: string) => {
    setActiveModalMessageId(prevId => prevId === messageId ? null : messageId);
  };



// 이모지 불러오기
const loadEmojisFromLocalStorage = () => {
  const emojis: { [key: string]: string } = {};
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('selectedEmojis_')) {
      const messageId = key.substring('selectedEmojis_'.length);
      const emojiUrl = localStorage.getItem(key);
      if (emojiUrl) {
        emojis[messageId] = JSON.parse(emojiUrl);
      }
    }
  });
  setSelectedEmojis(emojis);
};

  useEffect(() => {
    scrollToBottom();
    loadEmojisFromLocalStorage();

  }, [messages]); 


  return (
      <MessagesContainer className='scroll-box'>
        {Object.entries(groupedMessages).map(([timestamp, groupMessages], index) => (
          <React.Fragment key={index}>
            <DateLabel>{timestamp}</DateLabel> {/*'날짜' 출력*/}
            {groupMessages.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {group.map((message, messageIndex) => (
                  <MessageLayout key={message.id} isSender={message.senderId === selectedUserId}>
                    {message.senderId === selectedUserId ? (
                      // 발신자 레이아웃: 시간 (맨 처음 톡에만) -> 메시지
                      <MessageModalContainer isSender={message.senderId === selectedUserId}>
                      <SenderMessageContainer
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                        {messageIndex === 0 && ( // 맨처음 톡에만 시간 떠야됨
                          <Timestamp isSender={message.senderId === selectedUserId}> 
                            {new Date(message.timestamp).toLocaleTimeString('ko-KR',
                            { hour: 'numeric', minute: '2-digit', hour12: true }).replace('AM', '오전').replace('PM', '오후')}  {/*오전 12:26 형식으로 '시간' 출력하기!!!*/}
                          </Timestamp> 
                        )}
                        <MessageItem 
                          key={message.id}
                          isSender={message.senderId === selectedUserId}
                          onDoubleClick={() => toggleEmojiModalForMessage(message.id.toString())} 
                          style={{ cursor: "pointer" }}
                          >
                          {message.text}
                        </MessageItem>
                        </SenderMessageContainer>
                        {activeModalMessageId === message.id.toString() && (
                      <EmojiModal
                        onEmojiSelect={(emoji) => handleEmojiSelect(message.id.toString(), emoji)}
                        onClose={() => setActiveModalMessageId(null)}
                        selectedEmojiUrl={selectedEmojis[message.id] || null}
                        />
                        )}
                        {selectedEmojis[message.id] && (
                        <EmojiIcon 
                        src={selectedEmojis[message.id]} 
                        alt="emoji" 
                        style={{marginTop:'5px'}} 
                        />
                        )}
                    </MessageModalContainer>

            
                    ) : (
                      // 수신자 레이아웃: 프사 -> 메시지 -> 시간
                      <MessageModalContainer isSender={message.senderId === selectedUserId}>
                      <ReceiverMessageContainer
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                        <ProfilePic //첫메세지만 프사 보여지고 나머지 메세지들은 hidden으로 숨기기
                          src={findUserProfileImage(message.receiverId)} 
                          alt="Profile" 
                          visible={messageIndex === 0} 
                        />
                         <MessageItem
                            key={message.id}
                            isSender={message.senderId === selectedUserId}
                            onDoubleClick={() =>  toggleEmojiModalForMessage(message.id.toString())} 
                            style={{ cursor: "pointer" }}
                          >
                          {message.text}
                        </MessageItem>

                        {messageIndex === 0 && ( // 마찬가지로 맨위에 톡만 시간뜨기
                          <Timestamp isSender={message.senderId === selectedUserId}>
                            {new Date(message.timestamp).toLocaleTimeString('ko-KR', 
                            { hour: 'numeric', minute: '2-digit', hour12: true }).replace('AM', '오전').replace('PM', '오후')}
                          </Timestamp>
                        )}
                       </ReceiverMessageContainer>
                       {activeModalMessageId === message.id.toString() && (
                      <EmojiModal
                        onEmojiSelect={(emoji) => handleEmojiSelect(message.id.toString(), emoji)}
                        onClose={() => setActiveModalMessageId(null)}
                        selectedEmojiUrl={selectedEmojis[message.id] || null}                        />
                        )}
                        {selectedEmojis[message.id] && (
                        <EmojiIcon 
                          src={selectedEmojis[message.id]} 
                          alt="emoji" 
                          style={{marginLeft:'47px', marginTop:'5px'}} 
                          />
                        )}
                    </MessageModalContainer>
                    )}
                  </MessageLayout>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
    );
};


const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  flex-grow: 1;
  background-color: #E3E4EB;
  `;

  const MessageLayout = styled.div<{ isSender: boolean }>`
  display: flex;
  flex-direction: row;
  align-self: ${({ isSender }) => isSender ? 'flex-end' : 'flex-start'}; //발신메세지 오른쪽, 수신메세지 왼쪽
  margin: ${({ isSender }) => isSender ? `0 15px 0 0` : `0 0 0 15px`};
  background-color: transparent;
  margin-bottom: 12px;
  max-width: 80%;
  word-break: break-word;
`;

const MessageItem = styled(motion.div)<{ isSender: boolean }>`
  background-color: ${({ isSender }) => isSender ? '#DCF8C6' : '#F0F0F0'};
  padding: 10px 15px;
  border-radius: 12px;
  font-size: 15px;
  color: #262626;
  word-break: break-word;
  user-select: none; //긁어도 선택안되게

   transition: transform 0.2s ease;
  &:active {
    transform: scale(0.95);
  }
`;

const Timestamp = styled.div<{ isSender: boolean }>`
  font-size: 13px;
  color: #63666A;
  white-space: nowrap;
  align-self: flex-end; 
  margin: ${({ isSender }) => isSender ? `0 8px 0 0` : `0 0 0 8px`};
`;

const DateLabel = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 22px;
  margin-bottom: 16px;
  font-size: 15px;
  color: #63666A;
`;

const ProfilePic = styled.img<{ visible?: boolean }>`
  width: 37px; 
  height: 37px; 
  border-radius: 50%;
  margin-right: 10px;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;
const MessageModalContainer = styled.div<{ isSender: boolean }>`
display: flex;
flex-direction: column;
align-items: ${({ isSender }) => (isSender ? 'flex-end' : 'flex-start')}};
`;
const ReceiverMessageContainer = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;
const SenderMessageContainer = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const EmojiIcon = styled.img`
background-color: #EAEBF1;
width: 16px;
height: 16.17px;
padding: 3px;
border-radius: 100%;
background-color: '#EAEBF1';

`;
export default ChatMessages;