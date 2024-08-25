import styles from "./TopNavigator.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap";
import React from "react";
import { Menubar } from 'primereact/menubar';

const TopNavigator = () => {

    return (
        <Container className={`${styles.container} ${styles.containerFluid}`} fluid>
            <Row>
                <Col className={styles.header_left}>
                    <Row>
                        <Menubar model={items} />
                    </Row>
                </Col>
                <Col className={styles.header_center}>
                    <Row>
                        빈칸
                    </Row>
                </Col>
                <Col className={styles.header_right}>
                    <Row>
                        {
                            loginID ?
                                <>
                                    <Col>
                                        <Link className={styles.linkurl} to="/"><div className={activeLink === '' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('')}>BADMINTON</div></Link>
                                    </Col>
                                    <Col>
                                        <Link className={styles.linkurl} to="/Board"><div className={activeLink === 'Board' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('Board')}>BOARD</div></Link>
                                    </Col>
                                    <Col>
                                        <Link className={styles.linkurl} to={`/Calendar`}><div>CALENDAR</div></Link>
                                    </Col>
                                    <Col>
                                        <Link className={styles.linkurl} to={`/Community`}><div>COMMUNITY</div></Link>
                                    </Col>
                                    <Col>
                                        <Link className={styles.linkurl} to={`/MyPage`}><div>MY PAGE</div></Link>
                                    </Col>
                                    <Col>
                                        <div className={styles.linkurl} onClick={handleLogoutClick}><div className={activeLink === 'logout' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('logout')}>LOGOUT</div></div>
                                    </Col>
                                </>
                                :
                                <>
                                    <Col>
                                        <div className={styles.linkurl} onClick={handleLoginClick}><div className={activeLink === 'login' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('login')}>LOGIN</div></div>
                                    </Col>
                                    <Col>
                                        <Link className={styles.linkurl} to="/Register"><div className={activeLink === 'Register' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('Register')}>REGISTER</div></Link>
                                    </Col>
                                </>
                        }
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default TopNavigator;