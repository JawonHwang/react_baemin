import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import style from "./FeesManagement.module.css";
import Export from '../Export/Export';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

const FeesManagement = () => {
    /*----날짜----*/ 
    const today = new Date(); // 오늘 날짜
    const currentYear = today.getFullYear(); // 오늘 연도
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');// 오늘 월 (0부터 시작하므로 +1)
    const currentYearMonth = `${currentYear}-${currentMonth}`; // 예: "2024-09"
    const [year, setYear] = useState(currentYear); // 상태로 연도 관리
    const [month, setMonth] = useState(currentMonth);
    
    /*-----------*/
    const dt = useRef(null);
    const [products, setProducts] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(''); //검색필터
    const [payMethods] = useState([
        { name: '계좌이체' },
        { name: '현금' },
        { name: '카카오페이' },
        { name: '기타' }
    ]);

    const [confirms] = useState([
        { name: '미납' },
        { name: '부분납부' },
        { name: '납부완료' },
        { name: '연체' },
        { name: '확인 중' },
        { name: '취소' }
    ]);
    addLocale('ko', {
        chooseDate: '날짜 선택',
        today: '오늘',
        clear: '지우기',
        month: '월',
        year: '년',
        firstDayOfWeek: 0,
    });
    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/admin/management/memberShipFee/getAll/${year}-${month}`);
            const updatedProducts = response.data.map(product => ({
                ...product,
                shortFall: product.monthlyFee - product.amount,
            }));
            console.log(updatedProducts);
            setProducts(updatedProducts);
        } catch (error) {
            console.error('데이터를 불러오는데 문제가 발생했습니다.', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [year, month]);
    

    const handleGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilter(value === '' ? '' : value);
    };
    
    const onRowEditComplete = async (e) => {
        let _products = [...products];
        let { newData, index } = e;
        const fee = {
                monthlyFee: newData.monthlyFee,
                amount: newData.amount,
                payMethod: newData.payMethod,
                isPaid: newData.isPaid,
                payDate: newData.payDate,
                remarks: newData.remarks,
        };
    
        try {
            await axios.put(`/api/admin/management/fee/updateInfo/${newData.feeId}`, fee);
            _products[index] = newData;
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

    const numberEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="KRW" locale="ko-KR" />;
    };

    const numberBodyTemplate = (rowData, column) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(rowData[column.field]);
    };

    /*const statusBodyTemplate = (rowData) => {
        const status = payMethods.find(payMethod => payMethod.name == rowData.payMethod);
        return status ? status.name : '미지정';
    };*/

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

    // 테이블에 paid 값을 name으로 보여주기 위한 템플릿
    const confirmBodyTemplate = (rowData) => {
        const confirmStatus = confirms.find(confirm => confirm.id === rowData.paid);
        return confirmStatus ? confirmStatus.name : '상태 없음';
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
    
    const dateEditor = (options) => {
        return (
            <Calendar
                value={options.value}
                onChange={(e) => options.editorCallback(e.value)}
                dateFormat="yy-mm-dd"
                placeholder="날짜 선택"
                locale="ko"
                firstDayOfWeek={0}
                showIcon
                showButtonBar
            />
        );
    };

    const cols = [
        { field: 'feeId', header: '번호', bodyStyle: { display: 'none' }, headerStyle: { display: 'none' } },
        { field: 'member.memStuId', header: '학번' },
        { field: 'member.memName', header: '회원 이름' },
        { field: 'member.memContact', header: '연락처' },
        { field: 'monthlyFee', header: '월 회비', editor: numberEditor, body: numberBodyTemplate },
        { field: 'amount', header: '납부 금액', editor: numberEditor, body: numberBodyTemplate },
        { field: 'shortFall', header: '부족액', body: (rowData) => rowData.shortFall },
        { field: 'payMethod', header: '납부 방법', editor: statusEditor },
        { field: 'isPaid', header: '납부 여부', editor: confirmEditor },
        { field: 'payDate', header: '납부일', editor: dateEditor },
        { field: 'remarks', header: '비고', editor: textEditor },
        { field: 'admin.adminId', header: '수정자', editor: textEditor },
        { field: 'uptAt', header: '수정일' }
    ];

    // 다음 달로 이동하는 함수
    const goToNextMonth = () => {
        if (month === '12') {
            setYear(year + 1);
            setMonth('01');
        } else {
            setMonth(String(parseInt(month) + 1).padStart(2, '0'));
        }
    };
    
    const goToPreviousMonth = () => {
        if (month === '01') {
            setYear(year - 1);
            setMonth('12');
        } else {
            setMonth(String(parseInt(month) - 1).padStart(2, '0'));
        }
    };
    

    const exportColumns = cols
    .map(col => ({ title: col.header, dataKey: col.field }));

    const tableHeader = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
            {/* 첫 번째 div: 중앙에 배치 */}
            <div className="flex flex-wrap gap-5 align-items-center justify-content-center" style={{ flex: 1 }}>
                <Button icon="pi pi-arrow-left" onClick={goToPreviousMonth} />
                <div style={{fontSize:"1.5rem"}}>{year}년 {month}월</div>
                {!(year === currentYear && month === currentMonth) && (
                    <Button icon="pi pi-arrow-right" onClick={goToNextMonth} />
                )}
            </div>

            {/* 두 번째 div: 오른쪽에 배치 */}
            <div className="flex align-items-center justify-content-end">
                <Export dt={dt} exportColumns={exportColumns} products={products} />
            </div>
        </div>

    );
    const search = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <IconField iconPosition="left" style={{ maxWidth: '20rem' }}>
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={handleGlobalFilterChange} placeholder="Search..." />
            </IconField>
            <Link to="/baemin/admin/toFeesDetail"><Button icon="pi pi-cog">세부설정</Button></Link>
        </div>
    )

    const formatCurrency = (value) => {
        return value.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
    };

    const MonthTotal = () => {
        let total = 0;

        products.forEach(product => {
            total += product.monthlyFee || 0; // 값이 없으면 0으로 처리
        });

        return formatCurrency(total);
    };


    const paidTotal = () => {
        let total = 0;

        products.forEach(product => {
            total += product.amount || 0; // 값이 없으면 0으로 처리
        });

        return formatCurrency(total);
    };

    const shortFallTotal = () => {
        let total = 0;

        products.forEach(product => {
            total += product.shortFall || 0; // 값이 없으면 0으로 처리
        });

        return formatCurrency(total);
    };
    
    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Totals:" colSpan={3} footerStyle={{ textAlign: 'right' }} />
                <Column footer={MonthTotal} />
                <Column footer={paidTotal} />
                <Column footer={shortFallTotal} />
            </Row>
        </ColumnGroup>
    );

    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>회비 관리</div>
                {search}
            </div>
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
                    footerColumnGroup={footerGroup}
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
