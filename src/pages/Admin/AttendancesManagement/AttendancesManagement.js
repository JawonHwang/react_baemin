import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import style from "./AttendancesManagement.module.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import Export from '../Export/Export';

const AttendancesManagement = () => {
    const dt = useRef(null);
    const [products, setProducts] = useState([]); // 출석 데이터
    const [globalFilter, setGlobalFilter] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [cols, setCols] = useState([ // 열을 상태로 관리
        { field: 'memStuId', header: '학번' },
        { field: 'memName', header: '이름' },
        { field: 'memContact', header: '연락처' }
    ]); 
    const [selectOptions] = useState([
        { value: '출석' },
        { value: '결석' },
        { value: '지각' },
        { value: '조퇴' }
    ]);

    // API 호출로 데이터 가져오기
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/admin/management/member/getAll');
            const data = response.data;
    
            // 학번의 앞 두 자리만 추출하여 새로운 필드를 추가
            /*const updatedData = data.map(item => ({
                ...item,
                memStuIdShort: item.memStuId ? `${item.memStuId.substring(0, 2)}학번` : '' // 학번의 앞 두 자리
            }));
            console.log(updatedData);
            setProducts(updatedData);*/
            setProducts(data);
        } catch (error) {
            console.error('Error fetching data: ', error);
            alert("문제가 발생했습니다. 관리자에게 문의해 주세요.");
        }
    };

    useEffect(() => {
        fetchData();
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        setCurrentDate(formattedDate); // 상태 업데이트로 input 값 설정
    }, []);

    // 필터링 처리
    const handleGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilter(value); 
    };

    // 새로운 열 추가 함수
    const handleAddColumn = () => {
        const newField = currentDate; // 새 필드 이름
        console.log(cols);
        const isDateAlreadyAdded = cols.some(col => col.field === newField);

        if (isDateAlreadyAdded) {
            alert('해당 날짜는 이미 추가되었습니다.');
            return;
        }
        const newCol = {
            field: newField,
            header: currentDate,
            editor: 'select',
        };
        
        // 모든 기존 데이터 행에 새로운 필드 추가 (빈 값으로)
        const updatedProducts = products.map((product) => ({
            ...product,
            [newField]: '' // 새로운 필드 초기화
        }));
        
        setProducts(updatedProducts); // 제품 데이터 업데이트
        setCols([...cols, newCol]);   // 새로운 열을 기존 열에 추가
    };

    // 콤보박스 편집기 함수
    const selectEditor = (props) => {
        const { rowData, field, onEditorValueChange } = props;
        console.log(props);


        console.log('field:', field);
        return (
            <Dropdown
                value={rowData[field]} // 현재 셀의 값을 표시
                options={selectOptions} // 옵션 데이터
                onChange={(e) => onEditorValueChange(e.value)} // 값 변경 시 호출되는 함수
                optionLabel="value" // 옵션의 레이블 필드
                placeholder="선택해주세요." // 기본 placeholder 텍스트
                className="w-full md:w-14rem" // 스타일 적용
                checkmark // 체크마크 표시
                highlightOnSelect={false} // 선택 시 하이라이트 비활성화
            />
        );
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
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
            <div>
                <Export dt={dt} exportColumns={cols.map(col => ({ title: col.header, dataKey: col.field }))} products={products} />
            </div>
            <div>
                <label htmlFor="dateInput">오늘 날짜 추가: </label>
                <input 
                    type="date" 
                    id="dateInput" 
                    value={currentDate} 
                    onChange={(e) => setCurrentDate(e.target.value)} 
                />
                <Button 
                    type="button" 
                    className={style.radius50} 
                    icon="pi pi-plus" 
                    rounded 
                    outlined 
                    severity="info" 
                    onClick={handleAddColumn} // 버튼 클릭 시 열 추가
                />
            </div>
        </div>
    );

    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>출석률 관리</div>
                {search}
            </div>
            <hr />
            <div className="card p-fluid">
                <DataTable
                    value={products}
                    editMode="cell"
                    tableStyle={{ minWidth: '50rem' }}
                    dataKey="memId"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter}
                    header={tableHeader}
                    //size={'small'}
                >
                    {cols.map(({ field, header, editor }) => (
                        <Column
                            key={field}
                            field={field}
                            header={header}
                            sortable
                            editor={editor === 'select' ? selectEditor : undefined} // editor 속성에 selectEditor 함수 사용
                            //body={field === 'memStuId' ? (rowData) => rowData.memStuIdShort : undefined} // 학번 두자리로 만들고 싶을 때
                        />
                    ))}
                </DataTable>
            </div>
        </div>
    );
}

export default AttendancesManagement;
