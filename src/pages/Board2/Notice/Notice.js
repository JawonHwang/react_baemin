import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { useNavigate } from 'react-router-dom';

        
const Notice = () => {
    const [customers, setCustomers] = useState([]);

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

    const handleGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilter(value === '' ? '' : value); // 필터링 값으로 설정
    };

    const ontitleClick = (rowData) => {
        axios.put(`/api/admin/management/notice/incrementView/${rowData.notId}`)
            .then(response => {
                navigate(`/baemin/board/toNoticeContent/${rowData.notId}`);
            })
            .catch(error => {
                alert('조회 오류 관리자에게 문의해주세요.');
            });
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
    ];

    const tableHeader = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div>
                <IconField iconPosition="left" style={{ maxWidth: '20rem' }}>
                    <InputIcon className="pi pi-search" />
                    <InputText type="search" onInput={handleGlobalFilterChange} placeholder="Search..." />
                </IconField>
            </div>
        </div>
    );

    return (
        <div className='w-full'>
            <div className='flex align-items-center'>
                <div style={{color:'#EEF300',fontSize:'small'}}>●</div>
                <div className = 'ml-3' style={{fontWeight:'bold',fontSize:'larger'}}>BOARD</div>
                <div className = 'ml-5' style={{fontWeight:'bolder',fontSize:'larger'}}>공지사항</div>
                <div style={{ marginLeft: 'auto' }}>
                    {tableHeader}
                </div>
            </div>
            
            <div className="p-fluid mt-5">
                <DataTable value={products} editMode="row" dataKey="notId" tableStyle={{ minWidth: '100rem' }} globalFilter={globalFilter} paginator rowsPerPageOptions={[5, 10, 25]} rows={10}>
                    {col.map(({ field, header, style, body }) => {
                        return <Column key={field} field={field} header={header} body={body} style={style} />;
                    })}
                    <Column headerStyle={{ width: '3%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>
        </div>
        
    );
}

export default Notice;