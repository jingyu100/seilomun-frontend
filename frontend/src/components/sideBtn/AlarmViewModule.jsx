import React, { useState } from 'react';
import AlarmContents from "../AlarmContents.jsx";
import ProductsAlarm from '../ProductsAlarm.jsx';

function AlarmViewModule () {
       const [isModalOpen, setIsModalOpen] = useState(false);
    
       const openModal = () => {
          setIsModalOpen(true);
       };
        const closeModal = () => {
          setIsModalOpen(false);
       };

    return (
        <div className="sideAlarmModule viewModule">
            <div>
                <div className="ModuleBtns">
                </div>
                <div className="alarmModuleMain">
                    <AlarmContents product={ProductsAlarm} />                
                </div>
            </div>
        </div>
    );
};

export default AlarmViewModule;