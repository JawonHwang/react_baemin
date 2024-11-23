import style from "./SideBar.module.css";
import { Link, useLocation } from 'react-router-dom';
const SideBar = () => {
    const location = useLocation();

    return (
        <div className={style.list}>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/community' && style.selected}`} to="/baemin/community">
                    자유게시판
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/community/photo' && style.selected}`} to="/baemin/community/photo">
                    사진첩
                </Link>
            </div>
        </div>
    );
}
export default SideBar;