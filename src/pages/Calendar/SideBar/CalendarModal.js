import * as React from 'react';
import styles from "./CalendarSlide.module.css";
import { LoginContext } from "../../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/esm/locale';
import format from 'date-fns/format';
import axios from 'axios';

let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

const Modal = ({ showModal, setShowModal, selectedDate, onEventAdded }) => {
    const { loginID } = React.useContext(LoginContext);

    const [calendarTypes, setCalendarTypes] = React.useState([]);
    const [formData, setFormData] = React.useState({
        calMemId: loginID || "",
        calTitle: "",
        calContents: "",
        calStartTime: new Date(todayStr),
        calEndTime: new Date(todayStr),
        calTypeId: "",
    });

    React.useEffect(() => {
        axios.get("/api/calendar/type")
            .then((res) => setCalendarTypes(res.data))
            .catch((err) => console.error("Failed to fetch calendar types:", err));
    }, []);

    React.useEffect(() => {
        if (selectedDate && selectedDate.start && selectedDate.end) {
            setFormData(prev => ({
                ...prev,
                calStartTime: new Date(selectedDate.start),
                calEndTime: new Date(selectedDate.end),
            }));
        }
    }, [selectedDate]);

    if (!showModal) return null;

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            calMemId: loginID || "",
            calTitle: "",
            calContents: "",
            calStartTime: new Date(todayStr),
            calEndTime: new Date(todayStr),
            calTypeId: "",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.calTitle.trim() || !formData.calContents.trim()) {
            alert('제목과 내용을 입력해 주세요.');
            return;
        }
        if (formData.calStartTime > formData.calEndTime) {
            alert('시작일이 종료일보다 늦습니다.');
            return;
        }

        // 날짜를 서버 형식에 맞게 변환
        const formattedData = {
            ...formData,
            calStartTime: format(formData.calStartTime, 'yyyy-MM-dd HH:mm:ss'),
            calEndTime: format(formData.calEndTime, 'yyyy-MM-dd HH:mm:ss'),
        };

        // console.log(formattedData);
        axios.post("/api/calendar", formattedData)
            .then(() => {
                setShowModal(false);
                onEventAdded();
            })
            .catch((error) => {
                console.error("Error submitting the form: ", error);
            });

        setFormData({
            calMemId: loginID || "",
            calTitle: "",
            calContents: "",
            calStartTime: new Date(todayStr),
            calEndTime: new Date(todayStr),
            calTypeId: "",
        });
    };

    return (
        <div id="modalOverlay" className={styles.modalOverlay} onClick={(e) => { if (e.target.id === "modalOverlay") closeModal(); }}>
            <div className={styles.modal}>
                <div className={styles.scheduleTitle}>일정 추가</div>
                <div className={styles.ModalBody}>
                    <ul>
                        <li>
                            <span>캘린더</span>
                            <div className={styles.select}>
                                <select
                                    name="calTypeId"
                                    value={formData.calTypeId}
                                    onChange={handleChange}
                                >
                                    <option value="">캘린더 종류 선택</option>
                                    {calendarTypes.map((type) => (
                                        <option key={type.calTypeId} value={type.calTypeId}>
                                            {type.calType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>
                        <li>
                            <span>일정 제목</span>
                            <div className={styles.input}>
                                <input
                                    type="text"
                                    name="calTitle"
                                    value={formData.calTitle}
                                    onChange={handleChange}
                                />
                            </div>
                        </li>
                        <li>
                            <span>시작</span>
                            <div className={styles.start}>
                                <DatePicker
                                    locale={ko}
                                    dateFormat="yyyy-MM-dd"
                                    className={styles.datepicker}
                                    name="calStartTime"
                                    minDate={new Date()}
                                    selected={formData.calStartTime}
                                    onChange={date => setFormData({ ...formData, calStartTime: date })}
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                        </li>
                        <li>
                            <span>종료</span>
                            <div className={styles.end}>
                                <DatePicker
                                    locale={ko}
                                    dateFormat="yyyy-MM-dd"
                                    className={styles.datepicker}
                                    name="calEndTime"
                                    minDate={formData.calStartTime || new Date()}
                                    selected={formData.calEndTime}
                                    onChange={date => setFormData({ ...formData, calEndTime: date })}
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                        </li>
                        <li>
                            <span>내용</span>
                            <div className={styles.contents}>
                                <textarea
                                    name="calContents"
                                    value={formData.calContents}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </li>
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