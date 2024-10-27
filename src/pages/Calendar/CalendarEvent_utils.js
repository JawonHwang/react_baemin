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
    ];
    
function createEventId() {
    return String(eventGuid++)
}