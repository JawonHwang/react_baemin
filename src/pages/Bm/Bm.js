import { Route, Routes } from "react-router-dom";
import { useContext, useEffect, useState, createContext } from "react";
import axios from "axios";
import { Container } from "reactstrap";
import TopNavigator from "../Navigator/TopNavigator/TopNavigator";
import Main from "../Main/Main";
import Admin from "../Admin/Admin";
import Join from "../JoinClub/Join";
import Community from "../Community/Community";
import Board from "../Board2/Board";
import { useCalendar } from "./useCalendar";
import { LoginContext } from "../../App";
import CalendarMain from "../Calendar/CalendarMain";
import MyPage from "../MyPage/MyPage";

const ListContext = createContext();
const MemberContext = createContext();

const Baemin = () => {

    const { loginID, setLoginID } = useContext(LoginContext);

    const [member, setMember] = useState({});

    useEffect(() => {
        if (loginID) { // loginID가 유효한 경우에만 요청
            axios.get(`/api/member/getmem/${loginID}`)
                .then(resp => {
                    setMember(resp.data);
                    // console.log(resp.data);
                })
                .catch(error => {
                    console.error("Error fetching member data:", error);
                });
        } else {
            console.warn("No loginID provided.");
        }
    }, [loginID]);


    //console.log(member);

    // Calendar 상위 컴포넌트에서 사용할 상태와 함수
    const { dbList, refreshList } = useCalendar();

    return (
        <MemberContext.Provider value={{ member, setMember }}>
            <div>
                <Container className="NaviContainer g-0" fluid>
                    <TopNavigator />
                </Container>

                <div className="MainContainer">
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="baemin/calendar/*" element={
                            <ListContext.Provider value={{ dbList, refreshList }}>
                                <CalendarMain refreshList={refreshList} />
                            </ListContext.Provider>
                        } />
                        <Route path="baemin/admin/*" element={<Admin />} />
                        <Route path="baemin/join/*" element={<Join />} />
                        <Route path="baemin/community/*" element={<Community />} />
                        <Route path="baemin/board/*" element={<Board />} />
                        <Route path="baemin/mypage/*" element={<MyPage />} />

                    </Routes>

                </div>
            </div>
        </MemberContext.Provider>
    );
};

export default Baemin;
export { MemberContext, ListContext };
