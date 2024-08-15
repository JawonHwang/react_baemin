import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";
import { CookiesProvider } from "react-cookie";
import Baemin from "./pages/Bm/Bm";
import Admin from "./pages/Admin/Admin";

const LoginContext = createContext();

function App() {

  const [loginID, setLoginID] = useState("");

  return (
    <Router>
      <LoginContext.Provider value={{ loginID, setLoginID }} >
        <CookiesProvider>
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/Baemin/*" element={<Baemin />} />
            <Route path="/Admin/*" element={<Admin />} />
          </Routes>
        </CookiesProvider>
      </LoginContext.Provider>

    </Router>

  );
}

export default App;
export { LoginContext };