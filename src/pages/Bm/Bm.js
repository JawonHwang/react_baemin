import { Route, Routes } from "react-router-dom";
import Calendar from "../Calendar/Calendar";
import { useContext, useEffect, useState, createContext } from "react";
import axios from "axios";
import { Container } from "reactstrap";
import TopNavigator from "../Navigator/TopNavigator/TopNavigator";
import Main from "../Main/Main";
import Admin from "../Admin/Admin";
import Join from "../JoinClub/Join";
import Community from "../Community/Community";
import { useCalendar } from "./useCalendar";
import { LoginContext } from "../../App";

export const ListContext = createContext();
const MemberContext = createContext();

const Baemin = () => {

    const { loginID, setLoginID } = useContext(LoginContext);
    
    const [member, setMember] = useState({});
    
    console.log(loginID)

    useEffect(() => {
        if (loginID) { // loginID가 유효한 경우에만 요청
            axios.get(`/api/member/getmem/${loginID}`)
                .then(resp => {
                    setMember(resp.data);
                })
                .catch(error => {
                    console.error("Error fetching member data:", error);
                });
        } else {
            console.warn("No loginID provided.");
        }
    }, [loginID]);
    

    console.log(member);

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
                        <Route path="calendar/*" element={
                            <ListContext.Provider value={{ dbList, refreshList }}>
                                <Calendar />
                            </ListContext.Provider>
                        } />
                        <Route path="/Admin/*" element={<Admin />} />
                        <Route path="join/*" element={<Join />} />
                        <Route path="community/*" element={<Community />} />
                    </Routes>

                </div>
            </div>
        </MemberContext.Provider>
    );
};

export default Baemin;
export { MemberContext };
