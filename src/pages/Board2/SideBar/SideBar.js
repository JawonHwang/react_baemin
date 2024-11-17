import style from "./SideBar.module.css";
import { Link, useLocation } from 'react-router-dom';
const SideBar = () => {
    const location = useLocation();

    return (
        <div className={style.list}>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/board' && style.selected}`} to="/baemin/board">
                     공지사항
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/board/toFAQ' && style.selected}`} to="/baemin/board/toFAQ" onClick={(e) => {
                    e.preventDefault();//나중에 서비스 준비되면 onclick 삭제
                    alert("준비 중입니다.");
                }}>
                     FAQ
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/' && style.selected}`} to="/baemin/"onClick={(e) => {
                    e.preventDefault();//나중에 서비스 준비되면 onclick 삭제 경로도 바꾸기
                    alert("준비 중입니다.");
                }}>
                     사진첩
                </Link>
            </div>
        </div>
    );
}
export default SideBar;