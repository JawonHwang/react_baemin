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
import 'primereact/resources/themes/lara-light-indigo/theme.css';

export const LoginContext = createContext();

function App() {

  const [loginID, setLoginID] = useState("");

  useEffect(() => {
    axios.get("/api/member/isLogined").then(resp => {
      setLoginID(resp.data);
    }).catch(() => { })
  }, [])

  return (
    <Router>
      <LoginContext.Provider value={{ loginID, setLoginID }} >
        <CookiesProvider>
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/Baemin/*" element={<Baemin />} />
          </Routes>
        </CookiesProvider>
      </LoginContext.Provider>

    </Router>

  );
}

export default App;