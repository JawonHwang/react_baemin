import React, { useEffect, useState } from "react";
import styles from "./JoinClub.module.css";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const JoinClub = () => {
    const [joName, setJoName] = useState('');
    const [joGender, setJoGender] = useState('');
    const [joContact, setJoContact] = useState('');
    const [joDept, setJoDept] = useState('');
    const [joStuId, setJoStuId] = useState('');
    const [joSkill, setJoSkill] = useState('');
    const [activityDate, setActivityDate] = useState([]); 
    const [selectedDateId, setSelectedDateId] = useState([]);  
    const [interview, setInterview] = useState([]); 
    const [selectedIvId, setSelectedIvId] = useState([]);

    const navigate = useNavigate();

    // 핸드폰 번호 유효성 검사
    const phoneRegex = /^\d{3}\d{3,4}\d{4}$/;

    // 면접 가능 날짜 DB에서 불러오기
    useEffect(() => {
        axios.get("/api/join/activityDate")
            .then(response => {
                setActivityDate(response.data); 
            })
            .catch(err => {
                console.error("Error fetching activity dates:", err);
            });
    }, []);

    // 활동 가능 요일 DB에서 불러오기
    useEffect(() => {
        axios.get("/api/join/interview")
            .then(response => {
                setInterview(response.data); 
            })
            .catch(err => {
                console.error("Error fetching interview dates:", err);
            });
    }, []);

    // 날짜 선택 핸들러
    const onDateChange = (e) => {
        const selected = e.checked 
            ? [...selectedDateId, e.value]
            : selectedDateId.filter(id => id !== e.value);
        setSelectedDateId(selected);
    };

    const onIvChange = (e) => {
        const selected = e.checked 
            ? [...selectedIvId, e.value]
            : selectedIvId.filter(id => id !== e.value);
        setSelectedIvId(selected);
    };
    //가입신청 수 통계 데이터
    const increaseNewMemberCount = async () => {
        try {
          const response = await axios.get('/api/admin/todayNewMember');
          if (response.data) {
            // 해당 데이터의 가입신청 수 증가 요청 (PUT 요청)
            await axios.put(`/api/admin/incrementNewMember/${response.data.id}`);
          } else {
            // 오늘 날짜의 데이터가 없는 경우 새로운 데이터 삽입 (POST 요청)
            await axios.post('/api/admin/createNewMember');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    const handleRegister = () => {
        if (!phoneRegex.test(joContact)) {
            alert("전화번호 형식이 올바르지 않습니다. 예: 01012345678");
            return;
        }

        if (selectedDateId.length === 0 || selectedIvId.length === 0) {
            alert("최소 한 개 이상의 날짜를 선택해주세요.");
            return;
        }

        // 선택된 날짜 배열을 쉼표로 구분된 문자열로 변환
        const selectedDateStr = selectedDateId.join(','); // 활동 가능 날짜 ID 배열을 문자열로 변환
        const selectedIvStr = selectedIvId.join(',');     // 면접 가능 날짜 ID 배열을 문자열로 변환

        const formData = {
            joName: joName,
            joGender: joGender,
            joContact: joContact,
            joDept: joDept,
            joStuId: joStuId,
            joSkill: joSkill,
            joIvIds: selectedIvStr, 
            joAdIds: selectedDateStr 
        };

        axios.post("/api/join/club", formData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(() => {
            increaseNewMemberCount();
            alert("가입 신청이 성공적으로 완료되었습니다.");
            navigate("/baemin");  // 가입 성공 시 /baemin 페이지로 리다이렉트
        })
        .catch(err => {
            alert("가입 신청에 실패했습니다. 정보를 다시 확인해주세요.");
        });
    };

    return (
        <div className={styles.container}>
            <div className="flex flex-column px-8 py-5 gap-4">
                <div className="inline-flex flex-column gap-2" style={{ textAlign: 'center', fontSize: '30px', fontWeight: '700' }}>
                    동아리 가입 신청
                </div>

                <div className="inline-flex flex-column gap-2">
                    <label>이름</label>
                    <InputText value={joName} onChange={(e) => setJoName(e.target.value)} className="p-3" />
                </div>
                <div className="inline-flex flex-column gap-2">
                    <label>성별</label>
                    <InputText value={joGender} onChange={(e) => setJoGender(e.target.value)} className="p-3" />
                </div>
                <div className="inline-flex flex-column gap-2">
                    <label>전화번호</label>
                    <InputText value={joContact} onChange={(e) => setJoContact(e.target.value)} placeholder="01012345678" className="p-3" />
                </div>
                <div className="inline-flex flex-column gap-2">
                    <label>학과</label>
                    <InputText value={joDept} onChange={(e) => setJoDept(e.target.value)} className="p-3" />
                </div>
                <div className="inline-flex flex-column gap-2">
                    <label>학번</label>
                    <InputText value={joStuId} onChange={(e) => setJoStuId(e.target.value)} className="p-3" />
                </div>

                <label>면접 가능 날짜</label>
                <div className="card flex flex-wrap justify-content-center gap-3">
                    {interview.map((interview) => (
                        <div className="flex align-items-center" key={interview.ivId}>
                            <Checkbox
                                inputId={`date${interview.ivId}`}
                                value={interview.ivId} // ID로 설정
                                onChange={onIvChange}  // 면접 날짜 선택 핸들러 연결
                                checked={selectedIvId.includes(interview.ivId)}
                            />
                            <label htmlFor={`date${interview.ivId}`} className="ml-2">{interview.ivDate}</label>
                        </div>
                    ))}
                </div>

                <label>활동 참여 가능 요일</label>
                <div className="card flex flex-wrap justify-content-center gap-3">
                    {activityDate.map((date) => (
                        <div className="flex align-items-center" key={date.adId}>
                            <Checkbox
                                inputId={`date${date.adId}`}
                                value={date.adId} // ID로 설정
                                onChange={onDateChange}  // 활동 날짜 선택 핸들러 연결
                                checked={selectedDateId.includes(date.adId)}
                            />
                            <label htmlFor={`date${date.adId}`} className="ml-2">{date.adDate}</label>
                        </div>
                    ))}
                </div>

                <div className="inline-flex flex-column gap-2">
                    <label>배드민턴 경험 및 실력</label>
                    <InputText value={joSkill} onChange={(e) => setJoSkill(e.target.value)} placeholder="배드민턴을 쳐 본 경험이 있다면 기간, 혹은 얼만큼 치는지!" className="p-3" />
                </div>
                <div className="flex align-items-center gap-2">
                    <Button label="신청 완료" onClick={handleRegister} className="p-3 w-full" />
                </div>
            </div>
        </div>
    );
}

export default JoinClub;
