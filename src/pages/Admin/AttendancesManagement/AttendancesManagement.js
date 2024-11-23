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

    const [selectOptions] = useState([
        { value: '출석' },
        { value: '결석' },
        { value: '지각' },
        { value: '조퇴' }
    ]);

    /*-----------*/
    const dt = useRef(null);
    const [products, setProducts] = useState([]); // 출석 데이터
    const [globalFilter, setGlobalFilter] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [cols, setCols] = useState([
        { field: 'memId', header: '아이디', hidden: true },
        { field: 'memStuId', header: '학번' },
        { field: 'memName', header: '이름' },
        { field: 'memContact', header: '연락처' },
        
    ]);

    
    useEffect(() => {
        fetchData(); // 모든 데이터를 한 번에 가져옵니다.
        /*const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setCurrentDate(formattedDate); // 상태 업데이트로 input 값 설정*/
    }, [year, month]); 
    
    const fetchData = async (fetchYear = year, fetchMonth = month) => {
        try {
            // 회원 데이터 가져오기
            const memberResponse = await axios.get('/api/admin/management/common/getMemberbyIsBan');
            const memberData = memberResponse.data;

            // 출석 데이터 가져오기
            const attendanceResponse = await axios.get(`/api/admin/management/attendance/monthGetAll`, {
                params: { year: fetchYear, month: fetchMonth }
            });
            const attendanceData = attendanceResponse.data;
            // console.log(attendanceData);

            // 출석 데이터를 날짜와 memId로 중복 제거
            const attendanceMap = new Map();
            attendanceData.forEach(att => {
                const key = `${att.member.memId}_${att.attAt}`;
                if (!attendanceMap.has(key)) {
                    attendanceMap.set(key, att);
                }
            });

            const uniqueAttendanceData = Array.from(attendanceMap.values());

            // 출석 데이터를 날짜를 키로 사용하는 형태로 변환
            const attendanceByDate = {};
            uniqueAttendanceData.forEach(att => {
                const dateKey = att.attAt; // 출석 날짜
                const memId = att.member.memId; // 멤버 ID
                if (!attendanceByDate[dateKey]) {
                    attendanceByDate[dateKey] = {};
                }
                attendanceByDate[dateKey][memId] = att.attState; // 출석 상태 저장
            });

            // 출석 데이터와 회원 데이터를 결합
            const combinedData = memberData.map(member => {
                const attendanceInfo = {};
                Object.keys(attendanceByDate).forEach(date => {
                    attendanceInfo[date] = attendanceByDate[date][member.memId] || ''; // 출석 상태가 없으면 빈 문자열
                });

                return {
                    ...member,
                    ...attendanceInfo // 출석 정보를 회원 데이터에 병합
                };
            });

            // 새로운 열 초기화
            const newColumns = Object.keys(attendanceByDate).map(date => ({
                field: date,
                header: date,
                editor: 'select',
            }));
            
            setCols(prevCols => [...prevCols.slice(0, 4), ...newColumns]); // 기존 열은 유지하면서 출석 열 추가
            setProducts(combinedData); // 상태 업데이트
        } catch (error) {
            console.error('Error fetching data: ', error);
            alert("문제가 발생했습니다. 관리자에게 문의해 주세요.");
        }
    };

    const goToNextMonth = () => {
        let newYear = year;
        let newMonth = month;

        if (month === '12') {
            newYear += 1;
            newMonth = '01';
        } else {
            newMonth = String(parseInt(month) + 1).padStart(2, '0');
        }

        setYear(newYear);
        setMonth(newMonth);
        fetchData(newYear, newMonth); // 새 데이터를 가져옵니다.
    };

    const goToPreviousMonth = () => {
        let newYear = year;
        let newMonth = month;

        if (month === '01') {
            newYear -= 1;
            newMonth = '12';
        } else {
            newMonth = String(parseInt(month) - 1).padStart(2, '0');
        }

        setYear(newYear);
        setMonth(newMonth);
        fetchData(newYear, newMonth); // 새 데이터를 가져옵니다.
    };
    
    

    const handleAddColumn = () => {
        const newField = currentDate; // 새 필드 이름

        // 현재 날짜가 빈 값일 경우 알림
        if (!newField) {
            alert('날짜를 선택해주세요.'); // 빈 값일 때 알림
            return; // 알림 후 함수 종료
        }

        // 이미 존재하는 날짜 열 체크
        const isDateAlreadyAdded = cols.some(col => col.field === newField);
    
        if (isDateAlreadyAdded) {
            alert('해당 날짜는 이미 추가되었습니다.');
            return; // 날짜가 이미 존재하면 함수를 종료
        }
    
        // 새로운 열 객체 생성
        const newCol = {
            field: newField,
            header: currentDate,
            editor: 'select', // 선택 편집기 사용
        };
    
        // 모든 기존 데이터 행에 새로운 필드 추가 (빈 값으로 초기화)
        const updatedProducts = products.map((product) => ({
            ...product,
            [newField]: '' // 새로운 필드 초기화
        }));
    
        // 상태 업데이트
        setProducts(updatedProducts); // 제품 데이터 업데이트
        setCols(prevCols => [...prevCols, newCol]); // 새로운 열을 기존 열에 추가
    };
    
    

    

    // 필터링 처리
    const handleGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilter(value); 
    };

    // 다음 달로 이동하는 함수
    /*const goToNextMonth = () => {
        if (month === '12') {
            setYear(year + 1);
            setMonth('01');
        } else {
            setMonth(String(parseInt(month) + 1).padStart(2, '0'));
        }
    };
    
    const goToPreviousMonth = () => {
        let newYear = year;
        let newMonth = month;
    
        if (month === '01') {
            newYear = year - 1;
            newMonth = '12';
        } else {
            newMonth = String(parseInt(month) - 1).padStart(2, '0');
        }
    
        setYear(newYear);
        setMonth(newMonth);
    };
*/
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
    
                    const attendanceState = product[col.field]; // 해당 날짜에 대한 출석 상태
                    // 출석 상태가 존재하고 빈 값이 아닐 경우에만 추가
                    if (attendanceState && attendanceState.trim() !== '') {
                        attendanceData.push({
                            member: {
                                memId: product.memId // 멤버의 ID
                            },
                            attAt: col.field, // 현재 날짜를 사용 (열의 필드가 날짜를 나타내야 함)
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
                fetchData(); // 데이터를 다시 조회하여 최신 상태로 업데이트
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
                <label htmlFor="dateInput">날짜 추가: </label>
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
            <hr className='w-full' style={{marginLeft:"0px",marginRight:"0px"}}></hr>
            <div className="card p-fluid">
                <DataTable
                    value={products}
                    editMode="cell"
                    tableStyle={{ minWidth: '100rem' }}
                    dataKey="memId"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter}
                    header={tableHeader}
                    //size={'small'}
                >
                    {cols.map(({ field, header, editor, hidden }, index) => (
                        <Column
                            key={`${field}_${index}`} // 유일한 key 생성
                            field={field}
                            header={header}
                            sortable
                            body={(rowData) => rowData[field]}
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
