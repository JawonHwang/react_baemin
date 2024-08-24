import React from 'react';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

const Export = ({ dt, exportColumns, products }) => {
    const exportCSV = (selectionOnly) => {
        if (dt.current) {
            dt.current.exportCSV({ selectionOnly });
        }
    };

    const exportPdf = async () => {
        const jsPDF = (await import('jspdf')).default;
        const autoTable = (await import('jspdf-autotable')).default;
        const doc = new jsPDF();
        autoTable(doc, { columns: exportColumns, body: products });
        doc.save('회원목록.pdf');
    };

    const exportExcel = async () => {
        const xlsx = (await import('xlsx')).default;
        const worksheet = xlsx.utils.json_to_sheet(products);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, 'products');
    };

    const saveAsExcelFile = async (buffer, fileName) => {
        const { saveAs } = (await import('file-saver')).default;
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    };

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    return (
        <>
            <Tooltip target=".export-buttons>button" position="bottom" />
            {header}
        </>
    );
}

export default Export;
