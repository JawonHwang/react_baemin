import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatISO, parseISO, addDays } from 'date-fns';

export const useCalendar = () => {
    const [dbList, setDbList] = useState([]);

    const refreshList = () => { // 캘린더에 표시할 이벤트 목록을 DB에서 가져온다.
        axios.get("/api/calendar").then((res) => {
            const NewEvents = res.data.map(transformEventDataToCalendarEvent);
            setDbList(NewEvents);
            // console.log(NewEvents);
        });

        function transformEventDataToCalendarEvent(event) {
            // 날짜 값이 유효한지 확인
            const startDate = event.starttime ? parseISO(event.starttime) : null;
            const endDate = event.endtime ? parseISO(event.endtime) : null;

            // 유효한 날짜만 처리
            if (!startDate || !endDate) {
                return {
                    title: event.calTitle,
                    start: event.calStartTime,
                    end: event.calEndTime,
                    color: "white",
                    textColor: "black",
                    borderColor: "black",
                    allDay: true,
                    classNames: ['myData-event'],
                };
            }

            return {
                extendedProps: {
                    seq: event.calId,
                    write_date: event.calWriteDate,
                    contents: event.calContents,
                    title: event.calTitle,
                    start: event.calStartTime,
                    end: formatISO(addDays(endDate, 1)), // 1일 더하여 포맷팅
                },
                title: event.calTitle,
                start: event.calStartTime,
                end: formatISO(addDays(endDate, 1)),
                color: "white",
                textColor: "black",
                borderColor: "black",
                allDay: true,
                classNames: ['myData-event'],
            };
        }
    };

    useEffect(() => { // 캘린더에 표시할 이벤트 목록을 DB에서 가져와서 렌더링하여 바로 보여준다.
        refreshList();
    }, []);

    return { dbList, refreshList };
}
