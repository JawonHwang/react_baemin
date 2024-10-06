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
    /*----날짜----*/ 
    const today = new Date(); // 오늘 날짜
    const currentYear = today.getFullYear(); // 오늘 연도
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');// 오늘 월 (0부터 시작하므로 +1)
    const currentYearMonth = `${currentYear}-${currentMonth}`; // 예: "2024-09"
    const [year, setYear] = useState(currentYear); // 상태로 연도 관리
    const [month, setMonth] = useState(currentMonth);
    /*-----------*/
    const dt = useRef(null);
    const [products, setProducts] = useState([]); // 출석 데이터
    const [globalFilter, setGlobalFilter] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [cols, setCols] = useState([ // 열을 상태로 관리
        { field: 'memId', header: '아이디', hidden: true },
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

    /*const fetchAttendanceData = async () => {
        try {
            const response = await axios.get('/api/admin/management/attendance/monthGetAll');
            const data = response.data;

            // 데이터에서 동적으로 열 이름 추출
            const newColumns = Object.keys(data[0] || {}).map(key => ({
                field: key,
                header: key.charAt(0).toUpperCase() + key.slice(1),
                width: 150
            }));

            setCols(prevCols => [...prevCols, ...newColumns]); // 새로운 열 추가
            setProducts(data); // 출석 데이터 설정
        } catch (error) {
            console.error('출석 데이터 가져오기 오류: ', error);
            alert("문제가 발생했습니다. 관리자에게 문의해 주세요.");
        }
    };*/
    
    // API 호출로 데이터 가져오기
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/admin/management/common/getMemberbyIsBan');
            const data = response.data;
            setProducts(data);
        } catch (error) {
            console.error('Error fetching data: ', error);
            alert("문제가 발생했습니다. 관리자에게 문의해 주세요.");
        }
        
    };
    /*const fetchData = async () => {
        try {
            // 1. 회원 데이터 가져오기
            const memberResponse = await axios.get('/api/admin/management/common/getMemberbyIsBan');
            const memberData = memberResponse.data;
    
            // 2. 출석 데이터 가져오기
            const attendanceResponse = await axios.get(`/api/admin/management/attendance/monthGetAll`, {
                params: { year, month } // 연도와 월을 쿼리 파라미터로 전달
            });
            console.log(attendanceResponse);
            const attendanceData = attendanceResponse.data;
    
            // 3. 출석 데이터와 회원 데이터를 memId를 기준으로 결합
            const combinedData = memberData.map(member => {
                // 출석 데이터에서 해당 멤버의 출석 정보를 찾아오기
                const attendanceRecord = attendanceData.find(att => att.memId === member.memId);
                
                // 출석 데이터가 존재하는 경우 출석 정보 추가, 없으면 기본값으로 설정
                return {
                    ...member,
                    attendance: attendanceRecord || {} // 출석 기록이 없을 경우 빈 객체로 설정
                };
            });
    
            // 4. 상태 업데이트
            setProducts(combinedData);
        } catch (error) {
            console.error('Error fetching data: ', error);
            alert("문제가 발생했습니다. 관리자에게 문의해 주세요.");
        }
    };*/
    

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

    const handleDropdownChange = (value, rowIndex, field) => {
        const updatedProducts = [...products];
        updatedProducts[rowIndex][field] = value; // 선택한 값을 해당 셀에 반영
        setProducts(updatedProducts); // 상태 업데이트
    };

    const saveAllAttendance = async () => {
    const attendanceData = [];

    products.forEach(product => {
        // 'memId', 'memStuId', 'memName', 'memContact' 필드를 제외한 나머지 필드를 순회
        cols.forEach(col => {
            if (!['memId', 'memStuId', 'memName', 'memContact'].includes(col.field)) {

                const attendanceState = product[col.field];
                console.log(`Member ID: ${product.memId}`);
                console.log(`Date Field: ${col.field}`);
                console.log(`Attendance State: ${attendanceState}`);

                // 출석 상태가 존재할 때만 데이터를 전송
                if (attendanceState) {
                    // col.field를 날짜 형식으로 변환
                    const formattedDate = new Date(col.field).toISOString().slice(0, 10); // 'YYYY-MM-DD' 형식으로 변환
                    console.log("formattedDate" + formattedDate);

                    attendanceData.push({
                        member: {
                            memId: product.memId // 멤버의 ID
                        },
                        attAt: formattedDate, // 필드를 날짜 형식으로 전송
                        attState: attendanceState // 해당 날짜에 대한 출석 상태
                    });
                }
            }
        });
    });

    try {
        const response = await axios.post('/api/admin/management/attendance/saveAll', attendanceData);
        if (response.status === 200) {
            alert('모든 출석 정보가 저장되었습니다.');
        }
    } catch (error) {
        console.error('Error saving attendance:', error);
        alert("출석 정보 저장 중 문제가 발생했습니다.");
    }
};

    
    

    // 콤보박스 편집기 함수
    const selectEditor = (props) => {
        const { rowIndex, field } = props;

        return (
            <Dropdown
                value={products[rowIndex][field]} // 현재 셀의 값을 표시
                options={selectOptions} // 옵션 데이터
                onChange={(e) => handleDropdownChange(e.value, rowIndex, field)} // 값 변경 시 호출되는 함수
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
            <Button 
                    type="button" 
                    className={style.radius50} 
                    icon="pi pi-save" 
                    rounded 
                    severity="info" 
                    onClick={saveAllAttendance} // 저장 버튼 클릭 시 호출
                />
        </div>
        
    );

    const tableHeader = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
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
                    onClick={handleAddColumn}
                />
                
            </div>
            <div className="flex flex-wrap gap-5 align-items-center justify-content-center" style={{ flex: 1 }}>
                <Button icon="pi pi-arrow-left" onClick={goToPreviousMonth} />
                <div style={{fontSize:"1.5rem"}}>{year}년 {month}월</div>
                {!(year === currentYear && month === currentMonth) && (
                    <Button icon="pi pi-arrow-right" onClick={goToNextMonth} />
                )}
            </div>
            <div>
                <Export dt={dt} exportColumns={cols.map(col => ({ title: col.header, dataKey: col.field }))} products={products} />
            </div>
        </div>
    );

    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>출석부 관리</div>
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
                    {cols.map(({ field, header, editor, hidden }) => (
                        <Column
                            key={field}
                            field={field}
                            header={header}
                            sortable
                            editor={editor === 'select' ? selectEditor : undefined} // editor 속성에 selectEditor 함수 사용
                            hidden={hidden}
                        />
                    ))}
                </DataTable>
            </div>
        </div>
    );
}

export default AttendancesManagement;
