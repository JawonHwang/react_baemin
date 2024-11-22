
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from './SideBar/CalendarSlide';
import style from "./Calendar.module.css";
import 'primeicons/primeicons.css';
import Calendar from './Calendar';

function CalendarMain({ refreshList }) {
    return (
        <div className={style.Container}>
            <div className={style.sideBar}>
                <SideBar refreshList={refreshList} />
            </div>
            <div className={style.mainContent}>
                <Routes>
                    <Route path="/" element={<Calendar />} />
                </Routes>
            </div>
        </div>
    )
}

export default CalendarMain;