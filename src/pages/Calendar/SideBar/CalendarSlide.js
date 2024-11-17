import React, { useEffect, useState, useContext } from "react";    
import styled from "styled-components";
import style from "../SlideBar.module.css";
import styles from "./CalendarSlide.module.css";
import Modal from "./CalendarModal"
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const CalendarWrite = ({refreshList}) => {
    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        if(!showModal) {
            refreshList();
        }
     }, [showModal]);

    return (
        <div className={styles.calendarslideBody}>
            <button className={style.btn} onClick={() => setShowModal(true)}>
                <strong>+ 일정 추가</strong>
            </button>
            <Modal showModal={showModal} setShowModal={setShowModal} onEventAdded={refreshList}/>
            <div className={styles.Calendar}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar showDaysOutsideCurrentMonth fixedWeekNumber={6} />
                </LocalizationProvider>
            </div>
            <div className={styles.MyCalendar}>
            </div>
        </div>
    );
};

const CalendarSlide = ({refreshList}) => {
    return (
        <div className={style.Calendar}>
            <CalendarWrite refreshList={refreshList}/>
        </div>
    );
};

export default CalendarSlide;