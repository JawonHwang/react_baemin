import style from "./SideBar.module.css";
import { Link, useLocation } from 'react-router-dom';
const SideBar = () => {
    return (
        <div style={{position:'fixed'}}>
            <div className={style.menu}>대시보드</div>
            <div className={style.menu}>회원 관리</div>
            <div className={style.menu}>비회원 신청 관리</div>
            <div className={style.menu}>신고 관리</div>
            <div className={style.menu}>공지사항 관리</div>
            <div className={style.menu}>Q&A 관리</div>
            <div className={style.menu}>FAQ 관리</div>
            <div className={style.menu}>대회 관리</div>
            <div className={style.menu}>회비 관리</div>
            <div className={style.menu}>출석률 관리</div>
        </div>
    );
}
export default SideBar;