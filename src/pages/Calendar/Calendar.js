import React, {useState, useEffect, useCallback, useContext} from 'react'
import styles from './Calendar.module.css'
import "./Calendar.css"
import Modal from "../Calendar/SideBar/CalendarModal"
import koLocale from '@fullcalendar/core/locales/ko'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { CalendarUpPush, TeamBirthdays } from './CalendarEvent_utils'
import axios from 'axios'
import CalendarInnerModal from './CalendarInnerModal'
import { ListContext } from "../Bm/Bm"
import confetti from 'canvas-confetti';

// 옵저버 설정
function applyStyles() {
    const centeredElements = document.querySelectorAll('.centered-event');
  centeredElements.forEach(element => {
    const grandGrandParent = element.parentElement.parentElement.parentElement.children[0];

    Array.from(grandGrandParent.children).forEach(child => {
      child.style.color = 'red';
    });
  });
}
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      applyStyles();
    }
  });
});
// 옵저버 설정
observer.observe(document.body, { childList: true, subtree: true });
// 초기 스타일 적용
applyStyles();


const Calendar = () => {
    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [events, setEvents] = useState([]);
    const [highlightDates, setHighlightDates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [eventDetails, setEventDetails] = useState(null);
    const { dbList, refreshList } = useContext(ListContext);
  

    function handleEventClick(clickInfo) { // 생일 이벤트를 클릭하면 confetti 애니메이션을 시작.
      const { extendedProps, classNames } = clickInfo.event;
      if (classNames.includes('birthday-event')) {
        startConfettiAnimation();
      } else if (extendedProps && extendedProps.seq) {
        setEventDetails(extendedProps);
        setEventModalOpen(true);
      }
    }

    function startConfettiAnimation() { // confetti 애니메이션을 시작.
      const duration = 60 * 60 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 500, ticks: 20, zIndex: 0 }; //startvelocity: 시작 속도, spread: 분포, ticks: 틱, zIndex: z축
  
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 20 * (timeLeft / duration);
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0, 1), y: randomInRange(0, 1) }
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0, 1), y: randomInRange(0, 1) }
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0, 1), y: randomInRange(0, 1) }
          })
        );
      }, 250);

      setTimeout(() => clearInterval(interval), 10000);
    }

    function handleEventDrop(info) { // DB에 저장된 이벤트를 Drag & Drop으로 수정할 수 있도록 함.
      const { event } = info;
      const startDate = new Date(event.start);
      startDate.setDate(startDate.getDate() + 1);
      const NewStart = startDate.toISOString().split('T')[0] ? startDate.toISOString().split('T')[0] : null;
      
      const endDate = event.end ? new Date(event.end) : null;
      if (endDate) {
        endDate.setDate(endDate.getDate());
      }
      const NewEnd = endDate ? endDate.toISOString().split('T')[0] : null;

      axios.put(`/api/calendar/${event.extendedProps.seq}`, { ...event.extendedProps, starttime: NewStart, endtime: NewEnd }).then((res) => {
        refreshList();
      });
    };

  
  useEffect(() => { // DB에 저장된 이벤트를 불러옴.
    const fetchDataForMonth = async (year, month) => {
      try {
        const params = {
          serviceKey: process.env.REACT_APP_API_KEY,
          solYear: year,
          solMonth: month
        };
        const response = await axios.get('http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo', { params });
        const transformedEvents = response.data.response.body.items.item.map(event => ({
          title: event.dateName,
          start: event.locdate.toString(),
          color: "white",
          textColor: "red",
          borderColor: "red",
          allDay: true,
          classNames: ['centered-event']
        }));
        return transformedEvents;
      } catch (error) {
        return [];
      }
    };

    const fetchDataForYear = async (year) => { // 공공 데이터 포털에서 1년치 데이터를 불러옴.
      const requests = [];
      for (let month = 1; month <= 12; month++) {
        const monthString = month.toString().padStart(2, '0'); // 월을 2자리 숫자로 변환합니다.
        requests.push(fetchDataForMonth(year, monthString));
      }
      const results = await Promise.all(requests);
      return [].concat(...results); // 모든 이벤트를 병합합니다.
    };
    

    const initializeCalendar = async () => { // 이벤트를 불러온 후, 달력에 표시합니다.
      const years = ['2023', '2024', '2025'];
      const eventPromises = years.map(fetchDataForYear);
      const eventsForAllYears = await Promise.all(eventPromises);
      const combinedEvents = [].concat(...eventsForAllYears);
      combinedEvents.push(...CalendarUpPush);
      combinedEvents.push(...TeamBirthdays);
      setEvents(combinedEvents);
      const eventDates = combinedEvents.map(event => event.start);
      setHighlightDates(eventDates);
    };
    initializeCalendar();
  }, []);


  const handleDateSelect = (selectInfo) => { // 달력을 Drag로 선택하면 Modal을 띄워 이벤트를 추가할 수 있도록 함.
    const startDateStr = selectInfo.startStr;
    let endDateStr = selectInfo.endStr;

    if (!endDateStr || startDateStr === endDateStr) {
        const endDate = new Date(selectInfo.start);
        endDate.setDate(endDate.getDate() + 1);
        endDateStr = endDate.toISOString().split('T')[0];
    } else {
        const endDate = new Date(selectInfo.end);
        endDate.setDate(endDate.getDate());
        endDateStr = endDate.toISOString().split('T')[0];
    }

    setSelectedDate({ start: startDateStr, end: endDateStr });
    setShowModal(true);
  };


  const handleCloseModal = () => { // Modal을 닫음.
    setEventModalOpen(false);
    setEventDetails(null);
  };
  const editableDbList = dbList.map(event => ({ ...event, editable: true }));
  const nonEditableEvents = events.map(event => ({ ...event, editable: false }));
  
  return (
    <>
        <div className={styles.FullCalendar}>
            <div className={styles.FullCalendarMain}>
                <FullCalendar
                  schedulerLicenseKey="Groove" // 라이센스 키
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // 달력에 표시할 플러그인 설정
                  initialView="dayGridMonth" // 달력 초기 화면을 월간으로 설정
                  headerToolbar={{ left: 'dayGridMonth,timeGridWeek,timeGridDay', center: 'title', right: 'today prev,next' }} // 달력 상단에 표시되는 버튼 설정
                  locale={koLocale} // 한국어로 설정
                  weekends={weekendsVisible} // 주말 표시 여부
                  events={[...editableDbList, ...nonEditableEvents]} // 이벤트를 달력에 표시
                  select={handleDateSelect} // 달력을 Drag로 선택하면 Modal을 띄워 이벤트를 추가할 수 있도록 함.
                  selectable={true} // 달력을 Drag로 선택할 수 있도록 함.
                  selectMirror={true} // 달력을 Drag할 때, 이벤트를 표시
                  dayMaxEvents={true} // 달력에 표시되는 이벤트의 최대 개수를 설정 (더보기 버튼이 생김)
                  eventClick={handleEventClick} // 이벤트를 클릭하면 Modal을 띄워 이벤트를 수정할 수 있도록 함.
                  eventDrop={handleEventDrop} // 이벤트를 Drag & Drop으로 수정할 수 있도록 함.
                />
            </div>
      </div>
      <CalendarInnerModal isOpen={eventModalOpen} onClose={handleCloseModal} eventDetails={eventDetails} onEventAdded={refreshList}/> 
      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedDate={selectedDate}
          onEventAdded={refreshList}
        />
      )}
    </>
  );
};


export default Calendar;