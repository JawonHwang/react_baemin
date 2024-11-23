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
            // boardId 기준으로 역순 정렬
            const sortedBoards = resp.data.sort((a, b) => b.boardId - a.boardId);
            setBoards(sortedBoards);
            setLoading(false);
        });
    }, []);

    // 검색 결과 필터링
    const filteredBoards = boards.filter(
        (e) =>
            e.boardWriter.includes(search) ||
            e.boardContents.includes(search) ||
            e.boardTitle.includes(search)
    );

    // 총 아이템 수와 페이지 수 계산
    const totalItems = search === '' ? boards.length : filteredBoards.length;
    const totalPages = Math.ceil(totalItems / COUNT_PER_PAGE);

    const onPageChange = (e, page) => {
        setCurrentPage(page);
    };

    // 현재 페이지에 해당하는 게시글들만 추출
    const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
    const endIndex = Math.min(startIndex + COUNT_PER_PAGE, totalItems);
    const visibleBoard = (search === '' ? boards : filteredBoards).slice(startIndex, endIndex);

    const inputChangeHandler = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // 검색할 때마다 페이지를 첫 번째 페이지로 리셋
    };

    if (loading) {
        return <CircularIndeterminate />;
    }

    return (
        <div className="Boardcontainer">
            <div className={style.search}>
                <Input placeholder="검색" className={style.input_search} onChange={inputChangeHandler}></Input>
            </div>
            <hr />
            <div className='w-full'>
                <div className='flex align-items-center'>
                    <div style={{ color: '#EEF300', fontSize: 'small', marginLeft: '30px' }}>●</div>
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
                            {visibleBoard.map((e) => (
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
                <hr />
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
};

export default Free;
