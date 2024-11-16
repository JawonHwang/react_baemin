import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'reactstrap';
const NoticeContent = () => {
    const [products, setProducts] = useState([]);
    const { notId } = useParams(); // URL에서 notId 추출

    useEffect(() => {
        fetchData();
    }, [notId]);

    const fetchData = async () => {
        const response = await axios.get(`/api/admin/management/notice/${notId}`);
        setProducts(response.data);
    }
    return (
        <div className='w-full mt-2'>
            <div className='flex align-items-center'>
                <div style={{color:'#EEF300',fontSize:'small'}}>●</div>
                <div className = 'ml-3' style={{fontWeight:'bold',fontSize:'larger'}}>BOARD</div>
                <div className = 'ml-5' style={{fontWeight:'bolder',fontSize:'larger'}}>공지사항</div>
            </div>
            <div>
                <hr className='mt-5 mb-5'/>
                <div style={{paddingLeft:'50px'}}>{products.title}</div>
                <hr className='mt-5 mb-5'/>
                <div style={{paddingLeft:'50px'}} dangerouslySetInnerHTML={{ __html: products.content }} />
                <hr className='mt-5'/>
            </div>
            <div className='flex align-items-center justify-content-center mt-5'>
                <Button onClick={() => window.location.href = '/baemin/board'}>목록</Button>
            </div>
            
            
        </div>
        
    );
}

export default NoticeContent;