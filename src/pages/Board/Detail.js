import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import style from "./Detail.module.css";
import { Pagination, PaginationItem } from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { LoginContext } from '../../App';

const CircularIndeterminate = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );
};

const Detail = () => {
    const { loginID } = useContext(LoginContext);

    const { boardId } = useParams();
    const navi = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const COUNT_PER_PAGE = 4;

    const [Board, setBoard] = useState({});
    // const [Reply, setReply] = useState([]);
    // const [newReply, setNewReply] = useState('');
    // const [showReply, setShowReply] = useState(false);
    // const [editingReply, setEditingReply] = useState(null);
    // const [editedReply, setEditedReply] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/board/contents/${boardId}`).then((resp) => {
            setBoard(resp.data);
            axios.get(`/api/boardFile/${boardId}`).then((resp) => {
                setFiles(resp.data);
            });
            setLoading(false);
        });
    }, [boardId]);

    // useEffect(() => {
    //     axios.get(`/api/reply/com/${seq}`).then((resp) => {
    //         setReply(resp.data);
    //         setShowReply(true);
    //     });
    // }, [Board]);

    const handleBack = () => {
        navi(-1);
    };

    const handleDelete = () => {
        axios
            .delete(`/api/board/delete/${boardId}`)
            .then((resp) => {
                navi("/baemin/community");
            })
            .catch(() => { });
    };

    // const handleDelete2 = (replySeq) => {
    //     axios
    //         .delete(`/api/reply/com/${replySeq}`)
    //         .then((resp) => {
    //             axios.get(`/api/reply/com/${seq}`).then((resp) => {
    //                 setReply(resp.data);
    //             });
    //         })
    //         .catch(() => { });
    // };

    // const handleAddReply = (e) => {
    //     if (e.key === 'Enter' && !e.shiftKey) {
    //         e.preventDefault();

    //         const formData = new FormData();
    //         formData.append('writer', loginID);
    //         formData.append('contents', newReply);
    //         formData.append('parent_seq', Board.seq);

    //         axios.post(`/api/reply`, formData)
    //             .then((resp) => {
    //                 axios.get(`/api/reply/com/${seq}`).then((resp) => {
    //                     setReply(resp.data);
    //                 });
    //                 setNewReply('');
    //             })
    //             .catch((error) => {
    //                 console.error(error);
    //             });
    //     }
    // };

    // const handleEditClick = (seq) => {
    //     setEditingReply(seq);
    //     const editingIndex = Reply.findIndex((reply) => reply.seq === seq);
    //     setEditedReply(Reply[editingIndex].contents);
    // };

    // const handleCancelEdit = () => {
    //     setEditingReply(null);
    //     setEditedReply('');
    // };

    // const handleSaveEdit = () => {
    //     if (!editedReply.trim()) {
    //         alert("댓글 내용을 입력하세요.");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('contents', editedReply);

    //     axios.put(`/api/reply/update/${editingReply}`, formData)
    //         .then((resp) => {
    //             setEditingReply(null);
    //             setEditedReply('');
    //             axios.get(`/api/reply/com/${seq}`).then((resp) => {
    //                 setReply(resp.data);
    //             });
    //         })
    //         .catch(() => { });
    // };

    const handleDownload = (boardFileSysName) => {
        axios.get(`/api/boardFile/download/${boardFileSysName}`, {
            responseType: 'blob',
        })
            .then((response) => {
                const file = new Blob([response.data], { type: response.headers['content-type'] });
                const fileURL = URL.createObjectURL(file);

                const link = document.createElement('a');
                link.href = fileURL;
                link.setAttribute('download', boardFileSysName);
                document.body.appendChild(link);

                link.click();

                link.parentNode.removeChild(link);
                URL.revokeObjectURL(fileURL);
            })
            .catch((error) => {
            });
    };


    // const totalItems = Reply.length;
    // const totalPages = Math.ceil(totalItems / COUNT_PER_PAGE);

    // const onPageChange = (e, page) => {
    //     setCurrentPage(page);
    // };

    // const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
    // const endIndex = Math.min(startIndex + COUNT_PER_PAGE, totalItems);
    // const visibleReply = Reply.slice(startIndex, endIndex);

    if (loading) {
        return <CircularIndeterminate />;
    }

    return (
        <div className={style.boardContainer}>
            <div>
                <div className={style.title}>{Board.boardTitle}</div>
                <div className={style.info}>
                    <div className={style.left}>

                    </div>
                    <div className={style.right}>
                        <div className={style.writer}>{Board.boardWriter}</div>
                        <div className={style.num}>
                            <div className={style.write_date}>{Board.boardWriteDate}</div>
                            <div className={style.view_count}>조회수 {Board.boardViewCount}</div>
                        </div>
                    </div>
                    <div className={style.end}>
                        <div align="end" className={style.buttons}>
                            {loginID == Board.boardWriter ? (
                                <>
                                    <Link to="/baemin/community" >
                                        <button>Back</button>
                                    </Link>
                                    <button onClick={handleDelete}>Del</button>
                                    <Link to={`/baemin/community/update/${boardId}`}>
                                        <button>Edit</button>
                                    </Link>
                                </>
                            ) : (
                                <button onClick={handleBack}>Back</button>
                            )}
                        </div>
                    </div>
                </div>
                <hr></hr>
                {files.length > 0 && (
                    <><div className={style.file}>
                        첨부 파일 :
                        <div className={style.files}>
                            {files.map((file) => (
                                <p key={file.boardFileParentId}>
                                    |{" "}
                                    <span
                                        style={{ color: "blue", cursor: "pointer" }}
                                        onClick={() => handleDownload(file.boardFileSysName)}
                                    >
                                        {file.boardFileOriName}
                                    </span>
                                </p>
                            ))}
                        </div>
                    </div>
                        <hr></hr>
                    </>
                )}
                <div className={style.contents} dangerouslySetInnerHTML={{ __html: Board.boardContents }}></div>
            </div>
            {/* {showReply && (
                <>
                    <hr />
                    <div>
                        <div className={style.reply}>
                            <textarea
                                className={style.replyForm}
                                rows="4"
                                placeholder="댓글을 입력하세요."
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                onKeyDown={handleAddReply}
                            />
                        </div>
                        <div className={style.reply}>
                            {visibleReply.map((reply) => (
                                <div key={reply.seq} className={style.replyDiv}>
                                    <div className={style.profile}>
                                        <img src={reply.profile_image ? `/profiles/${reply.profile_image}` : `/assets/Default_pfp.svg`} alt="profile" />
                                    </div>
                                    <div className={style.text}>
                                        <p>{reply.name} {reply.group_name} {reply.position}</p>
                                        {editingReply === reply.seq ? (
                                            <>
                                                <textarea className={style.replyForm} rows="4" value={editedReply} onChange={(e) => setEditedReply(e.target.value)} />
                                                <div className={style.btn}>
                                                    <button onClick={handleSaveEdit}>완료</button>
                                                    <button onClick={handleCancelEdit}>취소</button>
                                                </div>
                                            </>
                                        ) : (<p className={style.recontents}>{reply.contents}</p>)}
                                        <p>{reply.write_date}</p>
                                    </div>
                                    <div className={style.btn}>
                                        {editingReply !== reply.seq && loginID == reply.writer && (
                                            <>
                                                <button onClick={() => handleEditClick(reply.seq)}>수정</button>
                                                <button onClick={() => handleDelete2(reply.seq)}>삭제</button>

                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
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
                </>
            )} */}
        </div>
    );
};

export default Detail;
