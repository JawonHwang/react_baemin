import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";
import axios from 'axios';
import Baemin from "./pages/Bm/Bm";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-green/theme.css';

export const LoginContext = createContext();

function App() {

  const [loginID, setLoginID] = useState("");

  useEffect(() => {
    // 두 개의 비동기 요청을 병렬로 실행
    Promise.all([
      axios.get("/api/member/isLogined"),
      axios.get("/api/visit/visitor")
    ])
    .then(([loginResp, visitResp]) => {
      // 각각의 응답에 대해 처리하기
      setLoginID(loginResp.data);
      // visitResp를 사용하는 처리 추가 가능
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);
  
  return (
    <Router>
      <LoginContext.Provider value={{ loginID, setLoginID }} >
        <CookiesProvider>
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/*" element={<Baemin />} />
          </Routes>
        </CookiesProvider>
      </LoginContext.Provider>

    </Router>

  );
}

export default App;