import React from 'react';
import styled from 'styled-components';

interface IphoneFooterProps {
    src: string;
    backgroundColor?: string;
  }

const IphoneFooter: React.FC<IphoneFooterProps> = ({ src, backgroundColor }) => {
    return <IphoneFooterImg src={src} alt="iPhone Header" backgroundColor={backgroundColor} />;
  };
  
  export default IphoneFooter;

  
const IphoneFooterImg = styled.img<{ backgroundColor?: string }>`
display: block;
width: 100%; 
height: auto; 
max-width: 375px;
margin: 0 auto; 
background-color: #F7F8FC;
border-radius: 0 0 30px 30px ;
background-color: ${({ backgroundColor }) => backgroundColor || '#F7F8FC'}; // 기본값은 하얀색

@media (max-width: 768px) {
  display: none; 
}
`;
