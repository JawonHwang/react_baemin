import { Route, Routes } from "react-router-dom";
import Calendar from "../Calendar/Calendar";
import { Container } from "reactstrap";
import TopNavigator from "../Navigator/TopNavigator/TopNavigator";
import Main from "../Main/Main";

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
                                </Routes>

                            </div>
                        </div>
    );
};

export default Baemin;