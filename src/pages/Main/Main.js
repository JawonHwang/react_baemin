import React from 'react';
import styles from "./Main.module.css";
import union from './Img/Union.png';

const Main = () => {
    return (
        <div className={styles.container}>
            <div className={styles.mainText}>
                <div className={styles.main}>
                    KONGJU <br />
                    UNIVERSITY <br />
                    BADMINTON <br />
                    CLUB <br />
                </div>
                <div className={styles.main2}>
                    BAEMIN
                </div>
            </div>
            <div className={styles.mainRight}>
                <img src={union}></img>
            </div>
            <div className={styles.content}>
                <div className={styles.introduction}>
                    <div className={styles.intText}>
                        Introduction
                    </div>
                    공주대학교 천안캠퍼스 배드민턴 동아리 입니다. 배드민턴을 사랑하는 학생들이 모여 함께 즐기고 실력을 향상시키는 것을 목표로 합니다. 우리는 모두가 배드민턴을 통해 건강한 라이프스타일을 추구하며, 우정을 쌓아가는 동아리입니다.
                </div>
                <div className={styles.history}>
                    <h3>현재 동아리 연혁 및 수상실적</h3>
                    <ul>
                        <li>3.1 배민 배드민턴 동아리 창립</li>
                        <li>3.15 단국대학교 배드민턴 대회 참가</li>
                        <li>5.4 첫 동아리 MT 개최</li>
                        <li>3.17 교내 체육대회 배드민턴 부문 우승</li>
                        <li>7.10 단국대학교 배드민턴 대회 참가</li>
                        <li>5.7 탑배드민턴 체육관 대회 우승</li>
                        <li>6.1 신관캠 교류전 개최</li>
                        <li>9.25 배민 동아리 부스 활동</li>
                        <li>5.20 교내 체육대회 배드민턴 부문 5년 연속 우승</li>
                        <li>10.1 지역 아동센터와 함께하는 배드민턴 봉사 활동 진행</li>
                    </ul>
                    <p>매년 정기 연습, 내부 리그전, 다양한 교내외 대회 참여 및 지속적인 성장 중</p>
                </div>
                <div className={styles.promotion}>
                    <h3>배민 동아리 홍보 영상</h3>
                    <div className={styles.videoPlaceholder}>
                        {/* 비디오 컴포넌트나 플레이스홀더를 여기에 추가 */}
                    </div>
                    <p>
                        장소: 단국대학교 천안캠퍼스 체육관<br />
                        날짜: 2023.05.24<br />
                        업적: B조 준우승
                    </p>
                </div>
                <div className={styles.join}>
                    <h3>동아리 가입 신청</h3>
                    <button className={styles.joinButton}>가입 신청하기</button>
                </div>
            </div>
            <footer className={styles.footer}>
                <p>위치: 충청남도 천안시 서북구 천안대로 1223-24 공주대학교 천안캠퍼스 체육관</p>
                <p>배민 고객센터: 041-1111-2222 (평일 09:00~18:00 주말공휴일 휴무) | E. baemin@gmail.com | P. 010-1234-5678</p>
            </footer>
        </div>
    );
}

export default Main;