import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import style from "./List.module.css";
import { Pagination, PaginationItem } from "@mui/material";
import { Input, Button } from "reactstrap";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const CircularIndeterminate = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );
};
const Free = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [boards, setBoards] = useState([]);
    const COUNT_PER_PAGE = 10;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get("/api/board").then(resp => {
            setBoards(resp.data);
            setLoading(false);
        })
    }, []);

    const totalItems = boards.length;
    const totalPages = Math.ceil(totalItems / COUNT_PER_PAGE);

    const onPageChange = (e, page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
    const endIndex = Math.min(startIndex + COUNT_PER_PAGE, totalItems);
    const visibleBoard = boards.slice(startIndex, endIndex);

    const inputChangeHandler = (e) => {
        setSearch(e.target.value);
    };

    if (loading) {
        return <CircularIndeterminate />;
    }

    return (
        <div className="Boardcontainer">
            <div className={style.search}>
                <Input placeholder="검색" className={style.input_search} onChange={inputChangeHandler}></Input>
            </div>
            <hr></hr>
            <div className='w-full'>
                <div className='flex align-items-center'>
                    <div style={{ color: '#EEF300', fontSize: 'small', marginLeft:'30px' }}>●</div>
                    <div className='ml-3' style={{ fontWeight: 'bold', fontSize: 'larger' }}>COMMUNITY</div>
                    <div className='ml-5' style={{ fontWeight: 'bolder', fontSize: 'larger' }}>자유게시판</div>
                </div>
                <div className="p-fluid mt-5">
                    <div className={style.margin}>
                        <div className={style.boardContainer}>
                            <div className={style.tableRow + ' ' + style.tableHeader}>
                                <div className={style.tableHeader}>작성자</div>
                                <div className={style.tableHeader}>제목</div>
                                <div className={style.tableHeader}>조회수</div>
                                <div className={style.tableHeader}>작성일</div>
                            </div>
                            {search === ''
                                ? visibleBoard.map((e) => (
                                    <div key={e.boardId} className={style.tableRow}>
                                        <div className={style.tableCell}>
                                            {e.boardWriter}
                                        </div>
                                        <div className={style.tableCell}>
                                            <Link to={`detail/${e.boardId}`}>{e.boardTitle}</Link>
                                        </div>
                                        <div className={style.tableCell}>{e.boardViewCount}</div>
                                        <div className={style.tableCell}>{e.boardWriteDate}</div>
                                    </div>
                                ))
                                : boards
                                    .filter(
                                        (e) =>
                                            e.boardWriter.includes(search) ||
                                            e.boardContents.includes(search) ||
                                            e.boardTitle.includes(search)
                                    )
                                    .map((e) => (
                                        <div key={e.boardId} className={style.tableRow}>
                                            <div className={style.tableCell}>
                                                {e.boardWriter}
                                            </div>
                                            <div className={style.tableCell}>
                                                <Link to={`detail/${e.boardId}`}>{e.boardTitle}</Link>
                                            </div>
                                            <div className={style.tableCell}>{e.boardViewCount}</div>
                                            <div className={style.tableCell}>{e.boardWriteDate}</div>
                                        </div>
                                    ))}
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className={style.margin}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={onPageChange}
                        size="medium"
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "15px 0",
                        }}
                        renderItem={(item) => (
                            <PaginationItem {...item} sx={{ fontSize: 15 }} />
                        )}
                    />
                </div>
                <div className={style.writeButtonContainer}>
                    <Link to="/baemin/community/write">
                        <Button color="primary" className={style.writeButton}>글 작성</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Free;
