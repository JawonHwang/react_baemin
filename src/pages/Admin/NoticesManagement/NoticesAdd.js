import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import style from "../Common.module.css";
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import ReactQuill from '../../Board/ReactQuill';
import axios from 'axios';

const NoticesAdd = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Quill 에디터 내용 상태
    const [selectedCategory, setSelectedCategory] = useState(null);//분류
    const [category, setCategory] = useState([]);//카테고리
    const { notId } = useParams(); // URL에서 notId 추출
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchData();
    }, [notId]);


    const fetchData = async () => {
        try {
            // 카테고리 목록을 가져오는 API 호출
            const categoryResponse = await axios.get('/api/admin/management/noticeTag/getAll');
            const categories = categoryResponse.data.map(item => ({ name: item.notTagName, code: item.notTagId }));
            setCategory(categories);

            // notId가 있는 경우에만 공지 데이터 가져오기
            if (notId) {
                const response = await axios.get(`/api/admin/management/notice/${notId}`);
                const data = response.data;
                console.log(data);

                // 불러온 데이터로 상태 초기화
                setTitle(data.title || '');
                setContent(data.content || '');
                setSelectedCategory(
                    data.tag 
                        ? { code: data.tag.notTagId, name: data.tag.notTagName } 
                        : null
                );
                setIsEditMode(true); // 수정 모드로 설정
            } else {
                setIsEditMode(false); // 새 등록 모드
            }
        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
        }
    };
    

    const handleListClick = () => {
        navigate('/baemin/admin/toNoticesManagement');
    };

    const handleSubmit = () => {

        const data = {
            tag: selectedCategory ? { notTagId: selectedCategory.code, notTagName: selectedCategory.name } : null,
            title: title,
            content: content,
        };

        if (isEditMode) {
            axios.put(`/api/admin/management/notice/update/${notId}`, data)
                .then(response => {
                    alert('수정 성공!');
                    navigate('/baemin/admin/toNoticesManagement');
                })
                .catch(error => {
                    console.error("수정 실패:", error);
                    alert('수정 실패!');
                });
        } else {
            axios.post('/api/admin/management/notice/add', data)
                .then(response => {
                    alert('등록 성공!');
                    navigate('/baemin/admin/toNoticesManagement');
                })
                .catch(error => {
                    console.error("등록 실패:", error);
                    alert('등록 실패!');
                });
        }
    };
    
    const handleDelete = () => {
        axios.delete(`/api/admin/management/notice/delete/${notId}`)
            .then(response => {
                alert('삭제 성공!');
                navigate('/baemin/admin/toNoticesManagement');
            })
            .catch(error => {
                console.error("삭제 실패:", error);
                alert('삭제 실패!');
            });
    };

    return (
        <div className={style.container}>
            <div className={style.title}>
                <div >공지사항 등록</div>
                <div>
                    <Button className={style.radius20} onClick={handleListClick} rounded outlined severity="info">
                        <i className="pi pi-list" style={{ fontSize: '0.9rem' }}></i>
                    </Button>
                </div>
            </div>
            <hr className='w-full' style={{marginLeft:"0px",marginRight:"0px"}}></hr>
            <div>
                <div className={style.buttons}>
                    <Button onClick={handleSubmit} className={style.radius20} style={{ fontSize: '0.9rem' }} rounded outlined severity="info">
                        {isEditMode ? '수정' : '등록'}
                    </Button>
                    {isEditMode && (
                        <Button onClick={handleDelete} className={style.radius20} style={{ fontSize: '0.9rem' }} rounded outlined severity="danger">
                            삭제
                        </Button>
                    )}
                </div>

                <div className={style.contents}>
                    <div className={style.lists}>

                        <div className={`${style.flex}`}>
                            <div className={`${style.left} ${style.common} ${style.list1}`}>분류</div>
                            <div className={`${style.right} ${style.common} ${style.list1}`}>
                                <Dropdown  value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={category} optionLabel="name" 
                                    placeholder="분류 선택해주세요." className={`${style.list1}`} style={{ border: 'none', borderRadius:'15px', width:'100%',paddingLeft:'2%'}}/>
                            </div>
                        </div>
                        <div className={`${style.flex}`}>
                            <div className={`${style.left} ${style.common} ${style.list1}`}>제목</div>
                            <div className={`${style.right} ${style.common} ${style.list1}`}>
                                <input className={`${style.rightList1} ${style.common} ${style.list1}`}
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="제목 입력해주세요."
                                    style={{ padding: '8px', border: 'none', width:'100%',paddingLeft:'2%' }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-content-center" style={{marginTop:'1rem'}}>
                            <div className={`${style.left2}`}style={{justifyContent:'start'}}>
                                <div className={`${style.common} ${style.p7}`}>내용</div>
                                <div className={`${style.common} ${style.p7}`} style={{marginTop:'7%'}}>파일 추가</div>
                            </div>
                            <div className={`${style.right} `}>
                                <ReactQuill
                                        id="editor"
                                        className={`${style.common}`}
                                        style={{ height: '100%', width: "100%", outline: 'none' }}
                                        value={content}
                                        setValue={setContent} // setContent를 직접 전달하여 상태 업데이트
                                        isDisabled={false} // 읽기 전용 여부 (여기선 false로 설정)
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoticesAdd;