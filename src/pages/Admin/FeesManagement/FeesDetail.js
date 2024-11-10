import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { useNavigate } from 'react-router-dom';
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

const FeesDetail = () => {
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

    //행 추가
    const [isAddingNewRow, setIsAddingNewRow] = useState(false);
    const [newProduct, setNewProduct] = useState({ admin: { adminId: null } }); // 초기값 설정

    const navigate = useNavigate();
    /*const [payMethods] = useState([
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
    ]);*/
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
            const response = await axios.get("/api/admin/management/feeDetail/getAll");
            /*const updatedProducts = response.data.map(product => ({
                ...product,
                totalMoney: product.income - product.expend,
            }));*/
            //setProducts(updatedProducts);
            console.log(response.data);
            setProducts(response.data);
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

        if (newData.ddate == null) {
            alert("날짜를 선택해주세요.");
            return;
        }
        if (newData.content == null || newData.content.trim() === "") {
            alert("내용을 입력해주세요.");
            return;
        }
        if (newData.income == 0 && newData.expend == 0) {
            alert("수입 또는 지출을 입력해주세요.");
            return;
        }

        // 총금액 계산 로직
        let previousTotal = index > 0 ? _products[index - 1].totalMoney : 0;
        let calculatedTotal = previousTotal + (newData.income || 0) - (newData.expend || 0);
        
        const feeDatail = {
            feeDetailId: newData.feeDetailId,
            ddate: newData.ddate,
            content: newData.content,
            income: newData.income,
            expend: newData.expend,
            totalMoney: calculatedTotal,
        };
        try {
            if (newData.feeDetailId == null) {
                await axios.post('/api/admin/management/feeDetail/insert', feeDatail);
                alert("정보가 등록되었습니다.");
            } else {
                await axios.put(`/api/admin/management/feeDetail/feeDetailInfo/${newData.feeDetailId}`, feeDatail);
                alert("정보가 업데이트되었습니다.");
            }
            _products[index] = newData;
    
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

    /*const statusEditor = (options) => {
        return (
            <Dropdown
                value={payMethods.find(method => method.name === options.value)}
                onChange={(e) => options.editorCallback(e.value.name)}
                options={payMethods}
                optionLabel="name"
                placeholder="선택해주세요."
            />
        );
    };*/

    // 테이블에 paid 값을 name으로 보여주기 위한 템플릿
    /*const confirmBodyTemplate = (rowData) => {
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
    };*/
    
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
    const formatDate = (date) => {
        if (!date) return '';
        
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
        const day = String(d.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };

    
    // 새 행 추가
    const handleAddNewRow = () => {
        
        // 새로운 제품 객체를 로컬 변수에 설정
        const newProduct = {
            feeDetailId: null,  // 새 행이기 때문에 ID는 null로 설정
            ddate: null,        // 날짜 필드 초기화
            content: '',
            income: 0,
            expend: 0,
            totalMoney: 0,
            admin: { adminId: null },
            creAt: null,
            uptAt: null
        };
    
        // 새로운 행을 products 상태에 추가
        setProducts(prevProducts => [...prevProducts, newProduct]);
        setIsAddingNewRow(true);
    };

    // 새 행 저장
    const handleSaveNewRow = async () => {
        try {
            await axios.post('/api/admin/management/feeDetail/create', newProduct);
            fetchData();
            setIsAddingNewRow(false);
            alert('새로운 행이 추가되었습니다.');
        } catch (error) {
            alert('새 행을 추가하는데 실패했습니다.');
        }
    };

    const cols = [
        { field: 'feeDetailId', header: '번호', bodyStyle: { display: 'none' }, headerStyle: { display: 'none' } },
        { field: 'ddate', header: '날짜', editor: dateEditor },
        { field: 'content', header: '내용', editor: textEditor },
        { field: 'income', header: '수입', editor: numberEditor, body: numberBodyTemplate },
        { field: 'expend', header: '지출', editor: numberEditor, body: numberBodyTemplate },
        { field: 'totalMoney', header: '총금액', body: numberBodyTemplate },
        { field: 'creAdmin', header: '등록자' },
        { field: 'creDate', header: '등록일', },
        { field: 'uptAdmin', header: '수정자' },
        { field: 'uptDate', header: '수정일', } // 수정일에 올바른 필드 사용
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
    

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));

    const tableHeader = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
            <div>
                <Button label="추가" icon="pi pi-plus" onClick={handleAddNewRow} />
            </div>
            
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
    const handleListClick = () => {
        navigate('/baemin/admin/toFeesManagement');
    };
    const search = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <IconField iconPosition="left" style={{ maxWidth: '20rem' }}>
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={handleGlobalFilterChange} placeholder="Search..." />
            </IconField>
            <Button onClick={handleListClick} rounded outlined severity="info">
                <i className="pi pi-list" style={{ fontSize: '0.9rem' }}></i>
            </Button>
        </div>
    )
   

    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>회비 세부사항 관리</div>
                {search}
                
            </div>
            <hr className='w-full' style={{marginLeft:"0px",marginRight:"0px"}}></hr>
            <div className="card p-fluid">
            <DataTable
                value={products}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                tableStyle={{ minWidth: '100rem' }}
                dataKey="feeDetailId" // 고유한 키를 지정
                paginator
                rows={10}
                size={'small'}
                rowsPerPageOptions={[5, 10, 25]}
                globalFilter={globalFilter}
                header={tableHeader}
            >
                {cols.map(({ field, header, editor, body }) => (
                    <Column
                        key={`${field}-${header}`} // 고유한 키 조합으로 설정
                        field={field}
                        header={header}
                        editor={editor}
                        body={body}
                        sortable
                        style={field === 'feeId' ? { display: 'none' } : {}}
                    />
                ))}
                <Column rowEditor headerStyle={{ width: '3%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>
            </div>
        </div>
    );
}

export default FeesDetail;