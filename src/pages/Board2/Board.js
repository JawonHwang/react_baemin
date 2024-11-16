
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Notice from './Notice/Notice';
import NoticeContent from './Notice/NoticeContent';
import FAQ from './FAQ/FAQ';
import SideBar from './SideBar/SideBar';
import style from "./Board.module.css";

const Board = () => {
    return (
        <div className={style.container}>
            <div className={style.sideBar}>
                <SideBar></SideBar>
            </div>
            <div className={style.mainContent}>
                <Routes>
                    <Route path="/" element={<Notice />}></Route>
                    <Route path="/toNoticeContent/:notId" element={<NoticeContent />}></Route>
                    <Route path="/toFAQ" element={<FAQ />}></Route>
                </Routes>
            </div>
        </div>
    );
}

export default Board;