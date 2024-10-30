import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from "../Common.module.css";
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { OrderList } from 'primereact/orderlist';

const NoticesCategoryAdd = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [selectedTag, setSelectedTag] = useState(null); // 선택된 태그
    const [showRegisterButton, setShowRegisterButton] = useState(true);
    const [showActionButtons, setShowActionButtons] = useState(false);
    const [isOrderChanged, setIsOrderChanged] = useState(false); // 추가: 순서 변경 상태 추적

    const [products, setProducts] = useState([]);
    const fetchData = async () => {
        try {
          const response = await axios.get('/api/admin/management/noticeTag/getAll');
          setProducts(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

    useEffect(() => {
        fetchData();
    }, []);

    const saveOrderChanges = async (updatedProducts) => {
        console.log(updatedProducts);
        try {
            await axios.put('/api/admin/management/noticeTag/updateOrder', updatedProducts);
            alert('순서가 업데이트 되었습니다.');
            setIsOrderChanged(false); // 저장 후 상태 초기화
            fetchData();
        } catch (error) {
            console.error('Error saving order changes:', error);
            alert('순서 저장에 실패했습니다.');
        }
    };

    // OrderList의 순서 변경 핸들러
    const handleOrderChange = (e) => {
        const updatedProducts = e.value.map((item, index) => ({
            ...item,
            order: index + 1
        }));
        setProducts(updatedProducts);
        setIsOrderChanged(true); // 순서가 변경되었음을 알림
    };

    const handleSaveOrder = () => {
        if (isOrderChanged) {
            saveOrderChanges(products); // 버튼 클릭 시 순서 저장
        } else {
            alert('변경된 사항이 없습니다.');
        }
    };

    const handleListClick = () => {
        navigate('/baemin/admin/toNoticesManagement');
    };

    const handleClick = () => {
        alert('등록버튼이 클릭되었습니다!');
    };

    const handleSubmitOrUpdate = async () => {
        if (!value.trim()) {
            alert('분류명을 입력해주세요.');
            return;
        }
    
        try {
            if (!selectedTag) {
                await axios.post('/api/admin/management/noticeTag/insert', { notTagName: value });
                alert('등록 되었습니다.');
            } else {
                await axios.put(`/api/admin/management/noticeTag/update/${selectedTag.notTagId}`, { notTagName: value });
                alert('수정 되었습니다.');
            }
            fetchData();
            setValue('');
            setSelectedTag(null);
            setShowRegisterButton(true);
            setShowActionButtons(false);
        } catch (error) {
            console.error('Error processing item:', error);
            alert(selectedTag ? '수정 실패하였습니다.' : '등록 실패하였습니다.');
        }
    };
    
    
    const handleDelete = async () => {
        // 삭제할 항목이 선택되지 않은 경우 경고 메시지 표시
        if (!selectedTag) {
            alert('삭제할 항목을 선택해주세요.');
            return;
        }

        const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
        if (!confirmDelete) {
            return; // 사용자가 취소를 선택한 경우 함수 종료
        }
        
        // 삭제 요청 수행
        try {
            await axios.delete(`/api/admin/management/noticeTag/delete/${selectedTag.notTagId}`);
            alert('삭제 되었습니다.');
            
            // 데이터 새로 고침
            fetchData();
            
            // 선택 및 입력 필드 초기화
            setSelectedTag(null);
            setValue('');
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('삭제 실패하였습니다.');
        }
    };
    
    
    const itemTemplate = (item) => {
        return (
            <div 
                className="flex flex-wrap p-2 align-items-center gap-3"
                onClick={() => {
                    setSelectedTag(item); // 선택한 태그 저장
                    setValue(item.notTagName); // input에 태그 이름 설정
                    setShowRegisterButton(false); // 등록 버튼 숨기기
                    setShowActionButtons(true); // 수정 및 삭제 버튼 보이기
                }}
                style={{ cursor: 'pointer' }}
            >
                <div className="flex-1 flex flex-column gap-2 xl:mr-5">
                    <span className="font-bold">
                        <i className="pi pi-tag text-sm pr-3"></i>
                        {item.notTagName}
                    </span>
                </div>
                <span className="font-bold">
                    {item.creAdmin ? item.creAdmin.adminId : ""}
                </span>
                <span className="font-bold">
                    {item.uptAdmin ? item.uptAdmin.adminId : ""}
                </span>
                <span className="font-bold">{item.creAt}</span>
            </div>
        );
    };
    

    return (
        <div className={style.container}>
            <div className={style.title}>
                <div>공지사항 분류 관리</div>
                <div>
                    <Button className={style.radius20} onClick={handleListClick} rounded outlined severity="info">
                        <i className="pi pi-list" style={{ fontSize: '0.9rem' }}></i>

                    </Button>
                </div>
            </div>
            <hr></hr>
            <div>
                <div className={style.buttons}>
                    <Button onClick={handleSaveOrder} className={style.radius20} style={{ fontSize: '0.9rem' ,marginRight:'1.5%'}} rounded outlined severity="success">
                        순서 저장
                    </Button>
                </div>
                <div className={style.contents}>
                    <div className={style.flex}>
                        <div className={style.left} style={{width:'30%'}} >
                            <form onSubmit={handleSubmitOrUpdate}>
                                <div className={`${style.flexBetween}`} style={{height:'100%'}}>
                                    <div className={`${style.list1} ${style.common}`} style={{width:'40%',paddingTop:'2%',paddingBottom:'2%'}}>분류명</div>
                                    {showRegisterButton && (
                                        <div><button className={`${style.radius20} ${style.button1px}`}>등록</button></div>
                                    )}
                                    {showActionButtons && (
                                        <div className={style.buttons}>
                                            <Button onClick={handleSubmitOrUpdate} className={style.radius20} style={{ fontSize: '0.9rem'}} rounded outlined severity="info">
                                                수정
                                            </Button>
                                            <Button onClick={handleDelete} className={style.radius20} style={{ fontSize: '0.9rem' }} rounded outlined severity="danger">
                                                삭제
                                            </Button>
                                        </div>
                                    )}    
                                    </div>
                                <div className={`${style.common}`} style={{marginTop:'3%'}}>
                                
                                    <input 
                                            type="text"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            placeholder="입력해주세요."
                                            style={{ padding: '8px', borderRadius: '15px', border: 'none', backgroundColor:'white', paddingLeft:'2%', width:'90%' , outline: 'none'}}
                                        />
                                </div>
                            </form>
                        </div>
                        
                        <div className={style.right} style={{width:'50%'}}>
                            <div className="card xl:flex xl:justify-content-center">
                                <OrderList dataKey="notTagId" value={products} onChange={handleOrderChange} itemTemplate={itemTemplate} header="태그 목록"></OrderList>
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    );
}

export default NoticesCategoryAdd;