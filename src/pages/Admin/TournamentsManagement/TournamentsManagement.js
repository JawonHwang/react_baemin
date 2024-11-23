import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Link, useLocation } from 'react-router-dom';
import style from "./TournamentsManagement.module.css";


const TournamentsManagement = () => {
    const [products, setProducts] = useState([]);
    const cols = [
        {field: 'tomState.tomSteName', header: '상태'},
        {field: 'tomDate', header: '날짜'},
        {field: 'tomName', header: '대회이름'},
        {field: 'tomLocation', header: '장소'},
        {field: 'views', header: '조회수'}
    ];

    const fetchData = async () => {
        try {
          const response = await axios.get('/api/admin/management/tournament/getAll');
        //   console.log(response);
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    return (
        <div className={style.container}>
            <div className={style.title}>대회 관리</div>
            <hr></hr>
            <div className={style.buttons}>
                <Link to="/baemin/admin/toTournamentsAdd"><Button type="button" className={style.radius50} icon="pi pi-plus" rounded outlined severity="info" /></Link>
            </div>
            <div className="card">
                <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
                    {cols.map((col, i) => (
                        <Column key={col.field} field={col.field} header={col.header} />
                    ))}
                </DataTable>
            </div>
        </div>
    );
}

export default TournamentsManagement;