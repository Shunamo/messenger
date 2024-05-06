// state/currentUserState.js

import { atom } from 'recoil';

export const currentUserState = atom({
  key: 'currentUserState', // 유일한 key
  default: {
    id: null, // 사용자가 로그인하지 않았을 때의 초기 값
    name: '',
    email: ''
  }
});
