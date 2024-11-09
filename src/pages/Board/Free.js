import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { blue } from '@mui/material/colors';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import style from "./List.module.css";
import { Pagination, PaginationItem } from "@mui/material";
import { Input } from "reactstrap";

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
        axios.get("/api/boards/comfree").then(resp => {
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
            <div className="body">
                <div className={style.margin}>
                    전사 자유 게시판
                </div>
                <hr></hr>
                <div className={style.margin}>
                    <div className={style.boardContainer}>
                        <div className={style.tableRow + ' ' + style.tableHeader}>
                            <div className={style.tableHeader}>작성자</div>
                            <div className={style.tableHeader}>파일</div>
                            <div className={style.tableHeader}>제목</div>
                            <div className={style.tableHeader}>조회수</div>
                            <div className={style.tableHeader}>카테고리</div>
                            <div className={style.tableHeader}>작성일</div>
                        </div>
                        {search === ''
                            ? visibleBoard.map((e) => (
                                <div key={e.seq} className={style.tableRow}>
                                    <div className={style.tableCell}>
                                        {e.name} {e.group_name} {e.position}
                                    </div>
                                    <div className={style.tableCell}>
                                        {e.fseq !== 0 && (
                                            <InsertLinkIcon sx={{ color: blue[200] }} />
                                        )}
                                    </div>
                                    <div className={style.tableCell}>
                                        <Link to={`/groovy/board/detail/${e.seq}`}>{e.title}</Link>
                                    </div>
                                    <div className={style.tableCell}>{e.view_count}</div>
                                    <div className={style.tableCell}>{e.category}</div>
                                    <div className={style.tableCell}>{e.write_date}</div>
                                </div>
                            ))
                            : boards
                                .filter(
                                    (e) =>
                                        e.name.includes(search) ||
                                        (e.group_name && e.group_name.includes(search)) ||
                                        e.position.includes(search) ||
                                        e.contents.includes(search) ||
                                        e.title.includes(search)
                                )
                                .map((e) => (
                                    <div key={e.seq} className={style.tableRow}>
                                        <div className={style.tableCell}>
                                            {e.name} {e.group_name} {e.position}
                                        </div>
                                        <div className={style.tableCell}>
                                            {e.fseq !== 0 && (
                                                <InsertLinkIcon sx={{ color: blue[200] }} />
                                            )}
                                        </div>
                                        <div className={style.tableCell}>
                                            <Link to={`/groovy/board/detail/${e.seq}`}>{e.title}</Link>
                                        </div>
                                        <div className={style.tableCell}>{e.view_count}</div>
                                        <div className={style.tableCell}>{e.category}</div>
                                        <div className={style.tableCell}>{e.write_date}</div>
                                    </div>
                                ))}
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
            </div>
        </div>
    );
}

export default Free;
