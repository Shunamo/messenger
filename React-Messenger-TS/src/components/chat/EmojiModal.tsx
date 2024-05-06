import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface EmojiModalProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  selectedEmojiUrl: string | null;
}
const emojis = [
  { id: "love", url: "/assets/Property 1=love.png" },
  { id: "thumbsUp", url: "/assets/Property 1=thumbs up.png" },
  { id: "checked", url: "/assets/Variant6.png" },
  { id: "haha", url: "/assets/Property 1=_haha.png" },
  { id: "angry", url: "/assets/Property 1=angry.png" },
];


const EmojiModal: React.FC<EmojiModalProps> = ({ onEmojiSelect, onClose, selectedEmojiUrl }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <ModalBackground 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1.0 }}
      exit={{ opacity: 0, scale: 2.0 }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
      >
      <ModalContent 
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        ref={modalRef} 
        onClick={(e) => e.stopPropagation()}>
        {emojis.map((emoji) => (
          <Emoji 
          key={emoji.id} 
          onClick={() => onEmojiSelect(emoji.url)} 
          selected={selectedEmojiUrl === emoji.url || selectedEmojiUrl === null}          
          whileTap={{ scale: 0.9 }}
          >
            <img src={emoji.url} alt={emoji.id} />
          </Emoji>
        ))}
      </ModalContent>
    </ModalBackground>
  );
};

export default EmojiModal;

const ModalBackground = styled(motion.div)` 
  position: relative;
  margin-top: 8px;
  margin-left: 47px
`;

const ModalContent = styled(motion.div)`  width: 152px;
  height: 34.17px;
  background-color: #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const Emoji = styled(motion.div)<{ selected: boolean }>`
  cursor: pointer;
  width: 16px;
  height: 16.17px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  img {
    width: 100%;
    height: 100%;
  }
  opacity: ${({ selected }) => (selected ? '1' : '0.3')};//선택된이모지만 선명
  &:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
`;