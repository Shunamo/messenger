import { atom } from 'recoil';
import messagesData from '../fakedata/messages.json';

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: string; 
}

const loadMessagesFromLocalStorage = () => {
  const messagesString = localStorage.getItem('messages');
  const messagesFromLocalStorage = messagesString ? JSON.parse(messagesString) : [];
  //처음 가짜데티어랑 내가 추가로 입력한거랑 합침
  const combinedMessages = [...messagesData, ...messagesFromLocalStorage];

  // id기준으로 중복 메세지 제거
  const uniqueMessages = Array.from(new Map(combinedMessages.map(msg => [msg.id, msg])).values());
  return uniqueMessages;

};


export const messagesState = atom<Message[]>({
  key: 'messagesState',
  default: loadMessagesFromLocalStorage(),
});
