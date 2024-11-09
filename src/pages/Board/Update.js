import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './Write.module.css';
import axios from 'axios';
import ReactQuill from './ReactQuill';

function Update() {
    const [board, setBoard] = useState({
        seq: "",
        title: "",
        file: null, 
        contents: "",
        category: "",
    });
    const navi = useNavigate();
    const { seq } = useParams();

    useEffect(() => {
        axios.get(`/api/boards/update/${seq}`)
            .then((resp) => {
                const boardData = resp.data;
                setBoard({
                    seq: boardData.seq,
                    title: boardData.title,
                    contents: boardData.contents,
                    category: boardData.category,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, [seq]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBoard((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setBoard((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const handleCancel = () => {
        navi(`/groovy/board/detail/${seq}`);
    };

    const handleUpdate = () => {

        if (!board.title) {
            alert("제목은 필수 입력 항목입니다.");
            return;
        }

        if (!board.contents) {
            alert("내용은 필수 입력 항목입니다.");
            return;
        }
        
        if (!board.category) {
            alert("카테고리는 필수 입력 항목입니다.");
            return;
        }

        const formData = new FormData();
        formData.append('title', board.title);
        formData.append('contents', board.contents);
        formData.append('category', board.category);
        formData.append('files', board.file);

        axios.put(`/api/boards/update/${seq}`, formData, {})
            .then((resp) => {
                navi(`/groovy/board/detail/${seq}`);
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
                <input type="text" placeholder="제목" name="title" onChange={handleChange} value={board.title} className={style.title} /><br />
                <hr></hr>
                파일 첨부
                <input type="file" onChange={handleFileChange} className={style.file} />
                <hr></hr>
                카테고리
                <select name="category" onChange={handleChange} value={board.category} className={style.category}>
                    <option value="공지">공지</option>
                    <option value="자유">자유</option>
                </select>
            </div>
            <hr></hr>
            <div className={style.editor}>
                <ReactQuill
                    id="editor"
                    value={board.contents}
                    setValue={(value) => setBoard({ ...board, contents: value })}
                />
            </div>

            <div className={style.btn}>
                <button onClick={handleUpdate}>수정</button>
                <button onClick={handleCancel}>수정 취소</button>
            </div>
        </div>
    );
}

export default Update;
