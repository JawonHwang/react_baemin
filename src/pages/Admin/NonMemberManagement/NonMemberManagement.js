import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./NonMemberManagement.module.css";
import { Button } from 'primereact/button';

const NonMemberManagement = () => {
    /*연습*/
    const [products, setProducts] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const fetchData = async () => {
        /*try {
            const response = await axios.get('/api/admin/management/memberShipFee/getAll');
            console.log(response);

            setProducts(response);

        } catch (error) {
            console.error('Error fetching data: ', error);
            alert("문제가 발생했습니다. 관리자에게 문의해 주세요.");
        }*/
    }
    useEffect(() => {
        fetchData();
    }, []);


    const disableButton = () => {
        const newState = !isButtonDisabled;
        setIsButtonDisabled(newState);
        // 상태를 localStorage에 저장
        localStorage.setItem('isButtonDisabled', newState ? 'true' : 'false');
    };

    return (
        <div className={style.container}>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className={style.title}>비회원 관리</div>
                <div >
                    <Button id="disableButton" onClick={disableButton}>
                        {isButtonDisabled ? '활성화' : '비활성화'}
                    </Button>
                </div>
                </div>
            <hr />
        </div>
    );
}

export default NonMemberManagement;