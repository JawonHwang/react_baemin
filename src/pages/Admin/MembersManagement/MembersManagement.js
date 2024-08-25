import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import style from "./MembersManagement.module.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Export from '../Export/Export';
const MembersManagement = () => {
    const [products, setProducts] = useState([]);
    const dt = useRef(null);
    
    const fetchData = async () => {
        try {
          const response = await axios.get('/api/admin/management/member/getAll');
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

    useEffect(() => {
        fetchData();
    }, []);
    
    // 관리자 권한 부여 버튼 렌더링 함수
    const renderAdminButton = (rowData) => {
        return (
            <Button 
                label="권한 부여" 
                icon="pi pi-lock" 
                onClick={() => handleAdminGrant(rowData)} 
                disabled={rowData.role === 'ADMIN'}  // 이미 관리자인 경우 버튼 비활성화
            />
        );
    };

    // 관리자 권한 부여 처리 함수
    const handleAdminGrant = async (member) => {
        try {
            console.log(member);
            await axios.put(`/api/admin/management/member/grant-role/${ member.memId }`);
            /*setProducts((prevProducts) => 
                prevProducts.map((p) => 
                    p.memId === member.memId ? { ...p, role: 'ADMIN' } : p
                )
            );*/
        } catch (error) {
            console.error('Error granting admin role: ', error);
        }
    };

    const cols = [
        { field: 'memId', header: 'ID' },
        { field: 'memPw', header: 'PW' },
        { field: 'memName', header: '이름' },
        { field: 'memContact', header: '전화번호' },
        { field: 'memEmail', header: '이메일' },
        { field: 'memBirth', header: '생일' },
        { field: 'memDept', header: '학과' },
        { field: 'memStuId', header: '학번' },
        { field: 'memGender', header: '성별' },
        { field: 'memClubNum', header: '기수' },
        { field: 'memTierId', header: '티어' },
        { field: 'memJoinDate', header: '가입신청일자' },
        { field: 'memApprovalDate', header: '승인일자' },
        { field: 'role', header: '권한' },
        { field: 'approval', header: '관리자 권한 부여', body: renderAdminButton }
    ];

    //const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));
    const exportColumns = cols
    .filter(col => col.field !== 'approval')  // 'approval' 필드를 제외
    .map(col => ({ title: col.header, dataKey: col.field }));

    
    
    return (
        <div className={style.container}>
            <div className={style.title}>회원관리</div>
            <hr></hr>
            <div className="card">
                <Export dt={dt} exportColumns={exportColumns} products={products} />
                <div className={style.dataTableWrapper}>
                    <DataTable ref={dt} value={products} tableStyle={{ minWidth: '100rem' }}>
                        {cols.map((col, index) => (
                            <Column key={index} field={col.field} header={col.header} body={col.body}/>
                        ))}
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

export default MembersManagement;