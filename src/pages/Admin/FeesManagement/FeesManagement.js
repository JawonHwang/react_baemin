import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./FeesManagement.module.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

const FeesManagement = () => {
    const [products, setProducts] = useState([]);

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

    
    const isPositiveInteger = (val) => {
        let str = String(val);

        str = str.trim();

        if (!str) {
            return false;
        }

        str = str.replace(/^0+/, '') || '0';
        let n = Math.floor(Number(str));

        return n !== Infinity && String(n) === str && n >= 0;
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case 'quantity':
            case 'price':
                if (isPositiveInteger(newValue)) rowData[field] = newValue;
                else event.preventDefault();
                break;

            default:
                if (newValue.trim().length > 0) rowData[field] = newValue;
                else event.preventDefault();
                break;
        }
    };

    const cellEditor = (options) => {
        if (options.field === 'price') return priceEditor(options);
        else return textEditor(options);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
    };

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" onKeyDown={(e) => e.stopPropagation()} />;
    };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
    };

    const col = [
        { field: 'adminId', header: 'ID' },
        { field: 'member.memPw', header: 'PW' },
        { field: 'member.memName', header: '이름' },
        { field: 'member.memContact', header: '전화번호' },
        { field: 'member.memEmail', header: '이메일' },
        { field: 'member.memBirth', header: '생일' },
        { field: 'member.memDept', header: '학과' },
        { field: 'member.memStuId', header: '학번' },
        { field: 'member.memGender', header: '성별' },
        { field: 'member.memClubNum', header: '기수' },
        { field: 'member.memTierId', header: '티어' },
        { field: 'adminType.adminTypeName', header: '관리자 유형'}
    ];

    useEffect(() => {
        fetchData();
    }, []);
    
    return (
        <div className={style.container}>
            <div className={style.title}>회비 관리</div>
            <hr></hr>
            <div className="card p-fluid">
                <DataTable value={products} editMode="cell" tableStyle={{ minWidth: '50rem' }}>
                    {col.map(({ field, header }) => {
                        return <Column key={field} field={field} header={header} style={style} body={field === 'price' && priceBodyTemplate} editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} />;
                    })}
                </DataTable>
            </div>
        </div>
    );
}

export default FeesManagement;