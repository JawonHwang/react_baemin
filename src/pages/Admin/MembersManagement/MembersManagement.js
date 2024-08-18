import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import style from "./MembersManagement.module.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import 'primeicons/primeicons.css';


const MembersManagement = () => {
    const [products, setProducts] = useState([]);
    const dt = useRef(null);

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
        { field: 'role', header: '권한' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
          const response = await axios.get('/api/admin/management/member');
          console.log(response);
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, products);
                doc.save('회원목록.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(products);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'products');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    return (
        <div className={style.container}>
            <div className={style.title}>회원관리</div>
            <hr></hr>
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />

                <DataTable ref={dt} value={products} header={header} tableStyle={{ minWidth: '50rem' }}>
                    {cols.map((col, index) => (
                        <Column key={index} field={col.field} header={col.header} />
                    ))}
                </DataTable>
            </div>
        </div>
    );
}

export default MembersManagement;