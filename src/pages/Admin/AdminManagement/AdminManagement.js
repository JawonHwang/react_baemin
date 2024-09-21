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
    const [statuses] = useState(['회장', '부회장', '총무', '인사', '집행', '홍보']);
    const [globalFilter, setGlobalFilter] = useState(''); //검색필터

    useEffect(() => {
        fetchData();
    }, []);

    const mapAdminTypeName = (adminTypeName) => {
        //if (!adminTypeName) return "정보 없음"; // null일 경우 처리
        switch (adminTypeName) {
            case 'PD':
                return '회장';
            case 'VP':
                return '부회장';
            case 'TR':
                return '총무';
            case 'HR':
                return '인사';
            case 'ED':
                return '집행';
            case 'PR':
                return '홍보';
            case 'SA':
                return '시스템관리자';
            default:
                return adminTypeName;
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/admin/management/admin/getAll');
            console.log(response.data);
            const transformedData = response.data.map(admin => {
                return {
                    ...admin,
                    adminType: admin.adminType ? {
                        ...admin.adminType,
                        adminTypeName: mapAdminTypeName(admin.adminType.adminTypeName)
                    } : {
                        adminTypeName: "선택해주세요." // adminType이 null일 경우 기본값 설정
                    }
                };
            });
            setProducts(transformedData);
        } catch (error) {
            console.error('Error fetching data: ', error);
            alert("문제가 발생했습니다. 관리자에게 문의해 주세요.");
        }
    };

    const onRowEditComplete = (e) => {
        let _products = [...products];
        let { newData, index } = e;

        _products[index] = newData;

        setProducts(_products);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const statusEditor = (options) => {
        return (
            <Dropdown value={options.value} onChange={(e) => options.editorCallback(e.value)} options={statuses} optionLabel="name" 
                placeholder="선택해주세요" />
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
        { field: 'adminId', header: 'ID', editor: (options) => textEditor(options)},
        { field: 'member.memName', header: '이름', editor: (options) => textEditor(options) },
        { field: 'member.memContact', header: '전화번호', editor: (options) => textEditor(options) },
        { field: 'member.memEmail', header: '이메일', editor: (options) => textEditor(options) },
        { field: 'member.memBirth', header: '생일', editor: (options) => textEditor(options) , style: { minWidth: '130px' }},
        { field: 'member.memDept', header: '학과', editor: (options) => textEditor(options) },
        { field: 'member.memStuId', header: '학번', editor: (options) => textEditor(options) },
        { field: 'member.memGender', header: '성별', editor: (options) => textEditor(options), style: { minWidth: '70px' } },
        { field: 'member.memClubNum', header: '기수', editor: (options) => textEditor(options), style: { minWidth: '70px' } },
        { field: 'member.memTierId', header: '티어', editor: (options) => textEditor(options), style: { minWidth: '70px' }  },
        { field: 'adminType.adminTypeName', header: '관리자 유형', style: { minWidth: '140px' }, editor: (options) => statusEditor(options) },
        { field: 'approvalCancle', header: '관리자 권한 취소', body: renderMemberButton, style: { minWidth: '180px' }}
    ];
    
    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>관리자 관리</div>
                {tableHeader}
            </div>
            <hr></hr>
            <div className="card p-fluid">
                <DataTable value={products}  editMode="row" dataKey="adminId" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '60rem' }} globalFilter={globalFilter}>
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