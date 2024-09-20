import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./NonMemberManagement.module.css";

const NonMemberManagement = () => {
    /*연습*/
    const [products, setProducts] = useState([]);
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/admin/management/memberShipFee/getAll');
            console.log(response);

            setProducts(response);

        } catch (error) {
            console.error('Error fetching data: ', error);
            alert("문제가 발생했습니다. 관리자에게 문의해 주세요.");
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className={style.container}>
            <div className={style.title}>비회원 관리</div>
            <hr></hr>
            
        </div>
    );
}

export default NonMemberManagement;