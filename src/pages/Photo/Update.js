import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './Write.module.css';
import axios from 'axios';
import ReactQuill from './ReactQuill';

function Update() {
    const [photo, setPhoto] = useState({});
    const navi = useNavigate();
    const { photoId } = useParams();

    useEffect(() => {
        axios.get(`/api/photo/contents/${photoId}`)
            .then((resp) => {
                const photoData = resp.data;
                setPhoto({
                    photoId: photoData.photoId,
                    photoTitle: photoData.photoTitle,
                    photoContents: photoData.photoContents,
                });
                console.log(photoData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [photoId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPhoto((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setPhoto((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const handleCancel = () => {
        navi(`/baemin/community/photo/detail/${photoId}`);
    };

    const handleUpdate = () => {

        if (!photo.photoTitle) {
            alert("제목은 필수 입력 항목입니다.");
            return;
        }

        if (!photo.photoContents) {
            alert("내용은 필수 입력 항목입니다.");
            return;
        }

        const formData = new FormData();
        formData.append('photoTitle', photo.photoTitle);
        formData.append('photoContents', photo.photoContents);

        // 파일이 있을 경우에만 추가
        if (photo.file) {
            formData.append('files', photo.file);
        }

        axios.put(`/api/photo/update/${photoId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((resp) => {
                navi(`/baemin/community/photo/detail/${photoId}`);
            })
            .catch((e) => {
                console.error(e);
            });
    };

    return (
        <div className="photoContainer">
            <div className={style.write}>글 수정</div>
            <hr></hr>
            <div className={style.margin}>
                제목
                <input type="text" placeholder="제목" name="photoTitle" onChange={handleChange} value={photo.photoTitle} className={style.title} /><br />
                <hr></hr>
                {/* 파일 첨부
                <input type="file" onChange={handleFileChange} className={style.file} /> */}
            </div>
            <hr></hr>
            <div className={style.editor}>
                <ReactQuill
                    id="editor"
                    value={photo.photoContents}
                    setValue={(value) => setPhoto({ ...photo, photoContents: value })}
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
