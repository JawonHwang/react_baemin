import React, { useState, useContext } from "react";
import styles from "./TopNavigator.module.css";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { LoginContext } from "../../../App";

const TopNavigator = () => {
    const [activeLink, setActiveLink] = useState("");
    const [MemId, setMemId] = useState("");
    const [MemPw, setMemPw] = useState("");
    const [MemPwCheck, setMemPwCheck] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [studentId, setStudentId] = useState("");
    const [generation, setGeneration] = useState("");
    const [memName, setMemName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");

    const [loginDialogVisible, setLoginDialogVisible] = useState(false);
    const [registerDialogVisible, setRegisterDialogVisible] = useState(false);

    const { loginID, setLoginID } = useContext(LoginContext);

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
        axios.post("/api/member/login", { MemId, MemPw })
            .then(response => {
                setLoginID(response.data.loginID);
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
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;

    const handleRegister = () => {
        if (!emailRegex.test(email)) {
            alert("Invalid email format");
            return;
        }

        if (!passwordRegex.test(MemPw)) {
            alert("Password must be at least 8 characters long and contain at least one number and one special character");
            return;
        }

        if (MemPw !== MemPwCheck) {
            alert("Passwords do not match");
            return;
        }

        if (!phoneRegex.test(phone)) {
            alert("Invalid phone number format");
            return;
        }

        axios.post("/api/member/register", {
            MemId, MemPw, email, department, studentId, generation, memName, birthdate, gender, phone
        })
            .then(() => {
                setRegisterDialogVisible(false);
            })
            .catch(err => {
                alert("Register failed! Please check your credentials.");
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
                                    BADMINTON
                                </div>
                            </Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/baemin/Board">
                                <div
                                    className={activeLink === 'Board' ? styles.activeLink : styles.linkurl}
                                    onClick={() => handleLinkClick('Board')}
                                >
                                    BOARD
                                </div>
                            </Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to={`/baemin/Calendar`}>
                                <div>CALENDAR</div>
                            </Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to={`/baemin/Community`}>
                                <div>COMMUNITY</div>
                            </Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to={`/baemin/MyPage`}>
                                <div>MY PAGE</div>
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
                        <InputText value={MemId} onChange={(e) => setMemId(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Password</label>
                        <InputText type="password" value={MemPw} onChange={(e) => setMemPw(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Confirm Password</label>
                        <InputText type="password" value={MemPwCheck} onChange={(e) => setMemPwCheck(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Email</label>
                        <InputText value={email} onChange={(e) => setEmail(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Department</label>
                        <InputText value={department} onChange={(e) => setDepartment(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Student ID</label>
                        <InputText value={studentId} onChange={(e) => setStudentId(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Generation</label>
                        <InputText value={generation} onChange={(e) => setGeneration(e.target.value)} className="p-3" />
                    </div>

                    <div className="inline-flex flex-column gap-2">
                        <label>Name</label>
                        <InputText value={memName} onChange={(e) => setMemName(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Birthdate</label>
                        <InputText type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Gender</label>
                        <InputText value={gender} onChange={(e) => setGender(e.target.value)} className="p-3" />
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label>Phone</label>
                        <InputText value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" className="p-3" />
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Button label="Register" onClick={handleRegister} className="p-3 w-full" />
                        <Button label="Cancel" onClick={() => setRegisterDialogVisible(false)} className="p-3 w-full" />
                    </div>
                </div>
            </Dialog>
        </Container>
    );
};

export default TopNavigator;
