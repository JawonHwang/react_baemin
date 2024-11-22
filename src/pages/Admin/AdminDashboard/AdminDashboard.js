import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TabView, TabPanel } from 'primereact/tabview';
import style from "./AdminDashboard.module.css";
import { InputIcon } from 'primereact/inputicon';
import { ListBox } from 'primereact/listbox';
import { Chart } from 'primereact/chart';
import { Knob } from 'primereact/knob';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import JenderStatic from '../AdminDashboard/Static/Jender';
import AgeStatic from '../AdminDashboard/Static/Age';
const AdminDashboard = () => {
    const [valueReport, setValueReport] = useState(50);//신고 답변률
    const [valueQ, setValueQ] = useState(80);//질문 답변률

    //공지사항 테이블 데이터
    const [products, setProducts] = useState([]);

    //이번달 일정
    const [selectedList, setSelectedList] = useState(null);
    const navigate = useNavigate();

    const lists = [
        { name: '2024 2학기', code: 'NY' },
        { name: '동아리 면접', code: 'RM' },
        { name: '대천 MT', code: 'LDN' },
        { name: '2024 2학기 리그전', code: 'IST' },
        { name: '신입부원 파티', code: 'PRS' }
    ];

    //출석률 차트
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    
    const [memberCount, setMemberCount] = useState(0);

    const [visitorCount1, setvisitorCount1] = useState(0);
    const [yesterdayVisitors, setYesterdayVisitors] = useState(0);
    const [visitorCount1Data, setvisitorCount1Data] = useState([]);
    const [visitorDateData, setVisitorDateData] = useState([]);
    const [sumvisitorCount1, setSumvisitorCount1] = useState([]);

    const [newMemberCount1, setnewMemberCount1] = useState(0);
    const [yesterdayNMs, setYesterdayNMs] = useState(0);
    const [newMemberCount1Data, setnewMemberCount1Data] = useState([]);
    const [newMemberDateData, setNewMemberDateData] = useState([]);
    const [sumnewMemberCount1, setSumnewMemberCount1] = useState([]);

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

    useEffect(() => {
        //공지사항
        const fetchNoticeData = async () => {
            const response = await axios.get('/api/admin/management/notice/getAll');
            setProducts(response.data);
        }
        fetchNoticeData();
        
        //회원
        const fetchMemberData = async () => {
            try {
                const count = await axios.get("/api/admin/count/member");
                setMemberCount(count.data || 0);
            } catch (error) {
                console.error('Error fetching visitor data:', error);
            }
        }
        
        fetchMemberData();
        //방문자수
        const fetchVisitorData = async () => {
            try {
                const dailyVisitors = await axios.get("/api/admin/dailyVisitors");
                setvisitorCount1(dailyVisitors.data.visitorCount || 0);

                const yesterdayVisitors = await axios.get("/api/admin/getYesterdayVisitors");
                setYesterdayVisitors(yesterdayVisitors.data.visitorCount || 0);

                const allVisitors = await axios.get("/api/admin/visitors/getAll");
                const visitorData = allVisitors.data.map(entry => ({
                    x: entry.visitorDate,
                    y: entry.visitorCount
                }));
                setvisitorCount1Data(visitorData);
                setVisitorDateData(allVisitors.data.map(entry => entry.date));

                const sumVisitors = await axios.get("/api/admin/visitors/sum");
                setSumvisitorCount1(sumVisitors.data);
                // console.log(sumVisitors.data);
            } catch (error) {
                console.error('Error fetching visitor data:', error);
            }
        };
        fetchVisitorData();
        //신규 가입수
        const fetchNewMemberData = async () => {
            try {
                const dailyMember = await axios.get("/api/admin/dailyMember");
                setnewMemberCount1(dailyMember.data.newMemberCount || 0);

                const yesterdayNMs = await axios.get("/api/admin/getYesterdayMember");
                setYesterdayNMs(yesterdayNMs.data.newMemberCount || 0);

                const newMembers = await axios.get("/api/admin/newMember/getAll");
                const newMemberData = newMembers.data.map(entry => ({
                    x: entry.newMemberDate,
                    y: entry.newMemberCount1
                }));
                setnewMemberCount1Data(newMemberData);
                setNewMemberDateData(newMembers.data.map(entry => entry.date));

                const sumNewMembers = await axios.get("/api/admin/newMember/sum");
                setSumnewMemberCount1(sumNewMembers.data);
            } catch (error) {
                console.error('Error fetching new member data:', error);
            }
        };
        
        fetchNewMemberData();

        const visitorInterval = setInterval(fetchVisitorData, 5000);
        const newMemberInterval = setInterval(fetchNewMemberData, 5000);

        return () => {
            clearInterval(visitorInterval);
            clearInterval(newMemberInterval);
        };
    }, []);

    const naviReport = () => {
        navigate("/baemin/admin/toReportsManagement");
    };

    const naviQuestion = () => {
        navigate("/baemin/admin/toQuestionsManagement");
    };

    const naviNotice = () => {
        navigate('/baemin/admin/toNoticesManagement');
    };

    const col = [
        { field: 'notId', header: '순번' },
        { field: 'title', header: '제목' },
        { field: 'tag.notTagName', header: '태그'},
        { 
            field: 'views', 
            header: '조회수',
            body: (rowData) => {
                const iconColor = rowData.views > 100 ? 'green' : 'gray'; // 조회수에 따라 색상 변경
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="pi pi-eye" style={{ marginRight: '8px', color: iconColor }}></i>
                        {rowData.views}
                    </div>
                );
            }
        },
        { field: 'creAt', header: '등록일' },
        { field: 'adminId', header: '작성자' }
    ];

    return (
        <div className='w-full'>
            <div className = "mb-4" style={{fontWeight:'bold'}}>관리자 대시보드</div>
            <div className = "flex gap-3 mb-3 w-full">
                <div className = {style.radius15} style={{width:"30%",paddingBottom:"0px"}}>
                    <div className = "flex gap-5">
                        <div>
                            <div>오늘 할 일</div>
                            <div className = "flex gap-4 align-items-center justify-content mt-4">
                                <div onClick={naviReport} style={{ cursor: "pointer" }}>신고</div>
                                <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>3</div>
                                <div onClick={naviQuestion} style={{ cursor: "pointer" }}>질문</div>
                                <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>5</div>
                            </div>
                        </div>
                        
                        <div className="flex justify-content-center ml-3" style={{marginRight:'0px'}}>
                            <Knob value={valueReport} valueTemplate={'{value}%'} />
                            <Knob className="ml-3" value={valueQ} valueTemplate={'{value}%'}/>
                        </div>
                    </div>
                    
                    
                </div>
                <div className = "flex gap-4 align-items-center justify-content-between" style={{width:"70%"}}>
                    {visitorCount1 !== null ? (
                        <div className = {style.radius15} style={{width:"25%"}}>
                            <div>방문자 수</div>
                            <div className='flex gap-2 align-items-center justify-content-between mt-4'>
                                <div className='flex gap-4 align-items-center'> 
                                    <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>{visitorCount1}</div>
                                    <div className={style.fontSamll}>
                                        {visitorCount1 - yesterdayVisitors > 0
                                            ? `+${visitorCount1 - yesterdayVisitors}` // 양수일 때 + 기호 추가
                                            : visitorCount1 - yesterdayVisitors // 0 또는 음수일 때 그대로 출력
                                        }
                                    </div>

                                </div>
                                <i className="pi pi-sign-in" style={{fontSize:"1.5em",color:"#2470d0"}}></i>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <div className = {style.radius15} style={{width:"25%"}}> 
                        <div>신규 가입 수</div>
                        <div className='flex gap-2 align-items-center justify-content-between mt-4'>
                            <div className='flex gap-4 align-items-center'> 
                                <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>{newMemberCount1}</div>
                                <div className={style.fontSamll}>
                                        {newMemberCount1 - yesterdayNMs > 0
                                            ? `+${newMemberCount1 - yesterdayNMs}` // 양수일 때 + 기호 추가
                                            : newMemberCount1 - yesterdayNMs // 0 또는 음수일 때 그대로 출력
                                        }
                                    </div>
                            </div>
                            <i className="pi pi-user-plus" style={{fontSize:"1.5em",color:"#ca6c52"}}></i>
                        </div>
                    </div>
                    <div className = {style.radius15} style={{width:"25%"}}>
                        <div>총 회원 수</div>
                        <div className='flex gap-2 align-items-center justify-content-between mt-4'>
                            <div className='flex gap-4 align-items-center'> 
                                <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>{memberCount}</div>
                                <div className = {style.fontSamll}>0</div>
                            </div>
                            <i className="pi pi-users" style={{fontSize:"1.7em",color:"#32bd92"}}></i>
                        </div>
                    </div>
                    <div className = {style.radius15} style={{width:"25%"}}>
                        <div>회비 현황</div>
                        <div className='flex gap-2 align-items-center justify-content-between mt-4'>
                            <div className='flex gap-4 align-items-center'> 
                                <div className = {style.fontLarge} style={{color:"#054A29",fontWeight:"bold"}}>500,000</div>
                                <div className = {style.fontSamll}>+200000</div>
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
                        <div style={{color:"#054A29",fontWeight:"bold"}}>5</div>{/*총개수 넣으면 됨 */}
                    </div>
                    
                    <ListBox value={selectedList} onChange={(e) => setSelectedList(e.value)} options={lists} optionLabel="name"  className="w-full mb-0" style={{border:"none"}}/>
                </div>
                <div className = {style.radius15} style={{width:"70%"}}>
                    <TabView>
                        <TabPanel header="연령별">
                            <p className="m-0">
                               {/*<AgeStatic/>*/}
                               <JenderStatic/>
                            </p>
                        </TabPanel>
                        <TabPanel header="성별">
                            <p className="m-0">
                                <JenderStatic/>
                            </p>
                        </TabPanel>
                        <TabPanel header="기수">
                            <p className="m-0">
                                <JenderStatic/>
                            </p>
                        </TabPanel>
                    </TabView>
                </div>

            </div>
            <div className = "flex gap-2 mb-3 w-full" style={{width:'70%'}}>
                <div className = {style.radius15} style={{width:'30%'}}>
                    <div className = "flex gap-2">
                        <div>이번달 회비 안낸 사람</div>
                        <div style={{color:"#054A29",fontWeight:"bold"}}>3</div>{/*총개수 넣으면 됨 */}
                    </div>
                    <div className = "mt-4" style={{fontWeight:"bold",maxHeight:"800px"}}>이찬양, 김승엽, 황자원</div>
                </div>
                <div className = {style.radius15} style={{width:'70%'}}>
                    <div onClick={naviNotice} style={{ cursor: 'pointer' }}>공지사항</div>
                    <div className='mt-4'>
                        <DataTable value={products} size={'small'} editMode="row" dataKey="notId" tableStyle={{ minWidth: '50rem' }} paginator rowsPerPageOptions={[5, 10, 25]} rows={5}>
                            {col.map(({ field, editor, style, body }) => {
                                return <Column key={field} field={field} editor={editor} body={body} style={style} />;
                            })}
                            <Column headerStyle={{ width: '3%', minWidth: '5rem', minHeight:'2rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        </DataTable>
                    </div>
                </div>
                <div className = {style.radius15} style={{width:"30%"}}>
                    <div>질문 유형 분석</div>
                    <Chart type="pie" data={chartData} options={chartOptions} className="w-full" />
                </div>
            </div>
        </div>
    );
}
export default AdminDashboard;