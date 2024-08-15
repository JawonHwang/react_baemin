let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const CalendarUpPush = [
        {
          id: createEventId(),
          title: '크리스마스',
          start: "2023-12-25",
          end: "2023-12-25",
          allDay: true,
          color: "white",
          textColor: "red",
          borderColor: "red",
          classNames: ['centered-event']
        },
        {
          id: createEventId(),
          title: '1월 1일',
          start: "2024-01-01",
          end: "2024-01-01",
          allDay: true,
          color: "white",
          textColor: "red",
          borderColor: "red",
          classNames: ['centered-event']
       },
        {
          id: createEventId(),
          title: '크리스마스',
          start: "2024-12-25",
          end: "2024-12-25",
          allDay: true, 
          color: "white",
          textColor: "red",
          borderColor: "red",
          classNames: ['centered-event']
        },
        {
          id: createEventId(),
          title: '크리스마스',
          start: "2025-12-25",
          end: "2025-12-25",
          allDay: true, 
          color: "white",
          textColor: "red",
          borderColor: "red",
          classNames: ['centered-event']
        },
];
export const TeamBirthdays = [
        { id: createEventId(), title: '⭐강휘재 생일⭐', start: "2023-04-01", end: "2023-04-01", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐강휘재 생일⭐', start: "2024-04-01", end: "2024-04-01", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐강휘재 생일⭐', start: "2025-04-01", end: "2025-04-01", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐고재훈 생일⭐', start: "2023-01-03", end: "2023-01-03", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐고재훈 생일⭐', start: "2024-01-03", end: "2024-01-03", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐고재훈 생일⭐', start: "2025-01-03", end: "2025-01-03", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐권석경 생일⭐', start: "2023-10-06", end: "2023-10-06", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐권석경 생일⭐', start: "2024-10-06", end: "2024-10-06", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐권석경 생일⭐', start: "2025-10-06", end: "2025-10-06", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐김민석 생일⭐', start: "2023-12-18", end: "2023-12-18", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐김민석 생일⭐', start: "2024-12-18", end: "2024-12-18", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐김민석 생일⭐', start: "2025-12-18", end: "2025-12-18", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐안성진 생일⭐', start: "2023-09-09", end: "2023-09-09", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐안성진 생일⭐', start: "2024-09-09", end: "2024-09-09", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐안성진 생일⭐', start: "2025-09-09", end: "2025-09-09", allDay: true, textColor: "blue", classNames: ['birthday-event'] }, 
        { id: createEventId(), title: '⭐황자원 생일⭐', start: "2023-09-13", end: "2023-09-13", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐황자원 생일⭐', start: "2024-09-13", end: "2024-09-13", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
        { id: createEventId(), title: '⭐황자원 생일⭐', start: "2025-09-13", end: "2025-09-13", allDay: true, textColor: "blue", classNames: ['birthday-event'] },
    ];
    
function createEventId() {
    return String(eventGuid++)
}