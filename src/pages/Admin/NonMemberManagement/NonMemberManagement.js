import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./NonMemberManagement.module.css";
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Column } from 'primereact/column';

const NonMemberManagement = () => {
    const [products, setProducts] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(''); //검색필터
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

    const fetchData = async () => {
        const response = await axios.get('/api/admin/management/nonMember/getAll');
        setProducts(response.data);
        console.log(response);
    }
    useEffect(() => {
        fetchData();
    }, []);

    const onNameClick = (rowData) => {
        navigate(`/baemin/join/detail/${rowData.joId}`); // joId를 URL에 포함해 이동
    };

    const disableButton = () => {
        const newState = !isButtonDisabled;
        setIsButtonDisabled(newState);
        
        // 상태를 localStorage에 저장
        localStorage.setItem('isButtonDisabled', newState ? 'true' : 'false');
        
        if (newState) {
            alert("비활성화되었습니다.");
        } else {
            alert("활성화되었습니다.");
        }
    };
    

    const col = [
        { field: 'joId', header: '순번' },
        { 
            field: 'joName', 
            header: '이름',
            body: (rowData) => (
                <span 
                    style={{ color: 'blue', cursor: 'pointer' }} 
                    onClick={() => onNameClick(rowData)}
                >
                    {rowData.joName}
                </span>
            ) 
        },
        { field: 'joContact', header: '전화번호'},
        { field: 'joGender', header: '성별' , style: { minWidth: '130px' }},
        { field: 'joDept', header: '학과' },
        { field: 'joStuId', header: '학번' },
        { field: 'interview.ivDate', header: '면접 가능 날짜' },
        { field: 'activityDate.adDate', header: '활동 참여 가능 요일' },
        { field: 'joSkill', header: '개인 기량' },
        { field: 'app', header: '승인여부' },
        { field: 'clubNumId', header: '기수' },
        { field: 'joApprDate', header: '신청날짜' }
    ];

    const handleGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilter(value === '' ? '' : value); // 필터링 값으로 설정
    };

    const tableHeader = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div>
                <IconField iconPosition="left" style={{ maxWidth: '20rem' }}>
                    <InputIcon className="pi pi-search" />
                    <InputText type="search" onInput={handleGlobalFilterChange} placeholder="Search..." />
                </IconField>
            </div>
            <div >
                <Button id="disableButton" onClick={disableButton}>
                    {isButtonDisabled ? '활성화' : '비활성화'}
                </Button>
            </div>
        </div>
    );

    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>비회원 관리</div>
                {tableHeader}
            </div>
            <hr />
            <div className="card p-fluid">
                <DataTable value={products}  editMode="row" dataKey="joId" tableStyle={{ minWidth: '60rem' }} globalFilter={globalFilter} paginator rowsPerPageOptions={[5, 10, 25]} rows={10}>
                    {col.map(({ field, header, editor, style, body }) => {
                        return <Column key={field} field={field} header={header} editor={editor} body={body} style={style} sortable />;
                    })}
                    <Column headerStyle={{ width: '3%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>
        </div>
    );
}

export default NonMemberManagement;