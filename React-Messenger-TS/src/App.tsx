import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil'; 
import ChatList from './components/list/ChatList';
import ChatApp from './components/main/ChatApp'; 
import FriendList from './components/list/FriendList';
import GlobalStyle from './components/style/GlobalStyle';
import MyPage from './components/list/MyPage'
import PhoneCall from './components/list/PhoneCall';
import ActiveCall from './components/list/ActiveCall';



const AnimatedRoutes = () => {
  const location = useLocation();  // 현재 위치를 가져옴
  const [phoneNumber, setPhoneNumber] = useState(""); 

  
  
  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ChatList />} />
        <Route path="/chat/:userId" element={<ChatApp />} />
        <Route path="/friends" element={<FriendList />} />
        <Route path="/mypage" element={<MyPage/>}/>
        <Route path="/phone" element={<PhoneCall/>}/>
        <Route path="/active-call" element={  <ActiveCall phoneNumber={phoneNumber} />} />
      </Routes>
    </AnimatePresence>
  );
};



const App: React.FC = () => {
  
  return (
    <RecoilRoot>
      <Router>
        <GlobalStyle />
        <AnimatedRoutes />
      </Router>
    </RecoilRoot>
  );
};

export default App;
