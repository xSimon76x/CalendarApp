import { addHours } from "date-fns";
import { useCalendarStore, useUiStore } from "../../hooks"

export const FabAddNew = () => {

    const { openDateModal } = useUiStore();

    const { setActiveEvent } = useCalendarStore();

    const handleClickNew = () => {
        setActiveEvent({
            title: 'Hola mundo',
            start: new Date(),
            notes: 'HOLA MUNDO',
            end: addHours( new Date(), 2 ),
            bgColor: '#fafafa',
            user: {
              _id: '123',
              name: 'Juan',
            }
        })
        openDateModal();
    };

    return (
        <button
            className="btn btn-primary fab"
            onClick={ handleClickNew }
        >
            <i className="fas fa-plus"></i>
        </button>
    )
}
