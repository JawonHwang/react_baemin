import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./AdminManagement.module.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const AdminManagement = () => {
    const [products, setProducts] = useState([]);
    const [statuses] = useState(['회장', '부회장', '총무', '인사', '집행', '홍보']);

    useEffect(() => {
        fetchData();
    }, []);

    const mapAdminTypeName = (adminTypeName) => {
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
            const transformedData = response.data.map(admin => {
                return {
                    ...admin,
                    adminType: {
                        ...admin.adminType,
                        adminTypeName: mapAdminTypeName(admin.adminType.adminTypeName)
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

    const col = [
        { field: 'adminId', header: 'ID', style: { width: '180px'}, editor: (options) => textEditor(options)},
        { field: 'member.memPw', header: 'PW', style: { width: '180px' }, editor: (options) => textEditor(options) },
        { field: 'member.memName', header: '이름', style: { width: '150px' }, editor: (options) => textEditor(options) },
        { field: 'member.memContact', header: '전화번호', style: { width: '150px' }, editor: (options) => textEditor(options) },
        { field: 'member.memEmail', header: '이메일', style: { width: '220px' }, editor: (options) => textEditor(options) },
        { field: 'member.memBirth', header: '생일', style: { width: '150px' }, editor: (options) => textEditor(options) },
        { field: 'member.memDept', header: '학과', style: { width: '200px' }, editor: (options) => textEditor(options) },
        { field: 'member.memStuId', header: '학번', style: { width: '150px' }, editor: (options) => textEditor(options) },
        { field: 'member.memGender', header: '성별', style: { width: '80px' }, editor: (options) => textEditor(options) },
        { field: 'member.memClubNum', header: '기수', style: { width: '80px' }, editor: (options) => textEditor(options) },
        { field: 'member.memTierId', header: '티어', style: { width: '80px' }, editor: (options) => textEditor(options) },
        { field: 'adminType.adminTypeName', header: '관리자 유형', style: { width: '200px' }, editor: (options) => statusEditor(options) }
    ];
    
    return (
        <div className={style.container}>
            <div className={style.title}>관리자 관리</div>
            <hr></hr>
            <div className="card p-fluid">
                <DataTable value={products} editMode="row" dataKey="adminId" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '60rem' }}>
                    {col.map(({ field, header, editor, style }) => {
                        return <Column key={field} field={field} header={header} editor={editor} style={style}  />;
                    })}
                    <Column rowEditor={allowEdit} headerStyle={{ width: '3%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>
        </div>
    );
}

export default AdminManagement;