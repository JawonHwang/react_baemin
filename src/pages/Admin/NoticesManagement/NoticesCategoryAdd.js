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

    const [products, setProducts] = useState([]);
    const fetchData = async () => {
        try {
          const response = await axios.get('/api/admin/management/noticeTag/getAll');
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

    useEffect(() => {
        fetchData();
    }, []);

    const handleListClick = () => {
        navigate('/admin/toNoticesManagement');
    };

    const handleClick = () => {
        alert('등록버튼이 클릭되었습니다!');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await axios.post('/api/admin/management/noticeTag/insert', {
                notTagName: value,
            });
          console.log('Response:', response.data);
          alert('등록 되었습니다.');
        } catch (error) {
          console.error('Error adding item:', error);
          alert('등록 실패하였습니다.');
        }
      };
    
    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2 xl:mr-5">
                    <span className="font-bold"><i className="pi pi-tag text-sm pr-3"></i>{item.notTagName}</span>
                </div>
                <span className="font-bold">{item.creAdmin.adminId}</span>
                <span className="font-bold">{item.uptAdmin.adminId}</span>
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
                    <Button onClick={handleClick} className={style.radius20} style={{ fontSize: '0.9rem' ,marginRight:'1.5%'}} rounded outlined severity="info">
                        수정
                    </Button>
                    <Button onClick={handleClick} className={style.radius20} style={{ fontSize: '0.9rem' }} rounded outlined severity="danger">
                        삭제
                    </Button>
                </div>

                <div className={style.contents}>
                    <div className={style.flex}>
                        <div className={style.left} style={{width:'30%'}} >
                            <form onSubmit={handleSubmit}>
                                <div className={`${style.flexBetween}`} style={{height:'100%'}}>
                                    <div className={`${style.list1} ${style.common}`} style={{width:'40%',paddingTop:'2%',paddingBottom:'2%'}}>분류명</div>
                                    <div><button className={`${style.radius20} ${style.button1px}`} onClick={handleSubmit} >등록</button></div>
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
                                <OrderList dataKey="notTagId" value={products} onChange={(e) => setProducts(e.value)} itemTemplate={itemTemplate} header="태그 목록"></OrderList>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    );
}

export default NoticesCategoryAdd;