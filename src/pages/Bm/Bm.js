import { Route, Routes } from "react-router-dom";
import Calendar from "../Calendar/Calendar";
import { Container } from "reactstrap";
import TopNavigator from "../Navigator/TopNavigator/TopNavigator";
import Main from "../Main/Main";
import Admin from "../Admin/Admin";
import Join from "../JoinClub/Join";

const Baemin = () => {


    return (
        <div>
            <Container className="NaviContainer g-0" fluid>
                <TopNavigator />
            </Container>

            <div className="MainContainer">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="calendar/*" element={
                        <Calendar />
                    } />
                    <Route path="/Admin/*" element={<Admin />} />
                    <Route path="join/*" element={<Join />} />
                </Routes>

            </div>
        </div>
    );
};

export default Baemin;
