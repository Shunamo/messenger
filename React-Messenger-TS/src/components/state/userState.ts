import { atom } from 'recoil';
import usersData from '../fakedata/users.json'; // users.json 파일 불러옴

export interface User {
  id: number;
  name: string;
  profileImage: string;
  phoneNumber: string;
}

export const usersState = atom<User[]>({
  key: 'usersState',
  default: usersData,
});
