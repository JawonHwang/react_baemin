import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import style from "../Common.module.css";
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const NoticesAdd = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [valueTeam, setValueTeam] = useState('');
    const [visible, setVisible] = useState(false);
    const [TdVisible, setTdVisible] = useState(false);
    const [dates, setDates] = useState(null);
    const [dialogValue, setDialogValue] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);//분류

    const handleListClick = () => {
        navigate('/admin/toNoticesManagement');
    };

    const handleClick = () => {
        alert('등록버튼이 클릭되었습니다!');
    };
    
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

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
            <hr></hr>
            <div>
                <div className={style.buttons}>
                    <Button onClick={handleClick} className={style.radius20} style={{ fontSize: '0.9rem' }} rounded outlined severity="info">
                        등록
                    </Button>
                </div>

                <div className={style.contents}>
                    <div className={style.lists}>

                        <div className={`${style.flex}`}>
                            <div className={`${style.left} ${style.common} ${style.list1}`}>분류</div>
                            <div className={`${style.right} ${style.common} ${style.list1}`}>
                                <Dropdown  value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" 
                                    placeholder="분류 선택해주세요." className={`${style.list1}`} style={{ border: 'none', borderRadius:'15px', width:'100%',paddingLeft:'2%'}}/>
                            </div>
                        </div>
                        <div className={`${style.flex}`}>
                            <div className={`${style.left} ${style.common} ${style.list1}`}>제목</div>
                            <div className={`${style.right} ${style.common} ${style.list1}`}>
                                <input className={`${style.rightList1} ${style.common} ${style.list1}`}
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="제목 입력해주세요."
                                    style={{ padding: '8px', border: 'none', width:'100%',paddingLeft:'2%' }}
                                />
                            </div>
                        </div>

                        <div className={`${style.flex}`}>
                            <div className={`${style.left2}`}>
                                <div className={`${style.common} ${style.p7}`}>내용</div>
                                <div className={`${style.common} ${style.p7}`} style={{marginTop:'7%'}}>파일 추가</div>
                            </div>
                            <div className={`${style.right} ${style.common}`}>
                                <input 
                                    type="text"
                                    value={valueTeam}
                                    onChange={(e) => setValueTeam(e.target.value)}
                                    placeholder="팀 설정해주세요."
                                    style={{ padding: '8px', borderRadius: '15px', border: 'none', backgroundColor:'white', marginLeft:'2%', width:'90%' }} readOnly
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