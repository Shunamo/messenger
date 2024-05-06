import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { usersState } from '../state/userState'; 

interface ActiveCallProps {
  phoneNumber?: string;
}

const ActiveCall: React.FC<ActiveCallProps>  = ({ phoneNumber }) => {
    const location = useLocation(); 
    const navigate = useNavigate();
    const users = useRecoilValue(usersState);
    const phone = phoneNumber || location.state?.phoneNumber;
    const [isAudioActive, setAudioActive] = useState(false); //이미지 토글을위한변수
    const [isMuteActive, setMuteActive] = useState(false);


    console.log("phoneNumber:", phone);
    console.log("location.state.phoneNumber:", location.state?.phoneNumber);

    const handleEndCall = () => {
        navigate(-1); //나가기 ㅋ
        };

     // 사용자의 핸드폰 번호에서 "+82 "를 제거하고 공백을 하이픈으로 대체
    const processUserPhoneNumber = (userPhoneNumber: string): string => {
      return userPhoneNumber.replace('+82 ', '').replace(/\s/g, '-');
  };

  // 연락처에서 전화번호와 일치하는 사용자의 이름 찾기
  const findUserNameByPhoneNumber = (phoneNumber: string): string | undefined => {
    const processedPhoneNumber = processUserPhoneNumber(phoneNumber);
    console.log("Processed incoming phone number:", processedPhoneNumber);
    users.forEach(user => {
        const processedUserPhone = processUserPhoneNumber(user.phoneNumber);
        console.log(`User: ${user.name}, Phone: ${user.phoneNumber}, Processed: ${processedUserPhone}`);
    });

    const userName = users.find(user => processUserPhoneNumber(user.phoneNumber) === processedPhoneNumber)?.name;
    console.log("User Name found:", userName);
    return userName;
};
  // 사용자의 이름 찾기
  
  const userName = findUserNameByPhoneNumber(phone) || phone;

  console.log("Final User Name Display:", userName);


    return (
      <Container>
      <AppContainer>
        <IphoneHeader src='/assets/Status Bar.svg'/>
        <StatusContainer>
          <StatusText>휴대전화 연결 중...</StatusText>
          <PhoneNumberDisplay>{userName}</PhoneNumberDisplay>
        </StatusContainer>
        <ButtonContainer>
            <ButtonWrapper onClick={() => setAudioActive(prev => !prev)}>
              <Button src={isAudioActive ? "/assets/sound-active.png" : "/assets/sound.png"} alt="audio"/>
              <ButtonLabel>오디오</ButtonLabel>
            </ButtonWrapper>
            <ButtonWrapper onClick={handleEndCall}>
              <Button src="/assets/EndCall.png" alt="End call"/>
              <ButtonLabel>종료</ButtonLabel>
            </ButtonWrapper>
            <ButtonWrapper onClick={() => setMuteActive(prev => !prev)}>
              <Button src={isMuteActive ? "/assets/mute-active.png" : "/assets/mute.png"} alt="Mute"/>
              <ButtonLabel>소리끔</ButtonLabel>
            </ButtonWrapper>
        </ButtonContainer>
        <IphoneFooter src='/assets/Home Indicator.png'/>
      </AppContainer>
    </Container>
  );
};
    
    export default ActiveCall;
    
    
    const IphoneHeader = styled.img``;
    const IphoneFooter = styled.img`width: 100%`;


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
      align-items: center; 
      background: linear-gradient(to bottom, #5D6063 0%, #353A40 100%);

      @media (min-width: 768px) { 
        max-width: 375px;
        max-height: 812px;
        min-height: 812px;
        height: auto;
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    `;

    const StatusContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
margin-top: 74px;
  
`;

const StatusText = styled.span`
font-size: 19px;
font-weight: 600;
color: #8D949E;
margin-bottom: 12px;
`;

const PhoneNumberDisplay = styled.span`
  color: white;
  font-weight: 700;
  font-size: 32px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: 55px;
`;

const Button = styled.img`
  border: none;
  border-radius: 50%;
  width: 74px;
  height: 73px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }

`;


const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonLabel = styled.span`
  margin-top: 8px;
  font-size: 15px;
  color: #FFFFFF;
`;