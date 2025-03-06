import React, { useState } from 'react';
import AlarmViewModule from "./AlarmViewModule";

function SideMenuBtn () {
   const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
   const [isChatModalOpen, setIsModalOpen] = useState(false);

   const toggleAlarmModal = () => {
      setIsAlarmModalOpen(isAlarmModalOpen => !isAlarmModalOpen);
   };
   const toggleChatModal = () => {
      setIsModalOpen(isChatModalOpen => !isChatModalOpen);
   }
    

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

         <a href="" role="button" className="sideMenuBtn" onClick={(e) => {
            e.preventDefault();
            toggleAlarmModal();
         }}>
            <em className="iconCount" id="alarm-cnt">0</em>
            <img src="/image/icon/icon-bell.png" alt="alarm"
               className="sideBtnIcon"
            />
         </a>
         {isAlarmModalOpen && 
            <div className="modal-overlay">
               <div className="modal-content">
                  <AlarmViewModule />
               </div>
            </div>
         }
         

         <a href="" role="button" className="sideMenuBtn" onClick={(e) => {
            e.preventDefault();
            toggleChatModal();
         }}>
            <em className="iconCount" id="shopping-bag-cnt">0</em>
            <img src="/image/icon/icon-shopping-bag.png" alt="shopping-bag"
               className="sideBtnIcon"
            />
         </a>
         {isChatModalOpen && 
            <div className="modal-overlay">
               <div className="modal-content">

               </div>
            </div>
         }

         <a href="" role="button" className="sideMenuBtn" onClick={(e) => {
            e.preventDefault();
            toggleChatModal();
         }}>
            <em className="iconCount" id="chat-cnt">0</em>
            <img src="/image/icon/icon-chat2.png" alt="chat"
               className="sideBtnIcon" id="chatIcon"
            />
         </a>

      </div>
   );
};

export default SideMenuBtn;