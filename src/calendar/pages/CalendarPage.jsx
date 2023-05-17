import { NavBar, CalendarEvent, CalendarModal } from "../components"
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { addHours } from "date-fns"
import { localizer, getMessagesES } from "../../helpers";
import { useState } from "react";
import { useUiStore } from "../../hooks";
import { useCalendarStore } from "../../hooks";

// const events = [{
//   title: 'Cumpleaños de mi hermano',
//   start: new Date(),
//   notes: 'Hay que comprar un pastel',
//   end: addHours( new Date(), 2 ),
//   bgColor: '#fafafa',
//   user: {
//     _id: '123',
//     name: 'Juan',
//   }
// }];

export const CalendarPage = () => {

  const { openDateModal } = useUiStore();
  const { events } = useCalendarStore();
  const lastViewStorage = localStorage.getItem("lastView") || 'week';
  const [lastView, setLastView] = useState(lastViewStorage);

  const eventStyleGetter = ( event, start, end, isSelected ) => {
    const style = {
      backgroundColor: '#347CF7',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return {
      style
    }
  }

  const onDoubleClick = (e) => {
    openDateModal();
  };

  const onSelect = (e) => {
     console.log("asdasdasd")
  };

  const onViewChanged = (e) => {
    localStorage.setItem('lastView', e);
    setLastView( e );
  };
  
  
  return (
    <>
      <NavBar />

      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={ lastView }
        style={{ height: 'calc( 100vh - 80px )' }}
        messages={getMessagesES()}
        eventPropGetter={ eventStyleGetter }
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={ onSelect }
        onView={ onViewChanged }
        
      />

      <CalendarModal />
    </>
  )
}
