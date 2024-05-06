import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { messagesState, Message } from '../state/messageState';
import { selectedUserState } from '../state/selectedUserState';
import styled from 'styled-components';

const plusIcon = "/assets/icon.png";
const emojiIcon = "/assets/icon (1).png";
const cameraIcon = "/assets/icon (2).png";
const recordIcon = "/assets/icon (3).png";
const sendIcon = "/assets/send icon.png";

interface InputBoxProps {
    expanded: boolean;
  }
interface InputContainerProps {
    expanded: boolean;
  }

const saveMessagesToLocalStorage = (messages: Message[]): void => {
    localStorage.setItem('messages', JSON.stringify(messages));
  };
  
const ChatInput: React.FC = () => {
    const [expanded, setExpanded] = useState(false); //인풋칸 클릭시 확장되기위해 변수 설정
    const containerRef = useRef<HTMLDivElement>(null); //ChatInput 컴포넌트 전체에 대해서 참조 생성!!
    const [message, setMessage] = useState<string>('');
    const setMessageList = useSetRecoilState(messagesState);
    const selectedUserId = useRecoilValue(selectedUserState);
    const [lastSelectedUserId, setLastSelectedUserId] = useState<number | null>(null);

    useEffect(() => {
      if (selectedUserId !== 0) {
          setLastSelectedUserId(selectedUserId);
      }
  }, [selectedUserId]);

    const send = (): void => {
      if (message.trim() !== '') {
          let senderId = 0; // 기본으로 0이 발신자
          let receiverId = selectedUserId; // 선택된 사용자가 수신자

          // 토글해서 송수신자 바꿧을때
          if (selectedUserId === 0 && lastSelectedUserId !== null) {
              senderId = lastSelectedUserId; // 이전에 선택된 사용자가 발신자가 됨
              receiverId = 0; // 수신자는 0
          }

          const newMessage = {
              id: Date.now(),
              senderId: receiverId,
              receiverId: senderId,
              text: message,
              timestamp: new Date().toISOString(),
          };

          setMessageList((oldMessageList) => {
              const updatedMessages = [...oldMessageList, newMessage];
              saveMessagesToLocalStorage(updatedMessages);
              return updatedMessages;
          });
          setMessage(''); // 메시지 보낸 후 입력 필드 초기화
      }
  };
  //배경 클릭 감지 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // 현재 확장된 상태일때만 외부 누르면 다시 축소되게
        if (expanded) {
          setExpanded(false);
        }
      }
    };

    // 클릭 이벤트 리스너
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
    // 클린업 함수에서 이벤트 리스너 제거
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
        e.preventDefault();
        send();
        setMessage(''); // setInput("")와 같은 역할
    }
};

return (
    <Footer ref={containerRef}>
      <FooterContainer>
        <PlusButton src={plusIcon} alt="Plus Button" />
        <InputContainer expanded={expanded}>
        <InputBox
          onClick={() => setExpanded(true)}  
          expanded={expanded}
          value={message} 
          onChange={handleChange} // 입력값 변경 시 message 상태 업데이트
          onKeyDown={handleKeyDown}
        />
        <EmojiButton src={emojiIcon} alt="Emoji Button" />
        </InputContainer>
        {expanded ? ( //확장되면서 Footer 구조 바뀌기
          <SendButton src={sendIcon} alt="send Button" onClick={send} />
        ) : (
        <>
            <CameraButton src={cameraIcon} alt="Camera Button" />
            <RecordButton src={recordIcon} alt="Record Button" />
        </>
        )}
      </FooterContainer>
    </Footer>
  );
};

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F7F8FC;
  width: 100%;
  height: 42px;
  @media (max-width: 768px) {
    background-color: #ffffff;
  }
   `;

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F7F8FC;
  width: 100%;
  height: 42px;
  margin-top: 5px;
  margin-left: 11px;
  margin-right: 15.62px;
  @media (max-width: 768px) {
    background-color: #ffffff;
  }
`;

const InputContainer = styled.div<InputContainerProps>`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 100px;
  width: ${({ expanded }) => expanded ? '80%' : '65%'};
  height: 35px;

  transition: width 0.3s ease;
`;

const PlusButton = styled.img`
  width: 28px;
  height: 28px;
  cursor: pointer;

  transition: transform 0.1s ease; 

  &:active {
    transform: scale(0.9);
  }`;

const EmojiButton = styled.img`
  width: 25.31px;
  height: 25px;
  cursor: pointer;
  margin-right: 10.12px;

  transition: transform 0.1s ease; 

  &:active {
    transform: scale(0.9);
  }
`;

const CameraButton = styled.img`
  width: 28px;
  height: 28px;
  cursor: pointer;
  
  transition: transform 0.1s ease; 

  &:active {
    transform: scale(0.9);
  }
`;

const RecordButton = styled.img`
  width: 28px;
  height: 28px;
  cursor: pointer;
  
  transition: transform 0.1s ease; 

  &:active {
    transform: scale(0.9);
  }
`;

const SendButton = styled.img`
  width: 29px;
  height: 29px;
  cursor: pointer;
  
  transition: transform 0.1s ease; 

  &:active {
    transform: scale(0.9);
  }
`;

const InputBox = styled.input<InputBoxProps>`
  flex: 1;
  border: none;
  background-color: transparent;
  font-family:'Pretendard';
  margin-left: 16px;
  &:focus {
    outline: none;
  }

  ${({ expanded }) => expanded && `
    width: calc(100% - 29px); // SendButton의 너비만큼 빼서 원래 너비로 돌아가기
  `}
`;



export default ChatInput;