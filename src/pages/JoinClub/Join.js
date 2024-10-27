import { Route, Routes } from "react-router-dom";
import JoinClub from "../JoinClub/JoinClub";
import DetailJoin from "./DetailJoin";

const Join = () => {

    return (
        <div>
            <Routes>
                <Route path="/" element={<JoinClub />} />
                <Route path="/detail/:joId" element={<DetailJoin />} />
            </Routes>
        </div>
    );
};

export default Join;