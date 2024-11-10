import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './Write.module.css';
import axios from 'axios';
import ReactQuill from './ReactQuill';

function Update() {
    const [board, setBoard] = useState({});
    const navi = useNavigate();
    const { boardId } = useParams();

    useEffect(() => {
        axios.get(`/api/board/contents/${boardId}`)
            .then((resp) => {
                const boardData = resp.data;
                setBoard({
                    boardId: boardData.boardId,
                    boardTitle: boardData.boardTitle,
                    boardContents: boardData.boardContents,
                });
                console.log(boardData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [boardId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBoard((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setBoard((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const handleCancel = () => {
        navi(`/baemin/community/detail/${boardId}`);
    };

    const handleUpdate = () => {

        if (!board.boardTitle) {
            alert("제목은 필수 입력 항목입니다.");
            return;
        }

        if (!board.boardContents) {
            alert("내용은 필수 입력 항목입니다.");
            return;
        }

        const formData = new FormData();
        formData.append('boardTitle', board.boardTitle);
        formData.append('boardContents', board.boardContents);

        // 파일이 있을 경우에만 추가
        if (board.file) {
            formData.append('files', board.file);
        }

        axios.put(`/api/board/update/${boardId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((resp) => {
                navi(`/baemin/community/detail/${boardId}`);
            })
            .catch((e) => {
                console.error(e);
            });
    };

    return (
        <div className="boardContainer">
            <div className={style.write}>글 수정</div>
            <hr></hr>
            <div className={style.margin}>
                제목
                <input type="text" placeholder="제목" name="boardTitle" onChange={handleChange} value={board.boardTitle} className={style.title} /><br />
                <hr></hr>
                {/* 파일 첨부
                <input type="file" onChange={handleFileChange} className={style.file} /> */}
            </div>
            <hr></hr>
            <div className={style.editor}>
                <ReactQuill
                    id="editor"
                    value={board.boardContents}
                    setValue={(value) => setBoard({ ...board, boardContents: value })}
                />
            </div>

            <div className={style.btn}>
                <button onClick={handleUpdate}>수정</button>
                <button onClick={handleCancel}>취소</button>
            </div>
        </div>
    );
}

export default Update;
