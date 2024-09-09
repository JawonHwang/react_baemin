import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import style from "./TournamentsManagement.module.css";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";

const TournamentsAdd = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [valueTeam, setValueTeam] = useState('');
    const [visible, setVisible] = useState(false);
    const [TdVisible, setTdVisible] = useState(false);
    const [dates, setDates] = useState(null);
    const [dialogValue, setDialogValue] = useState('');

    const handleListClick = () => {
        navigate('/admin/toTournamentsManagement');
    };

    const handleClick = () => {
        alert('등록버튼이 클릭되었습니다!');
    };
    
    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">대회 추가</span>
        </div>
    );
    
    const footerContent = (
        <Button 
            label="등록" 
            style={{borderRadius:'15px'}} 
            onClick={() => {
                setValue(dialogValue);
                setVisible(false);
                setDialogValue('');
            }} 
            autoFocus 
        />
    );

    const headerTeamElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">참가자 설정</span>
        </div>
    );

    const footerTeamContent = (
        <Button 
            label="다음"
            style={{borderRadius:'15px'}} 
            onClick={() => {
                setValue(dialogValue);
                setVisible(false);
                setDialogValue('');
            }} 
            autoFocus 
        />
    );
    return (
        <div className={style.container}>
            <div className={style.title}>
                <div >대회 일정 추가</div>
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
                            <div className={`${style.left} ${style.common} ${style.list1}`}>대회추가</div>
                            <div className={`${style.right} ${style.common} ${style.list1}`}>
                                <input className={`${style.rightList1} ${style.common} ${style.list1}`}
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="대회 추가해주세요."
                                    style={{ padding: '8px', border: 'none', width:'90%',marginLeft:'2%' }} disabled 
                                />
                                <button className={`${style.common} ${style.list1}`} onClick={() => setVisible(true)}><i className="pi pi-plus" style={{ fontSize: '0.9rem' }}></i></button>
                                <Dialog visible={visible} modal header={headerElement} footer={footerContent} style={{ width: '23rem' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                                <div style={{ width: '95%' }}>
                                    {/*<input className={`${style.common}`}
                                        type="text"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder="대회명을 입력해주세요."
                                        style={{ padding: '8px', width:'90%' }}
                                    />*/}
                                    <InputText placeholder="대회명을 입력해주세요." value={dialogValue} onChange={(e) => setDialogValue(e.target.value)} style={{width:'100%'}}/>
                                    <div className={`${style.calendar}`}>
                                        <Calendar  value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection dateFormat="yy/mm/dd" showIcon showButtonBar />
                                    </div>
                                </div>
                                
                                </Dialog>
                            </div>
                        </div>
                    
                        <div className={`${style.flex}`}>
                            <div className={`${style.left} ${style.common}`}>팀 설정</div>
                            <div className={`${style.right} ${style.common}`}>
                                <input 
                                    type="text"
                                    value={valueTeam}
                                    onChange={(e) => setValueTeam(e.target.value)}
                                    placeholder="팀 설정해주세요."
                                    style={{ padding: '8px', borderRadius: '15px', border: 'none', backgroundColor:'white', marginLeft:'2%', width:'90%' }} disabled
                                />
                                <button style={{border: 'none',background:'none'}} onClick={() => setTdVisible(true)}><i className="pi pi-plus" style={{ fontSize: '0.9rem', }}></i></button>
                                <Dialog visible={TdVisible} modal header={headerTeamElement} footer={footerTeamContent} style={{ width: '23rem' }} onHide={() => {if (!TdVisible) return; setTdVisible(false); }}></Dialog>
                            </div>
                        </div>

                        <div className={`${style.flex}`}>
                            <div className={`${style.left} ${style.common}`}  style={{alignSelf:"flex-start"}}>대진표 미리보기</div>
                            <div className={`${style.right} ${style.common}`} style={{height:'35rem'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TournamentsAdd;