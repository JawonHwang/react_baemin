import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import style from "./FeesManagement.module.css";
import Export from '../Export/Export';

const FeesManagement = () => {
    const dt = useRef(null);
    const [products, setProducts] = useState([]);
    const [members, setMembers] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(''); // 초기값을 빈 문자열로 설정
    const [payMethods] = useState([
        { id: 1, name: '계좌이체' },
        { id: 2, name: '현금' },
        { id: 3, name: '카카오페이' },
        { id: 4, name: '기타' }
    ]);

    const [confirms] = useState([
        { id: 1, name: '미납' },
        { id: 2, name: '부분납부' },
        { id: 3, name: '납부완료' },
        { id: 4, name: '연체' },
        { id: 5, name: '확인 중' },
        { id: 6, name: '취소' }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const membersResponse = await axios.get('/api/admin/management/member/getAll');
                setMembers(membersResponse.data);

                const initialProducts = membersResponse.data.map(member => ({
                    feeId: null,
                    memStuId: member.memStuId,
                    memberName: member.memName,
                    memContact: member.memContact,
                    monthlyFee: '15000', // TODO : 김승엽
                    payMethodName: '선택해주세요.',
                    amount: '',
                    isPaid: '선택해주세요.',
                    payDate: '',
                    remarks: ''
                }));
                setProducts(initialProducts);
            } catch (error) {
                console.error('데이터를 불러오는데 문제가 발생했습니다.');
            }
        };
        fetchData();
    }, []);

    const handleGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilter(value === '' ? '' : value); // 필터링 값으로 설정
    };
    
    const onRowEditComplete = (e) => {
        let _products = [...products];
        let { newData, index } = e;
        _products[index] = newData;
        setProducts(_products);

        /* 서버에 데이터를 저장하는 로직 */
    };

    

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const numberEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="KRW" locale="ko-KR" />;
    };

    const numberBodyTemplate = (rowData, column) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(rowData[column.field]);
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={payMethods.find(method => method.name === options.value)}
                onChange={(e) => options.editorCallback(e.value.name)}
                options={payMethods}
                optionLabel="name"
                placeholder="선택해주세요."
            />
        );
    };
    
    const confirmEditor = (options) => {
        return (
            <Dropdown
                value={confirms.find(confirm => confirm.name === options.value)}
                onChange={(e) => options.editorCallback(e.value.name)}
                options={confirms}
                optionLabel="name"
                placeholder="선택해주세요."
            />
        );
    };

    const cols = [
        { field: 'feeId', header: '번호', bodyStyle: { display: 'none' }, headerStyle: { display: 'none' } },
        { field: 'memStuId', header: '회원 ID' },
        { field: 'memberName', header: '회원 이름' },
        { field: 'memContact', header: '연락처' },
        { field: 'monthlyFee', header: '월 회비', editor: numberEditor, body: numberBodyTemplate },
        { field: 'amount', header: '납부 금액', editor: numberEditor, body: numberBodyTemplate },
        { field: 'payMethodName', header: '납부 방법', editor: statusEditor },
        { field: 'isPaid', header: '납부 여부', editor: confirmEditor },
        { field: 'payDate', header: '납부일' },
        { field: 'remarks', header: '비고', editor: textEditor }
    ];

    const exportColumns = cols
    .map(col => ({ title: col.header, dataKey: col.field }));

    const tableHeader = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
            <div>
                <Export dt={dt} exportColumns={exportColumns} products={products} />
            </div>
            <div>
                <IconField iconPosition="left" style={{ maxWidth: '20rem' }}>
                    <InputIcon className="pi pi-search" />
                    <InputText type="search" onInput={handleGlobalFilterChange} placeholder="Search..." />
                </IconField>
            </div>
        </div>
    );
    

    return (
        <div className={style.container}>
            <div className={style.title}>회비 관리</div>
            <hr />
            <div className="card p-fluid">
                <DataTable
                    value={products}
                    editMode="row"
                    onRowEditComplete={onRowEditComplete}
                    tableStyle={{ minWidth: '50rem' }}
                    dataKey="feeId"
                    paginator
                    rows={10}
                    size={'small'}
                    rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter}
                    header={tableHeader}
                >
                    {cols.map(({ field, header, editor, body }) => (
                        <Column
                            key={field}
                            field={field}
                            header={header}
                            editor={editor}
                            body={body}
                            sortable
                            style={field === 'feeId' ? { display: 'none' } : {}}
                        />
                    ))}
                    <Column rowEditor headerStyle={{ width: '3%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default FeesManagement;
