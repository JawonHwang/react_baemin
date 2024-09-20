import style from "./SideBar.module.css";
import { Link, useLocation } from 'react-router-dom';
const SideBar = () => {
    const location = useLocation();

    return (
        <div className={style.list}>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin' && style.selected}`} to="/baemin/admin">
                    대시보드
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin/toMembersManagement' && style.selected}`} to="/baemin/admin/toMembersManagement">
                    회원 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin/toNonMemberManagement' && style.selected}`} to="/baemin/admin/toNonMemberManagement">
                    비회원 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin/toAdminManagement' && style.selected}`} to="/baemin/admin/toAdminManagement">
                    관리자 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin/toReportsManagement' && style.selected}`} to="/baemin/admin/toReportsManagement">
                    신고 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin/toNoticesManagement' && style.selected}`} to="/baemin/admin/toNoticesManagement">
                     공지사항 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin/toQuestionsManagement' && style.selected}`} to="/baemin/admin/toQuestionsManagement">
                     Q&A 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin/toFAQsManagement' && style.selected}`} to="/baemin/admin/toFAQsManagement">
                    FAQ 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin/toTournamentsManagement' && style.selected}`} to="/baemin/admin/toTournamentsManagement">
                    대회 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin/toFeesManagement' && style.selected}`} to="/baemin/admin/toFeesManagement">
                    회비 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/baemin/admin/toAttendancesManagement' && style.selected}`} to="/baemin/admin/toAttendancesManagement">
                    출석률 관리
                </Link>
            </div>
        </div>
    );
}
export default SideBar;