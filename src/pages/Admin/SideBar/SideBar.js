import style from "./SideBar.module.css";
import { Link, useLocation } from 'react-router-dom';
const SideBar = () => {
    const location = useLocation();

    return (
        <div className={style.list}>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin' && style.selected}`} to="/admin">
                    대시보드
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toMembersManagement' && style.selected}`} to="/admin/toMembersManagement">
                    회원 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toNonMemberManagement' && style.selected}`} to="/admin/toNonMemberManagement">
                    비회원 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toAdminManagement' && style.selected}`} to="/admin/toAdminManagement">
                    관리자 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toReportsManagement' && style.selected}`} to="/admin/toReportsManagement">
                    신고 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toNoticesManagement' && style.selected}`} to="/admin/toNoticesManagement">
                     공지사항 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toQuestionsManagement' && style.selected}`} to="/admin/toQuestionsManagement">
                     Q&A 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toFAQsManagement' && style.selected}`} to="/admin/toFAQsManagement">
                    FAQ 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toTournamentsManagement' && style.selected}`} to="/admin/toTournamentsManagement">
                    대회 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toFeesManagement' && style.selected}`} to="/admin/toFeesManagement">
                    회비 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toAttendancesManagement' && style.selected}`} to="/admin/toAttendancesManagement">
                    출석률 관리
                </Link>
            </div>
        </div>
    );
}
export default SideBar;