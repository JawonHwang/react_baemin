
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import List from './List';
import Write from './Write';
import Update from './Update';
import Detail from './Detail';
import SideBar from './SideBar/SideBar';
import style from "./Board.module.css";
import 'primeicons/primeicons.css';

function Board() {
    return (
        <div className={style.boardContainer}>
            <div className={style.sideBar}>
                <SideBar></SideBar>
            </div>
            <div className="container">
                <Routes>
                    <Route path="/" element={<List />} />
                    <Route path="/write" element={<Write />} />
                    <Route path="/update/:boardId" element={<Update />} />
                    <Route path="/detail/:boardId" element={<Detail />} />
                </Routes>
            </div>
        </div>
    )
}

export default Board;