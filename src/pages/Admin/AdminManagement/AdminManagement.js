import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./AdminManagement.module.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';

const AdminManagement = () => {
    const [products, setProducts] = useState([]);
    const [statuses] = useState([
        { label: '회장', value: 'PD' },
        { label: '부회장', value: 'VP' },
        { label: '총무', value: 'TR' },
        { label: '인사', value: 'HR' },
        { label: '집행', value: 'ED' },
        { label: '홍보', value: 'PR' },
    ]);
    const [tiers] = useState([
        { label: 1, value: 'S' },
        { label: 2, value: 'A' },
        { label: 3, value: 'B' },
        { label: 4, value: 'C' },
        { label: 5, value: 'D' },
        { label: 6, value: 'NEWB' },
    ]);
    const [globalFilter, setGlobalFilter] = useState(''); //검색필터

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/admin/management/admin/getAll');
            const transformedData = response.data.map(admin => {
                const adminStatus = admin.adminType ? statuses.find(status => status.value === admin.adminType.adminTypeName) : null;
                return {
                    ...admin,
                    adminType: adminStatus ? {
                        adminTypeName: adminStatus.label,
                        value: adminStatus.value
                    } : {
                        adminTypeName: "선택해주세요.",
                        value: null
                    }
                };
            });
            setProducts(transformedData);
        } catch (error) {
            alert("문제가 발생했습니다. 관리자에게 문의해 주세요.");
        }
    };
    

    const onRowEditComplete = async (e) => {
        let _products = [...products];
        let { newData, index } = e;
        const adminData = {
            adminType: newData.adminType,
            member: {
                memClubNum: newData.member.memClubNum,

                memberTier: {
                    memTier: newData.member.memberTier.memTier
                }
            }
        };
    
        try {
            await axios.put(`/api/admin/management/admin/updateInfo/${newData.adminId}`, adminData);
            _products[index] = newData;
            //setProducts(_products);
            fetchData();
            alert("정보가 업데이트되었습니다.");
        } catch (error) {
            alert("업데이트 실패했습니다.");
            fetchData();
        }
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    //관리자유형 옵션
    const statusEditor = (options) => {
        return (
            <Dropdown 
                value={options.rowData.adminType.value}
                onChange={(e) => {
                    options.editorCallback(e.value);
                    options.rowData.adminType.value = e.value;
                }} 
                options={statuses} 
                optionLabel="label" 
                placeholder="선택해주세요" 
            />
        );
    };

    //티어 옵션
    const tiersEditor = (options) => {
        return (
            <Dropdown 
                value={options.rowData.member.memberTier.memTier}
                onChange={(e) => {
                    options.editorCallback(e.value);
                    options.rowData.member.memberTier.memTier = e.value;
                }}
                options={tiers}
                optionLabel="value"
                placeholder="선택해주세요" 
            />
        );
    };
    
    
    // 편집 가능한 조건
    const allowEdit = (rowData) => {
        return true;
    };

    // 관리자 권한 취소 버튼 렌더링 함수
    const renderMemberButton = (rowData) => {
        return (
            <Button 
                label="권한 취소" 
                icon="pi pi-lock" 
                onClick={() => handleAdminGrantCancle(rowData)}
            />
        );
    };

    // 관리자 권한 취소 처리 함수
    const handleAdminGrantCancle = async (admin) => {
    const confirmCancel = window.confirm("관리자 취소하시겠습니까?");
        if (confirmCancel) {
            try {
                await axios.post(`/api/admin/management/admin/revoke-role/${ admin.adminId }`);
                alert("관리자 취소 성공했습니다.");
                fetchData();
            } catch (error) {
                alert("관리자 취소 실패했습니다.");
                fetchData();
            }
        }
    };

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
        </div>
    );

    const col = [
        { field: 'adminId', header: 'ID'},
        { field: 'member.memName', header: '이름'},
        { field: 'member.memContact', header: '전화번호'},
        { field: 'member.memEmail', header: '이메일' },
        { field: 'member.memBirth', header: '생일' , style: { minWidth: '130px' }},
        { field: 'member.memDept', header: '학과' },
        { field: 'member.memStuId', header: '학번' },
        { field: 'member.memGender', header: '성별', style: { minWidth: '70px' } },
        { field: 'member.memClubNum', header: '기수', editor: (options) => textEditor(options), style: { minWidth: '70px' } },
        { field: 'member.memberTier.memTier', header: '티어', editor: (options) => tiersEditor(options), style: { minWidth: '70px' }  },
        { field: 'adminType.adminTypeName', header: '관리자 유형', style: { minWidth: '140px' }, editor: (options) => statusEditor(options) },
        { field: 'approvalCancle', header: '관리자 권한 취소', body: renderMemberButton, style: { minWidth: '180px' }}
    ];
    
    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>관리자 관리</div>
                {tableHeader}
            </div>
            <hr className='w-full' style={{marginLeft:"0px",marginRight:"0px"}}></hr>
            <div className="card p-fluid">
                <DataTable value={products}  editMode="row" dataKey="adminId" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '100rem' }} globalFilter={globalFilter} paginator rowsPerPageOptions={[5, 10, 25]} rows={10}>
                    {col.map(({ field, header, editor, style, body }) => {
                        return <Column key={field} field={field} header={header} editor={editor} body={body} style={style} sortable />;
                    })}
                    <Column rowEditor={allowEdit} headerStyle={{ width: '3%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>
        </div>
    );
}

export default AdminManagement;