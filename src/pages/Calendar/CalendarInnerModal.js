import React from 'react'
import styles from './Calendar.module.css'
import { format, parseISO, subDays } from 'date-fns';
import axios from 'axios';


const CalendarInnerModal = ({ isOpen, onClose, eventDetails, onEventAdded }) => {
    if (!isOpen) return null;

    const closeModal = (e) => {
        if (e.target.id === "modalOverlay") {
            onClose();
        }
    };
    const formatDate = (date, isEndDate = false) => {
    let parsedDate = parseISO(date);
    // 종료 날짜에 대해서는 항상 하루를 빼준다.
    if (isEndDate) {
        parsedDate = subDays(parsedDate, 1);
    }
    return format(parsedDate, 'yyyy년 MM월 dd일');
    };

    const formatWrite = (date) => {
        return format(parseISO(date), "yyyy년 MM월 dd일 HH시 mm분");
    }
    const handleDelete = (e) => {
        e.preventDefault();
        axios.delete(`/api/calendar/${eventDetails.seq}`).then((res) => {
            onEventAdded();
            onClose();
        });
    }
    
    return (
        <div id='modalOverlay' className={styles[`modal-overlay`]} onClick={closeModal}>
            <div className={styles[`modal-container`]}>
                <div className={styles[`modal-title`]}>일정 내용</div>
                <ul>
                    {eventDetails && (
                        <>
                            <li><span>일정 제목</span> <div className={styles.modaltitle}>{eventDetails.title}</div></li>
                            <li><span>일정 시간</span> <div className={styles.modaltime}>{formatDate(eventDetails.start)} ~ {formatDate(eventDetails.end, true)}</div></li>
                            <li><span>일정 등록일</span> <div className={styles.modalwrite}>{formatWrite(eventDetails.write_date)}</div></li>
                            <li><span>일정 내용</span> <div className={styles.modalcontents}>{eventDetails.contents}</div></li>    
                        </>
                    )}
                </ul>
                <div className={styles[`modal-buttons`]}>
                    <button className={styles.check} onClick={onClose}>확인</button>
                    <button className={styles.delete} onClick={handleDelete}>삭제</button>
                </div>
            </div>
        </div>
    );
};

export default CalendarInnerModal;