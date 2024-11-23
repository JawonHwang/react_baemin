import React, { useEffect, useState } from "react";
import styles from "./JoinClub.module.css";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";

const DetailJoin = () => {
    const { joId } = useParams(); // URL에서 joId 추출

    // 상태 정의
    const [joName, setJoName] = useState('');
    const [joGender, setJoGender] = useState('');
    const [joContact, setJoContact] = useState('');
    const [joDept, setJoDept] = useState('');
    const [joStuId, setJoStuId] = useState('');
    const [joSkill, setJoSkill] = useState('');
    const [interview, setInterview] = useState([]);
    const [activityDate, setActivityDate] = useState([]);
    const [selectedIvId, setSelectedIvId] = useState([]); // 선택된 면접 날짜 ID
    const [selectedDateId, setSelectedDateId] = useState([]); // 선택된 활동 날짜 ID

    // 데이터 불러오기
    useEffect(() => {
        // joId를 기준으로 신청자 상세 데이터 가져오기
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/join/contents/${joId}`);
                const data = response.data;

                setJoName(data.joName);
                setJoGender(data.joGender);
                setJoContact(data.joContact);
                setJoDept(data.joDept);
                setJoStuId(data.joStuId);
                setJoSkill(data.joSkill);

                // jo_iv_ids, jo_ad_ids를 기본 선택으로 설정
                setSelectedIvId(data.joIvIds || []);
                setSelectedDateId(data.joAdIds || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // 면접 날짜 및 활동 요일 목록 가져오기
        const fetchDates = async () => {
            try {
                const [interviewRes, activityDateRes] = await Promise.all([
                    axios.get("/api/join/interview"),
                    axios.get("/api/join/activityDate")
                ]);
                setInterview(interviewRes.data);
                setActivityDate(activityDateRes.data);
            } catch (error) {
                console.error("Error fetching interview or activity dates:", error);
            }
        };

        fetchData();
        fetchDates();
    }, [joId]);

    //관리자가 신청폼을 보고 승인 또는 반려
    const handleApprove = () => {
        const isConfirmed = window.confirm("정말로 승인하시겠습니까?");
        if (isConfirmed) {
            try {
                axios.put(`/api/admin/management/nonMember/form/approve/${joId}`);
                alert("승인 되었습니다.");
            } catch (error) {
                alert("승인 실패했습니다. 개발자에게 문의 바랍니다.");
            }
            } else {
                // 사용자가 취소를 선택한 경우
                alert("승인이 취소되었습니다.");
            }
    }
    
    const handleDisapprove = () => {
        const isConfirmed = window.confirm("정말로 반려하시겠습니까?");
        if (isConfirmed) {
            try {
                axios.put(`/api/admin/management/nonMember/form/disApprove/${joId}`);
                alert("반려 되었습니다.");
            } catch (error) {
                alert("반려 실패했습니다. 개발자에게 문의 바랍니다.");
            }
            } else {
                // 사용자가 취소를 선택한 경우
                alert("반려 취소되었습니다.");
            }
    }

    return (
        <div className={styles.container}>
            <div className="flex flex-column px-8 py-5 gap-4">
                <div className="inline-flex flex-column gap-2" style={{ textAlign: 'center', fontSize: '30px', fontWeight: '700' }}>
                    동아리 가입 신청
                </div>

                <div className="inline-flex flex-column gap-2">
                    <label>이름</label>
                    <InputText value={joName} disabled className="p-3" />
                </div>
                <div className="inline-flex flex-column gap-2">
                    <label>성별</label>
                    <InputText value={joGender} disabled className="p-3" />
                </div>
                <div className="inline-flex flex-column gap-2">
                    <label>전화번호</label>
                    <InputText value={joContact} disabled className="p-3" />
                </div>
                <div className="inline-flex flex-column gap-2">
                    <label>학과</label>
                    <InputText value={joDept} disabled className="p-3" />
                </div>
                <div className="inline-flex flex-column gap-2">
                    <label>학번</label>
                    <InputText value={joStuId} disabled className="p-3" />
                </div>

                <label>면접 가능 날짜</label>
                <div className="card flex flex-wrap justify-content-center gap-3">
                    {interview.map((iv) => (
                        <div className="flex align-items-center" key={iv.ivId}>
                            <Checkbox
                                inputId={`date${iv.ivId}`}
                                value={iv.ivId}
                                checked={selectedIvId.includes(iv.ivId)}
                                disabled // 읽기 전용 설정
                            />
                            <label htmlFor={`date${iv.ivId}`} className="ml-2">{iv.ivDate}</label>
                        </div>
                    ))}
                </div>

                <label>활동 참여 가능 요일</label>
                <div className="card flex flex-wrap justify-content-center gap-3">
                    {activityDate.map((date) => (
                        <div className="flex align-items-center" key={date.adId}>
                            <Checkbox
                                inputId={`date${date.adId}`}
                                value={date.adId}
                                checked={selectedDateId.includes(date.adId)}
                                disabled // 읽기 전용 설정
                            />
                            <label htmlFor={`date${date.adId}`} className="ml-2">{date.adDate}</label>
                        </div>
                    ))}
                </div>

                <div className="inline-flex flex-column gap-2">
                    <label>배드민턴 경험 및 실력</label>
                    <InputText value={joSkill} disabled placeholder="배드민턴을 쳐 본 경험이 있다면 기간, 혹은 얼만큼 치는지!" className="p-3" />
                </div>
                <div className="flex align-items-center gap-2">
                    <Button label="승인" onClick={handleApprove} severity="info" />
                    <Button label="반려" onClick={handleDisapprove} severity="danger" />
                </div>
            </div>
        </div>
    );
}

export default DetailJoin;