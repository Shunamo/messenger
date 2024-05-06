import React from 'react';
import styled from 'styled-components';
import IphoneHeader from '../main/IphoneHeader';
import IphoneFooter from '../main/IphoneFooter';
import MyPageHeader from './MyPageHeader';


const MyPage = () => {
   
  
  const INSTAGRAM_URL = 'https://instagram.com/dreamforxou/';
  const YOUTUBE_URL = 'https://www.youtube.com/@user-ul9qv5cc8m';
  
  const handleInstagramClick = () => {
    window.location.href = INSTAGRAM_URL;
  };
  
  const handleYoutubeClick = () => {
    window.location.href = YOUTUBE_URL;
  };
  return (
    <Container>
      <AppContainer>
        <IphoneHeader src='/assets/Status Bar.svg' backgroundColor='#F7F8FC'/>
        <MyPageHeader/>
        <ProfileContainer>
          <EditProfileLabel>프로필 수정</EditProfileLabel>
          <EditProfileLabel>바로가기</EditProfileLabel>
          <SNSContainer>
            <Logogroup onClick={handleInstagramClick}>
              <SNSLogo src="/assets/Instagram.png"/>
              <Label>Instagram</Label>
            </Logogroup>
            <Clip src="/assets/Clip.svg" onClick={handleInstagramClick}/>
          </SNSContainer>
          <SNSContainer>
            <Logogroup onClick={handleYoutubeClick}>
              <SNSLogo src="/assets/YouTube.png"/>
              <Label>Youtube</Label>
            </Logogroup>
            <Clip src="/assets/Clip.svg" onClick={handleInstagramClick}/>
          </SNSContainer>
        </ProfileContainer>
        <IphoneFooter src='/assets/Home Indicator.png' backgroundColor='#ffffff'/>
      </AppContainer>
    </Container>
  );
};


export default MyPage;

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

const ProfileContainer = styled.div`
display:flex;
padding-top: 31px;
flex-direction: column;
height: calc(100vh - 31px);
`;

const EditProfileLabel = styled.span`
  font-family: Pretenard;
  font-size: 17px;
  font-weight: 600;
  color: #1F1F1F;
  margin-left: 15px;
  margin-bottom: 24px;
  `;

const SNSLogo = styled.img`
  width: 37px;
  height:37px;
  margin-left: 16px;
   
`;

const Logogroup = styled.div`
display: flex;
align-items: center;
cursor: pointer;
`;
const Label = styled.span`
font-size: 17px;
font-weight: 500;
margin-left: 17px;
`;

const SNSContainer = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 24px;
`;

const Clip = styled.img`
margin-right: 11px;
cursor: pointer;
`;