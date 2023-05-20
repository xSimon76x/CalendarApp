import { useCalendarStore, useUiStore } from "../../hooks"

export const FabDelete = () => {

    const { startDeleteEvent, hasEventSelected } = useCalendarStore();
    const { isDateModalOpen } = useUiStore();

    const handleDeleteClick = () => {
        startDeleteEvent();
    };

    return (
        <button
            className="btn btn-danger fab-danger"
            onClick={ handleDeleteClick }
            style={{
                display: hasEventSelected && !isDateModalOpen ? '' : 'none'
            }}
        >
            <i className="fas fa-trash-alt"></i>
        </button>
    )
}
