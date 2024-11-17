
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from './SideBar/CalendarSlide';
import style from "./Calendar.module.css";
import 'primeicons/primeicons.css';
import Calendar from './Calendar';

function CalendarMain() {
    return (
        <div className={style.Container}>
            <div className={style.sideBar}>
                <SideBar></SideBar>
            </div>
            <div className="container">
                <Routes>
                    <Route path="/" element={<Calendar />} />
                </Routes>
            </div>
        </div>
    )
}

export default CalendarMain;