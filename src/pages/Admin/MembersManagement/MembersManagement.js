import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import style from "./MembersManagement.module.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Export from '../Export/Export';
const MembersManagement = () => {
    const [products, setProducts] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(''); //검색필터
    const dt = useRef(null);
    const [tiers] = useState([
        { label: 1, value: 'S' },
        { label: 2, value: 'A' },
        { label: 3, value: 'B' },
        { label: 4, value: 'C' },
        { label: 5, value: 'D' },
        { label: 6, value: 'NEWB' },
    ]);

    const fetchData = async () => {
    try {
        const response = await axios.get('/api/admin/management/member/getAll');
        setProducts(response.data);
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
};

    useEffect(() => {
        fetchData();
    }, []);

    const handleMemberBan = async (member) => {
        const confirmBan = window.confirm(`${member.memName}님 정지하시겠습니까?`);
        if (confirmBan) {
            try {
                await axios.put(`/api/admin/management/member/ban/${ member.memId }`);
                alert("정지 되었습니다.");
                fetchData();
            } catch (error) {
                alert("정지 실패했습니다. 다시 시도해주세요.");
                fetchData();
            }
        }
    };

    const handleMemberBanCancel = async (member) => {
        const confirmBanCancle = window.confirm(`${member.memName}님 정지 취소하시겠습니까?`);
        if (confirmBanCancle) {
            try {
                await axios.put(`/api/admin/management/member/banCancel/${ member.memId }`);
                alert("정지 취소되었습니다.");
                fetchData();
            } catch (error) {
                alert("정지 취소 실패했습니다. 다시 시도해주세요.");
                fetchData();
            }
        }
    };

    // 관리자 권한 부여 버튼 렌더링 함수
    const renderAdminButton = (rowData) => {
        return (
            <Button 
                label="권한부여" 
                icon="pi pi-lock" 
                onClick={() => handleAdminGrant(rowData)}
                disabled={rowData.ban}
            />
        );
    };

    // 관리자 권한 부여 처리 함수
    const handleAdminGrant = async (member) => {
        const confirmGrant = window.confirm("관리자로 부여하시겠습니까?");
            if (confirmGrant) {
                try {
                    await axios.post(`/api/admin/management/member/grant-role/${ member.memId }`);
                    
                    alert("관리자 부여 성공했습니다.\n상세설정은 관리자 관리 페이지에서 해주시길 바랍니다.");
                    fetchData();
                } catch (error) {
                    alert("관리자 부여 실패했습니다.");
                    fetchData();
                }
            }
    };
    const onRowEditComplete = async (e) => {
        let _products = [...products];
        let { newData, index } = e;
        console.log("newData : " + newData.memberTier.memTier);
        const member = {
                memClubNum: newData.memClubNum,
                memberTier: {
                    memTier: newData.memberTier.memTier
                }
        };
    
        try {
            await axios.put(`/api/admin/management/member/updateInfo/${newData.memId}`, member);
            _products[index] = newData;
            //setProducts(_products);
            alert("정보가 업데이트되었습니다.");
            fetchData();
        } catch (error) {
            alert("업데이트 실패했습니다.");
            fetchData();
        }
    };
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const statusEditor = (options) => {
        return (
            <Dropdown 
                value={options.rowData.memberTier.memTier}
                onChange={(e) => {
                    options.editorCallback(e.value);
                    options.rowData.memberTier.memTier = e.value;
                }}
                options={tiers}
                optionLabel="value"
                placeholder="선택해주세요" 
            />
        );
    };
    

    const cols = [
        { field: 'memId', header: 'ID' , style: { minWidth: '150px' } },
        { field: 'memStuId', header: '학번', style: { minWidth: '200px' } },
        { field: 'memName', header: '이름' },
        { field: 'memContact', header: '전화번호' },
        { field: 'memEmail', header: '이메일' },
        { field: 'memBirth', header: '생일' },
        { field: 'memDept', header: '학과' },
        { field: 'memGender', header: '성별' },
        { field: 'memClubNum', header: '기수', editor: (options) => textEditor(options) },
        { field: 'memberTier.memTier', header: '티어', editor: (options) => statusEditor(options) },
        { field: 'approval', header: '관리자 권한 부여', body: renderAdminButton , style: { minWidth: '200px' }},
        {
            field: 'ban', 
            header: '정지', 
            body: (rowData) => (
                <Button 
                    label={rowData.ban ? '취소' : '정지'}
                    icon="pi pi-ban"
                    onClick={rowData.ban ? () => handleMemberBanCancel(rowData) : () => handleMemberBan(rowData)}
                />
            )
        }
        //{ field: 'role', header: '권한' },
        
    ];

    const exportColumns = cols
    .filter(col => col.field !== 'approval')
    .map(col => ({ title: col.header, dataKey: col.field }));

    const handleGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilter(value === '' ? '' : value); 
    };
            
    const search = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <IconField iconPosition="left" style={{ maxWidth: '20rem' }}>
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={handleGlobalFilterChange} placeholder="Search..." />
            </IconField>
        </div>
    )
    

    const tableHeader = (
        <div>
            <Export dt={dt} exportColumns={exportColumns} products={products} />
        </div>
    );
    
    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>회원 관리</div>
                {search}
            </div>
            <hr className='w-full' style={{marginLeft:"0px",marginRight:"0px"}}></hr>
            <div className="card">
                <div className={style.dataTableWrapper}>
                    <DataTable editMode="row" onRowEditComplete={onRowEditComplete} size={'small'} ref={dt} value={products} header={tableHeader} paginator rowsPerPageOptions={[5, 10, 25]} rows={10} sortable globalFilter={globalFilter} tableStyle={{ minWidth: '100rem' }}>
                        {cols.map((col, index, editor, style) => (
                            <Column key={index} field={col.field} header={col.header} editor={col.editor} body={col.body} style={style} sortable  />
                        ))}
                        <Column rowEditor headerStyle={{ width: '3%', minWidth: '6rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

export default MembersManagement;