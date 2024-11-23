import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./NoticesManagement.module.css";
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Link, useLocation } from 'react-router-dom';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

const NoticesManagement = () => {
    const [products, setProducts] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');//검색필터
    const navigate = useNavigate();

    const fetchData = async () => {
        const response = await axios.get('/api/admin/management/notice/getAll');
        setProducts(response.data);
    }
    useEffect(() => {
        fetchData();
    }, []);

    const ontitleClick = (rowData) => {
        navigate(`/baemin/admin/toNoticesAdd/${rowData.notId}`);
    };

    const handleGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilter(value === '' ? '' : value); // 필터링 값으로 설정
    };

    const col = [
        { field: 'notId', header: '순번' },
        { 
            field: 'title', 
            header: '제목',
            body: (rowData) => (
                <span 
                    style={{ color: 'blue', cursor: 'pointer' }} 
                    onClick={() => ontitleClick(rowData)}
                >
                    {rowData.title}
                </span>
            ) 
        },
        { field: 'tag.notTagName', header: '태그'},
        { 
            field: 'views', 
            header: '조회수',
            body: (rowData) => {
                const iconColor = rowData.views > 100 ? 'green' : 'gray'; // 조회수에 따라 색상 변경
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="pi pi-eye" style={{ marginRight: '8px', color: iconColor }}></i>
                        {rowData.views}
                    </div>
                );
            }
        },
        { field: 'creAt', header: '등록일' },
        { field: 'adminId', header: '작성자' },
        { field: 'uptAt', header: '수정일' }
    ];

    const tableHeader = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div>
                <IconField iconPosition="left" style={{ maxWidth: '20rem' }}>
                    <InputIcon className="pi pi-search" />
                    <InputText type="search" onInput={handleGlobalFilterChange} placeholder="Search..." />
                </IconField>
            </div>
            <div className={style.buttons}>
                    <Link to="/baemin/admin/toNoticesAdd"><Button type="button" className={style.radius50} icon="pi pi-plus" rounded outlined severity="info" /></Link>
                    <Link to="/baemin/admin/toNoticesCategoryAdd"><Button type="button" className={style.radius50} rounded outlined severity="info">분류 관리</Button></Link>
                </div>
        </div>
    );

    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>공지사항 관리</div>
                {tableHeader}
            </div>
            
            <hr className='w-full' style={{marginLeft:"0px",marginRight:"0px"}}></hr>

            <div className="card p-fluid">
                <DataTable value={products}  size={'small'} editMode="row" dataKey="notId" tableStyle={{ minWidth: '100rem' }} globalFilter={globalFilter} paginator rowsPerPageOptions={[5, 10, 25]} rows={10}>
                    {col.map(({ field, header, editor, style, body }) => {
                        return <Column key={field} field={field} header={header} editor={editor} body={body} style={style} sortable />;
                    })}
                    <Column headerStyle={{ width: '3%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>
        </div>
    );
}

export default NoticesManagement;