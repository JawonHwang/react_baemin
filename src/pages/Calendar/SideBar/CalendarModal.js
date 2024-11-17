import * as React from 'react';
import styles from "./CalendarSlide.module.css";
import { LoginContext } from "../../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ko} from 'date-fns/esm/locale';
import axios from 'axios';

let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today


const Modal = ({ showModal, setShowModal, selectedDate, onEventAdded }) => {
    const { loginID } = React.useContext(LoginContext);
    const [alarmValue, setAlarmValue] = React.useState("15분 전");
    const [showAlarm, setShowAlarm] = React.useState(false);

    const [formData, setFormData] = React.useState({
        project: "나의 프로젝트",
        title: "",
        starttime: new Date(todayStr),
        endtime: new Date(todayStr),
        alarm: "15분 전",
        contents: "",
    });
    React.useEffect(() => {
    if (selectedDate && selectedDate.start && selectedDate.end) {
        const startDate = new Date(selectedDate.start);
        const endDate = new Date(selectedDate.end);

        // 'Invalid Date' 객체가 생성되는지 확인합니다.
        if (!isNaN(startDate) && !isNaN(endDate)) {
            setFormData(prev => ({
                ...prev,
                starttime: startDate,
                endtime: endDate
            }));
        }
    }
}, [selectedDate]);

    if (!showModal) return null;

    const closeModal = () => {
        setShowModal(false);
        // Reset the form data
        setFormData({
            project: "나의 프로젝트",
            title: "",
            starttime: new Date(todayStr),
            endtime: new Date(todayStr),
            alarm: "15분 전",
            contents: "",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.contents.trim()) {
        alert('제목과 내용을 입력해 주세요.');
        return;
        }
    if (formData.starttime > formData.endtime) {
        alert('시작일이 종료일보다 늦습니다.');
        return;
    }
    axios.post("/api/calendar", formData)
        .then((res) => {
            setShowModal(false);
            onEventAdded();
        }).catch((error) => {
            console.error("There was an error submitting the form: ", error);
        });
    setFormData({
        project: "나의 프로젝트",
        title: "",
        starttime: new Date(todayStr),
        endtime: new Date(todayStr),
        alarm: "15분 전",
        contents: "",
    });
    }
    const alarmalert = (e) => {
        alert("아직 지원하지 않는 기능입니다.");
        setShowAlarm(!showAlarm);
        e.preventDefault();
    }




    return (
        <div id="modalOverlay" className={styles.modalOverlay} onClick={(e) => { if(e.target.id === "modalOverlay") closeModal(); }}>
            <div className={styles.modal}>
                <div className={styles.scheduleTitle}>일정 추가</div>
                <div className={styles.ModalBody}>
                    <ul>
                        <li><span>캘린더</span>
                        <div className={styles.select}><select name="project">
                            <option>나의 프로젝트</option>
                        </select></div></li>
                        <li><span>일정 제목</span>
                        <div className={styles.input}><input type="text" name="title" value={formData.title} onChange={handleChange} /></div></li>
                        <li><span>시작</span>
                            <div className={styles.start}>
                                <DatePicker
                                    locale={ko}
                                    dateFormat="yyyy-MM-dd"
                                    className={styles.datepicker}
                                    name='starttime'
                                    minDate={new Date()}
                                    closeOnScroll={true}
                                    selected={formData.starttime}
                                    onChange={date => setFormData({ ...formData, starttime: date })}
                                    onKeyDown={(e) => e.preventDefault()}
                                /></div></li>
                        <li><span>종료</span>
                            <div className={styles.end}>
                                <DatePicker
                                    locale={ko}
                                    dateFormat="yyyy-MM-dd"
                                    className={styles.datepicker}
                                    name='endtime'
                                    minDate={new Date()}
                                    closeOnScroll={true}
                                    selected={formData.endtime}
                                    onChange={date => setFormData({ ...formData, endtime: date })}
                                    onKeyDown={(e) => e.preventDefault()}
                                /></div></li>
                        <li><span>알림</span>
                            <div className={styles.alarm}><input type="checkbox" name="alarm" onClick={e=> alarmalert(e)} checked={showAlarm} onChange={() => setShowAlarm(!showAlarm)} /><span>메일</span>
                                <select name="alarm" defaultValue={alarmValue}>
                                    <option value="정시">정시</option>
                                    <option value="5분 전">5분 전</option>
                                    <option value="10분 전">10분 전</option>
                                    <option value="15분 전">15분 전</option>
                                    <option value="30분 전">30분 전</option>
                                    <option value="1시간 전">1시간 전</option>
                                    <option value="하루 전">하루 전</option>
                                </select></div></li>
                        <li><span>내용</span>
                        <div className={styles.contents}><textarea name="contents" value={formData.contents} onChange={handleChange}></textarea></div></li>
                    </ul>
                </div>
                <div className={styles.buttonbox}>
                    <button className={styles.submitButton} onClick={handleSubmit}>추가</button>
                    <button className={styles.cancelButton} onClick={closeModal}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
