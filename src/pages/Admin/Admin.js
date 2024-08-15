import { Route, Routes } from 'react-router-dom';
import style from "./Admin.module.css";
import SideBar from './SideBar/SideBar';
import AdminDashboard from './AdminDashboard/AdminDashboard';
const Admin = () => {
    return (
        <div>
             <div className={style.sideBar}>
                <SideBar></SideBar>
             </div>
            <div>
                <Routes>
                    <Route path="/" element={<AdminDashboard />}></Route>
                </Routes>
            </div>
        </div >
    );
}
export default Admin;