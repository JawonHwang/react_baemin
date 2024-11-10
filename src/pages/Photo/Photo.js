
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import List from './List';
import Write from './Write';
import Update from './Update';
import Detail from './Detail';
import SideBar from './SideBar/SideBar';
import 'primeicons/primeicons.css';
import style from "./Photo.module.css";

const Photo = () => {

    return (
        <div className={style.photoContainer}>
            <div className={style.sideBar}>
                <SideBar></SideBar>
            </div>
            <div className="container">
                <Routes>
                    <Route path="/" element={<List />} />
                    <Route path="/write" element={<Write />} />
                    <Route path="/update/:photoId" element={<Update />} />
                    <Route path="/detail/:photoId" element={<Detail />} />
                </Routes>
            </div>
        </div>
    );
}
export default Photo;
