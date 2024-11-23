import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import style from "./List.module.css";
import { Pagination, PaginationItem } from "@mui/material";
import { Button } from "reactstrap";

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
    const [currentPage, setCurrentPage] = useState(1);
    const [photos, setPhotos] = useState([]);
    const [files, setFiles] = useState([]);
    const COUNT_PER_PAGE = 8;
    const [loading, setLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        // 데이터를 로드하기 시작할 때 로딩 상태를 true로 설정
        setLoading(true);

        // 사진 데이터 가져오기
        axios.get("/api/photo").then(resp => {
            const sortedPhotos = resp.data.sort((a, b) => b.photoId - a.photoId);
            setPhotos(sortedPhotos);
        });

        // 사진 파일 데이터 가져오기
        axios.get("/api/photoFile").then(resp => {
            const sortedFiles = resp.data.sort((a, b) => b.photoFileId - a.photoFileId);
            setFiles(sortedFiles);
        });

        // 모든 데이터가 로드되면 loading을 false로 변경
        setLoading(false);
    }, []);

    const totalItems = photos.length;
    const totalPages = Math.ceil(totalItems / COUNT_PER_PAGE);

    const onPageChange = (e, page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
    const endIndex = Math.min(startIndex + COUNT_PER_PAGE, totalItems);
    const visiblePhoto = photos.slice(startIndex, endIndex);

    if (loading) {
        // 로딩 중일 때는 CircularIndeterminate 컴포넌트를 보여줌
        return <CircularIndeterminate />;
    }

    return (
        <div className="Photocontainer">
            <div className='w-full'>
                <div className='flex align-items-center'>
                    <div style={{ color: '#EEF300', fontSize: 'small', marginLeft: '30px', marginTop: '30px' }}>●</div>
                    <div className='ml-3' style={{ fontWeight: 'bold', fontSize: 'larger', marginTop: '30px' }}>COMMUNITY</div>
                    <div className='ml-5' style={{ fontWeight: 'bolder', fontSize: 'larger', marginTop: '30px' }}>사진첩</div>
                </div>
            </div>
            <hr></hr>
            <div className={style.margin}>
                <div className={style.photoContainer}>
                    <div className={style.photoGrid}>
                        {visiblePhoto.map((photo) => {
                            // photoId에 해당하는 파일 찾기
                            const file = files.find(f => f.photoFileParentId === photo.photoId);

                            return (
                                <div key={photo.photoId} className={style.photoItem}>
                                    <img
                                        src={`/uploads/photo/${file?.photoFileSysName}`} // 해당 photoId에 맞는 파일 경로 사용
                                        alt={photo.photoTitle}
                                        className={style.photoThumbnail}
                                    />
                                    <div className={style.photoInfo}>
                                        <Link to={`detail/${photo.photoId}`}>
                                            <h3>{photo.photoTitle}</h3>
                                        </Link>
                                        <p>{photo.photoWriter}</p>
                                    </div>
                                </div>
                            );
                        })}
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
                    <Link to="/baemin/community/photo/write">
                        <Button color="primary" className={style.writeButton}>글 작성</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Free;