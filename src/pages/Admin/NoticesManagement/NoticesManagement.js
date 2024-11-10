import React, { useState, useEffect } from 'react';
import style from "./NoticesManagement.module.css";
import { Button } from 'primereact/button';
import { Link, useLocation } from 'react-router-dom';

const NoticesManagement = () => {
    

    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>공지사항 관리</div>
                <div className={style.buttons}>
                    <Link to="/baemin/admin/toNoticesAdd"><Button type="button" className={style.radius50} icon="pi pi-plus" rounded outlined severity="info" /></Link>
                    <Link to="/baemin/admin/toNoticesCategoryAdd"><Button type="button" className={style.radius50} rounded outlined severity="info">분류 관리</Button></Link>
                </div>
            </div>
            
            <hr></hr>
            
        </div>
    );
}

export default NoticesManagement;