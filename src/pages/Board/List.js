import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { Pagination, PaginationItem } from '@mui/material';
import style from './List.module.css';
import { Input } from "reactstrap";
import { MemberContext } from '../Bm/Bm';

const List = () => {
    const { member } = useContext(MemberContext);

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [boards, setBoards] = useState([]);
    const COUNT_PER_PAGE = 10;

    useEffect(() => {
        const dept = member.group_name;
        Promise.all([
            axios.get('/api/boards/recent'),
            axios.get(`/api/boards/recentDept/${dept}`),
        ])
            .then((responses) => {
                const recentBoards = responses[0].data.map((board) => ({
                    ...board,
                    isRecentDept: 'recent',
                }));
                const deptBoards = responses[1].data.map((board) => ({
                    ...board,
                    isRecentDept: 'dept',
                }));

                const combinedBoards = [...recentBoards, ...deptBoards];
                combinedBoards.sort(
                    (a, b) => new Date(b.write_date) - new Date(a.write_date)
                );
                setBoards(combinedBoards);
            })
            .catch(() => { });
    }, [member.group_name]);

    const totalItems = boards.length;
    const totalPages = Math.ceil(totalItems / COUNT_PER_PAGE);

    const onPageChange = (e, page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
    const endIndex = Math.min(startIndex + COUNT_PER_PAGE, totalItems);
    const visibleBoard = boards.slice(startIndex, endIndex);

    const getDetailLink = (seq, isRecentDept) => {
        const basePath =
            isRecentDept === 'recent'
                ? '/groovy/board/detail'
                : '/groovy/board/detailDept';
        return `${basePath}/${seq}`;
    };

    const inputChangeHandler = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className={style.boardContainer}>
            <div className={style.search}>
                <Input placeholder="검색" className={style.input_search} onChange={inputChangeHandler}></Input>
            </div>
            <hr />
            <div className={style.body}>
                <div className={style.margin}>최근 게시물</div>
                <hr />
                <div className={style.margin}>
                    <div className={style.boardTable}>
                        <div className={style.tableRow}>
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
                                        {e.name} {e.position}
                                    </div>
                                    <div className={style.tableCell}>
                                        {e.fseq !== 0 && (
                                            <InsertLinkIcon
                                                sx={{ color: blue[200] }}
                                            />
                                        )}
                                    </div>
                                    <div className={style.tableCell}>
                                        <Link
                                            to={getDetailLink(
                                                e.seq,
                                                e.isRecentDept
                                            )}
                                        >
                                            {e.title}
                                        </Link>
                                    </div>
                                    <div className={style.tableCell}>
                                        {e.view_count}
                                    </div>
                                    <div className={style.tableCell}>
                                        {e.dept} {e.category}
                                    </div>
                                    <div className={style.tableCell}>
                                        {e.write_date}
                                    </div>
                                </div>
                            ))
                            : boards
                                .filter(
                                    (e) =>
                                        e.name.includes(search) ||
                                        e.contents.includes(search) ||
                                        e.title.includes(search)
                                )
                                .map((e) => (
                                    <div
                                        key={e.seq}
                                        className={style.tableRow}
                                    >
                                        <div className={style.tableCell}>
                                            {e.name} {e.position}
                                        </div>
                                        <div className={style.tableCell}>
                                            {e.fseq !== 0 && (
                                                <InsertLinkIcon
                                                    sx={{ color: blue[200] }}
                                                />
                                            )}
                                        </div>
                                        <div className={style.tableCell}>
                                            <Link
                                                to={getDetailLink(
                                                    e.seq,
                                                    e.isRecentDept
                                                )}
                                            >
                                                {e.title}
                                            </Link>
                                        </div>
                                        <div className={style.tableCell}>
                                            {e.view_count}
                                        </div>
                                        <div className={style.tableCell}>
                                            {e.dept} {e.category}
                                        </div>
                                        <div className={style.tableCell}>
                                            {e.write_date}
                                        </div>
                                    </div>
                                ))}
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
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '15px 0',
                        }}
                        renderItem={(item) => (
                            <PaginationItem {...item} sx={{ fontSize: 15 }} />
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default List;
