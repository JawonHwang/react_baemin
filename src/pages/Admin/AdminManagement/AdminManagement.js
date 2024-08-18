import React, { useState, useEffect, useRef } from 'react';
import style from "./AdminManagement.module.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

const AdminManagement = () => {
    const [products, setProducts] = useState([]);

    const columns = [
        { field: 'ID', header: 'ID' },
        { field: 'PW', header: 'PW' },
        { field: 'NAME', header: '이름' },
        { field: 'TEL', header: '전화번호' },
        { field: 'EMAIL', header: '이메일' },
        { field: 'BIRTH', header: '생일' },
        { field: 'DEPT', header: '학과' },
        { field: 'STU_ID', header: '학번' },
        { field: 'GENDER', header: '성별' },
        { field: 'TEL', header: '기수' },
        { field: 'TEL', header: '티어' },
        { field: 'TEL', header: '가입신청일자' },
        { field: 'TEL', header: '승인일자' },
        { field: 'TEL', header: '권한' }
    ];

    /*useEffect(() => {
        ProductService.getProductsMini().then((data) => setProducts(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps*/

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

    return (
        <div className={style.container}>
            <div className={style.title}>관리자 관리</div>
            <hr></hr>
            <div className="card p-fluid">
                <DataTable value={products} editMode="cell" tableStyle={{ minWidth: '50rem' }}>
                    {columns.map(({ field, header }) => {
                        return <Column key={field} field={field} header={header} style={{ width: '25%' }} body={field === 'price' && priceBodyTemplate} editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} />;
                    })}
                </DataTable>
            </div>
        </div>
    );
}

export default AdminManagement;