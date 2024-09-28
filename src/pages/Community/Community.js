import { Route, Routes } from "react-router-dom";
import Board from "../Board/Board";
import Photo from "../Photo/Photo";

const Community = () => {


    return (
        <div>
            <div className="MainContainer">
                <Routes>
                    <Route path="/" element={<Board />} />
                    <Route path="photo/*" element={<Photo />} />
                </Routes>
            </div>
        </div>
    );
};

export default Community;
