import { Route, Routes } from 'react-router-dom';
import style from "./Admin.module.css";
import SideBar from './SideBar/SideBar';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import MembersManagement from './MembersManagement/MembersManagement';
import AttendancesManagement from './AttendancesManagement/AttendancesManagement';
import TournamentsManagement from './TournamentsManagement/TournamentsManagement';
import TournamentsAdd from './TournamentsManagement/TournamentsAdd';
import FAQsManagement from './FAQsManagement/FAQsManagement';
import FeesManagement from './FeesManagement/FeesManagement';
import NoticesManagement from './NoticesManagement/NoticesManagement';
import QuestionsManagement from './QuestionsManagement/QuestionsManagement';
import ReportsManagement from './ReportsManagement/ReportsManagement';
import AdminManagement from './AdminManagement/AdminManagement';
import NonMemberManagement from './NonMemberManagement/NonMemberManagement';
import NoticesAdd from './NoticesManagement/NoticesAdd';
import NoticesCategoryAdd from './NoticesManagement/NoticesCategoryAdd';
import 'primeicons/primeicons.css';
const Admin = () => {
    return (
        <div className={style.adminContainer}>
             <div className={style.sideBar}>
                <SideBar></SideBar>
             </div>
            <div className={style.mainContent}>
                <Routes>
                    <Route path="/" element={<AdminDashboard />}></Route>
                    <Route path="/toMembersManagement/*" element={<MembersManagement />}></Route>
                    <Route path="/toAttendancesManagement/*" element={<AttendancesManagement />}></Route>
                    <Route path="/toTournamentsManagement/*" element={<TournamentsManagement />}></Route>
                    <Route path="/toTournamentsAdd/*" element={<TournamentsAdd />}></Route>
                    <Route path="/toFAQsManagement/*" element={<FAQsManagement />}></Route>
                    <Route path="/toFeesManagement/*" element={<FeesManagement />}></Route>
                    <Route path="/toNoticesManagement/*" element={<NoticesManagement />}></Route>
                    <Route path="/toNoticesAdd/*" element={<NoticesAdd />}></Route>
                    <Route path="/toNoticesCategoryAdd/*" element={<NoticesCategoryAdd />}></Route>
                    <Route path="/toQuestionsManagement/*" element={<QuestionsManagement />}></Route>
                    <Route path="/toReportsManagement/*" element={<ReportsManagement />}></Route>
                    <Route path="/toAdminManagement/*" element={<AdminManagement />}></Route>
                    <Route path="/toNonMemberManagement/*" element={<NonMemberManagement />}></Route>
                </Routes>
            </div>
        </div >
    );
}
export default Admin;