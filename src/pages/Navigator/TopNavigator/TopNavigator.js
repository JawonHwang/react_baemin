import React, { useEffect, useState, useContext } from "react";
import styles from "./TopNavigator.module.css";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { LoginContext } from "../../../App";
import logo from '../Assets/Logo.png';

const TopNavigator = () => {
    const [activeLink, setActiveLink] = useState("");
    const [MemId, setMemId] = useState("");
    const [MemPw, setMemPw] = useState("");
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [pwcheck, setPwCheck] = useState('');
    const [memEmail, setMemEmail] = useState('');
    const [emailCheck, setEmailCheck] = useState('');
    const [memDept, setMemDept] = useState('');
    const [memStuId, setMemStuId] = useState('');
    const [memClubNum, setMemClubNum] = useState('');
    const [memName, setMemName] = useState('');
    const [memBirth, setMemBirth] = useState('');
    const [memGender, setMemGender] = useState('');
    const [memContact, setMemContact] = useState('');

    const [loginDialogVisible, setLoginDialogVisible] = useState(false);
    const [registerDialogVisible, setRegisterDialogVisible] = useState(false);

    const { loginID, setLoginID } = useContext(LoginContext);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false); //비회원 신청 폼 관리자가 부여함

    useEffect(() => {
        const buttonStatus = localStorage.getItem('isButtonDisabled');
        // console.log(buttonStatus);
        if (buttonStatus === 'true') {
            setIsButtonDisabled(true);
        }
    }, []);

    const handleDisabledClick = (e) => {
        if (isButtonDisabled) {
            e.preventDefault(); // 링크 기본 동작을 막음
            alert('지금은 신청기간이 아닙니다.');
        }
    };

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    const handleLoginClick = () => {
        setLoginDialogVisible(true);
    };

    const handleRegisterClick = () => {
        setRegisterDialogVisible(true);
    };

    const handleSignIn = () => {
        const formData = new FormData();
        formData.append("MemId", MemId);
        formData.append("MemPw", MemPw);

        axios.post("/api/member/login", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(response => {
                setLoginID(MemId);
                setLoginDialogVisible(false);
            })
            .catch(err => {
                alert("Login failed! Please check your credentials.");
            });
    };

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 비밀번호 유효성 검사 (8자 이상, 숫자와 특수문자 포함)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // 핸드폰 번호 유효성 검사
    const phoneRegex = /^\d{3}\d{3,4}\d{4}$/;

    const handleRegister = async () => {
        // 이메일 유효성 검사
        if (!emailRegex.test(memEmail)) {
            alert("잘못된 이메일 형식입니다.");
            return;
        }

        // 비밀번호 유효성 검사 (8자 이상, 숫자와 특수문자 포함)
        if (!passwordRegex.test(pw)) {
            alert("비밀번호는 최소 8자 이상이어야 하며, 숫자와 특수문자가 포함되어야 합니다.");
            return;
        }

        // 비밀번호 확인
        if (pw !== pwcheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 핸드폰 번호 유효성 검사
        if (!phoneRegex.test(memContact)) {
            alert("잘못된 전화번호 형식입니다. 숫자로만 작성해주세요 예)01012345678");
            return;
        }

        // 중복 ID 및 학번 체크
        try {
            const idResponse = await axios.get("/api/member/checkID", { params: { memId: id } });
            if (idResponse.data) {
                alert("이미 사용중인 ID입니다.");
                return;
            }

            const stuIdResponse = await axios.get("/api/member/checkStuID", { params: { memStuId: memStuId } });
            if (stuIdResponse.data) {
                alert("이 학번은 이미 가입된 학번입니다. 확인해주세요.");
                return;
            }

            // 승인된 학번 체크
            const isAppResponse = await axios.get(`/api/join/isApp/${memStuId}`);
            if (!isAppResponse.data) {
                alert("이 학번은 승인되지 않았습니다. 관리자에게 문의해주세요.");
                return;
            }

            // 모든 체크를 통과한 경우 회원가입 진행
            const formData = {
                memId: id,
                memPw: pw,
                memEmail: memEmail,
                memDept: memDept,
                memStuId: memStuId,
                memClubNum: memClubNum,
                memName: memName,
                memBirth: memBirth,
                memGender: memGender,
                memContact: memContact,
            };

            await axios.post("/api/member/register", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            alert("회원가입에 성공했습니다!");
            setRegisterDialogVisible(false);

        } catch (err) {
            alert("회원가입을 진행하는데 오류가 발생하였습니다.");
        }
    };

    // 이메일 인증
    const handleEmailVerification = () => {
        axios.post(`/api/member/register/${memEmail}`)
            .then(() => {
                alert("해당 이메일로 인증코드가 발송되었습니다.");
            })
            .catch(err => {
                alert("인증코드 발송에 실패하였습니다.");
            });
    };

    const verifyCode = () => {
        axios.post(`/api/member/verify/${emailCheck}`)
            .then(response => {
                if (response.data === "success") {
                    alert("인증에 성공하였습니다.");
                } else {
                    alert("올바르지 않은 인증코드입니다.");
                }
            })
            .catch(err => {
                alert("인증에 실패하였습니다.");
            });
    };

    const handleLogoutClick = () => {
        axios.post("/api/member/logout")
            .then(() => {
                setLoginID("");
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <Container fluid className={styles.container}>
            <Row>
                {/* <Col className={styles.header_left}></Col> */}
                <Col className={styles.header_right}>
                    <Row>
                        <Col>
                            <Link className={styles.linkurl} to="/">
                                <div
                                    className={activeLink === '' ? styles.activeLink : styles.linkurl}
                                    onClick={() => handleLinkClick('')}
                                >
                                    <img className={styles.logo} src={logo}></img>
                                </div>
                            </Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/baemin/board">
                                <div
                                    className={activeLink === 'Board' ? styles.activeLink : styles.linkurl}
                                    onClick={() => handleLinkClick('Board')}
                                >
                                    BOARD
                                </div>
                            </Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to={`/baemin/calendar`}>
                                <div
                                    className={activeLink === 'Calendar' ? styles.activeLink : styles.linkurl}
                                    onClick={() => handleLinkClick('Calendar')}
                                >CALENDAR</div>
                            </Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to={`/baemin/community`}>
                                <div
                                    className={activeLink === 'Community' ? styles.activeLink : styles.linkurl}
                                    onClick={() => handleLinkClick('Community')}
                                >COMMUNITY</div>
                            </Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to={`/baemin/mypage`}>
                                <div
                                    className={activeLink === 'MyPage' ? styles.activeLink : styles.linkurl}
                                    onClick={() => handleLinkClick('MyPage')}
                                >MY PAGE</div>
                            </Link>
                        </Col>
                        <Col>
                            {/* 비활성화된 경우에는 클릭 시 alert을 띄우고, 아니라면 Link로 이동 */}
                            <Link className={styles.linkurl} to={`/baemin/join`} onClick={handleDisabledClick}>
                                <div
                                    className={activeLink === 'join' ? styles.activeLink : styles.linkurl}
                                    onClick={() => handleLinkClick('join')}
                                >JOIN CLUB</div>
                            </Link>
                        </Col>
                        {loginID ? (
                            <Col>
                                <div className={styles.linkurl} onClick={handleLogoutClick}>
                                    LOGOUT
                                </div>
                            </Col>
                        ) : (
                            <>
                                <Col>
                                    <div className={styles.linkurl} onClick={handleLoginClick}>
                                        LOGIN
                                    </div>
                                </Col>
                                <Col>
                                    <div className={styles.linkurl} onClick={handleRegisterClick}>
                                        REGISTER
                                    </div>
                                </Col>
                            </>
                        )}
                    </Row>
                </Col>
            </Row>

            {/* 로그인 모달 */}
            <Dialog
                visible={loginDialogVisible}
                modal
                onHide={() => setLoginDialogVisible(false)}
            >
                <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px' }}>
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="ID">ID</label>
                        <InputText
                            id="ID"
                            value={MemId}
                            onChange={(e) => setMemId(e.target.value)}
                            className="p-3"
                        />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="PW">PW</label>
                        <InputText
                            id="PW"
                            type="password"
                            value={MemPw}
                            onChange={(e) => setMemPw(e.target.value)}
                            className="p-3"
                        />
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Button label="Sign-In" onClick={handleSignIn} className="p-3 w-full" />
                        <Button label="Cancel" onClick={() => setLoginDialogVisible(false)} className="p-3 w-full"></Button>
                    </div>
                </div>
            </Dialog>

            {/* 회원가입 모달 */}
            <Dialog
                visible={registerDialogVisible}
                modal
                onHide={() => setRegisterDialogVisible(false)}
            >
                <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px' }}>
                    <div className="inline-flex flex-column gap-2">
                        <label>ID</label>
                        <InputText value={id} onChange={(e) => setId(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>비밀번호</label>
                        <InputText type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>비밀번호 확인</label>
                        <InputText type="password" value={pwcheck} onChange={(e) => setPwCheck(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Email</label>
                        <InputText value={memEmail} onChange={(e) => setMemEmail(e.target.value)} className="p-3" />
                        <Button label="emailCheck" onClick={handleEmailVerification} className="p-3 w-full" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Email 인증</label>
                        <InputText value={emailCheck} onChange={(e) => setEmailCheck(e.target.value)} className="p-3" />
                        <Button label="codeCheck" onClick={verifyCode} className="p-3 w-full" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>학과</label>
                        <InputText value={memDept} onChange={(e) => setMemDept(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>학번</label>
                        <InputText value={memStuId} onChange={(e) => setMemStuId(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>기수</label>
                        <InputText value={memClubNum} onChange={(e) => setMemClubNum(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>이름</label>
                        <InputText value={memName} onChange={(e) => setMemName(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>생년월일</label>
                        <InputText type="date" value={memBirth} onChange={(e) => setMemBirth(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>성별</label>
                        <InputText value={memGender} onChange={(e) => setMemGender(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>전화번호</label>
                        <InputText value={memContact} onChange={(e) => setMemContact(e.target.value)} placeholder="010-0000-0000" className="p-3" />
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Button label="Register" onClick={handleRegister} className="p-3 w-full" />
                        <Button label="Cancel" onClick={() => {setRegisterDialogVisible(false)}} className="p-3 w-full" />
                    </div>
                </div>
            </Dialog>
        </Container>
    );
};

export default TopNavigator;