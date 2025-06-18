import React, { useState, useEffect } from 'react';
import useNotifications from "../../Hooks/useNotifications";
import AlarmViewModule from "./AlarmViewModule";
import SideAlarmBtn from './SideAlarmBtn.jsx';
import SideCartBtn from './SideCartBtn.jsx';
import SideChatBtn from './SideChatBtn.jsx';

function SideMenuBtn () {
   const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
   const [isChatModalOpen, setIsModalOpen] = useState(false);

   const {notifications, unreadCount, markAsRead, markAllAsRead} = useNotifications(
           "http://localhost",
           "customer"
       );

   const toggleAlarmModal = () => {
      setIsAlarmModalOpen(isAlarmModalOpen => !isAlarmModalOpen);
   };
   const toggleChatModal = () => {
      setIsModalOpen(isChatModalOpen => !isChatModalOpen);
   }
    
   const [isVisible, setIsVisible] = useState(false);

   // useEffect(() => {
   //    const handleScroll = () => {
   //       setIsVisible(window.scrollY > 130);
   //    };

   //    window.addEventListener('scroll', handleScroll);
   //    return () => window.removeEventListener('scroll', handleScroll);
   // }, []);

   useEffect(() => {
      const handleScroll = () => {
        setIsVisible(window.scrollY > 240);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

   return (
      // <div className={`sideMenu ${isVisible ? 'visible' : ''}`}>
      //    <a href="" className="sideMenuBtn up" onClick={(e) => {
      //       e.preventDefault();
      //       window.scrollTo({ top: 0, behavior: 'smooth' });
      //    }}>
      //       <img src="/image/icon/icon-up-arrow.png" alt="up" className="sideBtnIcon" />
      //    </a>

      //    <SideAlarmBtn />
      //    <SideCartBtn />
      //    <SideChatBtn />
      // </div>
      <div className="sideMenu">
      {isVisible && (
        <a
          href=""
          className="sideMenuBtn up"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img
            src="/image/icon/icon-up-arrow.png"
            alt="up"
            className="sideBtnIcon"
          />
        </a>
      )}

      <SideAlarmBtn
        notifications={notifications}
        markAllAsRead={markAllAsRead}
        markAsRead={markAsRead}
        unreadCount={unreadCount}
      />
      <SideCartBtn />
      <SideChatBtn />
    </div>
   );
};

export default SideMenuBtn;