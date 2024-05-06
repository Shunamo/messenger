import React from 'react';
import styled from 'styled-components';

interface IphoneHeaderProps {
  src: string;
  backgroundColor?: string;
}



const IphoneHeader: React.FC<IphoneHeaderProps> = ({ src, backgroundColor }) => {
  return <IphoneHeaderImg src={src} alt="iPhone Header" backgroundColor={backgroundColor} />;
};

export default IphoneHeader;

const IphoneHeaderImg = styled.img<{ backgroundColor?: string }>`
  display: block;
  width: 100%; 
  height: auto; 
  max-width: 375px;
  margin: 0 auto; 
  background-color: ${({ backgroundColor }) => backgroundColor || '#ffffff'}; // 기본값은 하얀색
  border-radius: 30px 30px 0 0;

  @media (max-width: 768px) {
    display: none; 
  }
`;
