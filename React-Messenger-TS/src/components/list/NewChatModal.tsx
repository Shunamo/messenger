import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserType[];
  onUserSelect: (userId: number) => void;
}

interface UserType {
  id: number;
  name: string;
  profileImage: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, users, onUserSelect }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalHeader>친구 선택</ModalHeader>
        <ModalContent>
        {users.filter(user => user.id !== 0).map(user => (            <UserItem key={user.id} onClick={() => onUserSelect(user.id)}>
              <UserImage src={user.profileImage} alt={user.name} />
              <UserName>{user.name}</UserName>
            </UserItem>
          ))}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

`;

const ModalContainer = styled.div`
position: relative;
  font-family: Pretenard;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 280px;
`;

const ModalHeader = styled.h2`
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 700;
`;

const ModalContent = styled.div`
  max-height: 300px;
  overflow-y: auto;

`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

const UserName = styled.div`
font-weight: 600;

`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #707070;
  &:hover {
    color: #000000;
  }
`;
