import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TabView, TabPanel } from 'primereact/tabview';
import style from "./AdminDashboard.module.css";
import { InputIcon } from 'primereact/inputicon';
import { ListBox } from 'primereact/listbox';
import { Chart } from 'primereact/chart';
const AdminDashboard = () => {
    //이번달 일정
    const [selectedList, setSelectedList] = useState(null);
    const lists = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    //출석률 차트
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'), 
                        documentStyle.getPropertyValue('--yellow-500'), 
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'), 
                        documentStyle.getPropertyValue('--yellow-400'), 
                        documentStyle.getPropertyValue('--green-400')
                    ]
                }
            ]
        }
        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div className='w-full'>
            <div className = "mb-4" style={{fontWeight:'bold'}}>관리자 대시보드</div>
            <div className = "flex gap-3 mb-3 w-full">
                <div className = {style.radius15} style={{width:"30%"}}>
                    <div>오늘 할 일</div>
                    <div className = "flex gap-4 align-items-center justify-content mt-4">
                        <div>신고</div>
                        <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>0</div>
                        <div>질문</div>
                        <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>0</div>
                    </div>
                    
                </div>
                <div className = "flex gap-4 align-items-center justify-content-between" style={{width:"70%"}}>
                    <div className = {style.radius15} style={{width:"25%"}}>
                        <div>방문자 수</div>
                        <div className='flex gap-2 align-items-center justify-content-between mt-4'>
                            <div className='flex gap-4 align-items-center'> 
                                <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>0</div>
                                <div className = {style.fontSamll}>0</div>
                            </div>
                            <i className="pi pi-sign-in" style={{fontSize:"1.5em",color:"#2470d0"}}></i>
                        </div>
                    </div>
                    <div className = {style.radius15} style={{width:"25%"}}> 
                        <div>신규 회원 수</div>
                        <div className='flex gap-2 align-items-center justify-content-between mt-4'>
                            <div className='flex gap-4 align-items-center'> 
                                <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>0</div>
                                <div className = {style.fontSamll}>0</div>
                            </div>
                            <i className="pi pi-user-plus" style={{fontSize:"1.5em",color:"#ca6c52"}}></i>
                        </div>
                    </div>
                    <div className = {style.radius15} style={{width:"25%"}}>
                        <div>총 인원 수</div>
                        <div className='flex gap-2 align-items-center justify-content-between mt-4'>
                            <div className='flex gap-4 align-items-center'> 
                                <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>0</div>
                                <div className = {style.fontSamll}>0</div>
                            </div>
                            <i className="pi pi-users" style={{fontSize:"1.7em",color:"#32bd92"}}></i>
                        </div>
                    </div>
                    <div className = {style.radius15} style={{width:"25%"}}>
                        <div>회비 현황</div>
                        <div className='flex gap-2 align-items-center justify-content-between mt-4'>
                            <div className='flex gap-4 align-items-center'> 
                                <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>0</div>
                                <div className = {style.fontSamll}>0</div>
                            </div>
                            <i className="pi pi-dollar" style={{fontSize:"1.7em",color:"#e7b967"}}></i>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className = "flex gap-3 mb-3" style={{width:"100%"}}>
                <div className = {style.radius15} style={{width:"30%", paddingBottom:"0px"}}>
                    <div className = "flex gap-2">
                        <div>이번달 일정</div>
                        <div style={{color:"#054A29",fontWeight:"bold"}}>0</div>{/*총개수 넣으면 됨 */}
                    </div>
                    
                    <ListBox value={selectedList} onChange={(e) => setSelectedList(e.value)} options={lists} optionLabel="name"  className="w-full mb-0" style={{border:"none"}}/>
                </div>
                <div className = {style.radius15} style={{width:"70%"}}>
                    <TabView>
                        <TabPanel header="연령별">
                            <p className="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                eur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </TabPanel>
                        <TabPanel header="성별">
                            <p className="m-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                                eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                                enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
                                ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                            </p>
                        </TabPanel>
                        <TabPanel header="기수">
                            <p className="m-0">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
                                quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                                culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. 
                                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                            </p>
                        </TabPanel>
                    </TabView>
                </div>

            </div>
            <div className = "flex gap-2 mb-3 w-full">
                <div className = {style.radius15} style={{width:'30%'}}>
                    <div className = "flex gap-2">
                        <div>이번달 회비 안낸 사람</div>
                        <div style={{color:"#054A29",fontWeight:"bold"}}>3</div>{/*총개수 넣으면 됨 */}
                    </div>
                    <div className = "mt-4" style={{fontWeight:"bold",maxHeight:"800px"}}>이찬양, 김승엽, 황자원</div>
                </div>
                
               <div className = "flex gap-2 mb-3 w-full" style={{width:'70%'}}>
                    <div className = {style.radius15} style={{width:'70%'}}>질문 유형 분석</div>
                    <div className = {style.radius15} style={{width:"30%"}}>
                        <div>출석률</div>
                        <Chart type="pie" data={chartData} options={chartOptions} className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminDashboard;