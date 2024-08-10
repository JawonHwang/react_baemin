import styles from "./TopNavigator.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap";
import React from "react";

const TopNavigator = () => {

    return (
        <Container className={`${styles.container} ${styles.containerFluid}`} fluid>
            <Row>
                <Col className={styles.header_left}>
                    <Row>
                        left
                    </Row>
                </Col>
                <Col className={styles.header_center}>
                    <Row>
                       center
                    </Row>
                </Col>
                <Col className={styles.header_right}>
                    <Row>
                        right
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default TopNavigator;