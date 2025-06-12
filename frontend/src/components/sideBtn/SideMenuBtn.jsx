import React, { useState } from 'react';
import AlarmViewModule from "./AlarmViewModule";
import SideAlarmBtn from './SideAlarmBtn.jsx';
import SideCartBtn from './SideCartBtn.jsx';
import SideChatBtn from './SideChatBtn.jsx';

function SideMenuBtn () {
   // const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
   // const [isChatModalOpen, setIsModalOpen] = useState(false);

   // const toggleAlarmModal = () => {
   //    setIsAlarmModalOpen(isAlarmModalOpen => !isAlarmModalOpen);
   // };
   // const toggleChatModal = () => {
   //    setIsModalOpen(isChatModalOpen => !isChatModalOpen);
   // }
    

   return (
      <div className="sideMenu">
         <a href="" className="sideMenuBtn up" onClick={(e) => {
            e.preventDefault(); // 페이지가 새로고침 되거나 하는 걸 막는 용도
            window.scrollTo({
               top: 0,
               // behavior: 'smooth'
            })
         }}>
            <img src="/image/icon/icon-up-arrow.png" alt="up"
               className="sideBtnIcon" />
         </a>
         
         <SideAlarmBtn />

         <SideCartBtn />

         <SideChatBtn />

      </div>
   );
};

export default SideMenuBtn;