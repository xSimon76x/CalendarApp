import { addHours, differenceInSeconds } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal"
import DatePicker, { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import Swal from "sweetalert2";
import { useCalendarStore, useUiStore } from "../../hooks";

import "react-datepicker/dist/react-datepicker.css";
import "sweetalert2/dist/sweetalert2.min.css"

registerLocale('es', es)

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {

    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent } = useCalendarStore();
    
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours( new Date(), 2),
    });

    const titleClass = useMemo(
        () => {
            if( !formSubmitted ) return '';

            return ( formValues.title.length > 0 )
            ? ''
            : 'is-invalid';
        }, [ formValues.title, formSubmitted ]
    );

    useEffect(() => {
        if( activeEvent !== null ) {
            setFormValues({
                ...activeEvent
            });
        }
    }, [ activeEvent ])
    

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [ target.name ]: target.value
        });
    };

    const onDateChanged = ( event, changing ) => {
        setFormValues({
            ...formValues,
            [ changing ]: event
        });
    }

    const onCloseModal = () => {
        closeDateModal();
    };

    const onSumbit = (e) => {
        e.preventDefault(); 
        setFormSubmitted(true);
        const diffetence = differenceInSeconds( formValues.end, formValues.start );

        if ( isNaN(diffetence) || diffetence <= 0 ) {
            Swal.fire('Fechas incorrectas','Revisar las fechas ingresadas', 'error');
            return;
        }

        if ( formValues.title.length <= 0 ) return;

    };

    return (
        <Modal
            isOpen={isDateModalOpen}
            // onAfterOpen={() => console.log("asda")} 
            onRequestClose={onCloseModal}
            style={customStyles}
            // contentLabel="Example Modal"
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={ 200 }
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form 
                className="container"
                onSubmit={onSumbit}
            >

                <div className="form-group mb-2">
                    <label>Fecha y hora inicio</label>
                    <DatePicker 
                        className="form-control"
                        selected={ formValues.start } 
                        onChange={(event) => onDateChanged( event, 'start') }
                        dateFormat={"Pp"} 
                        showTimeSelect
                        locale={"es"}
                        timeCaption="Hora"
                    />
                </div>

                <div className="form-group mb-2">
                    <label>Fecha y hora fin</label>
                    <DatePicker 
                        className="form-control" 
                        selected={ formValues.end } 
                        onChange={(event) => onDateChanged( event, 'end') }
                        dateFormat={"Pp"} 
                        minDate={ formValues.start }
                        showTimeSelect
                        locale={"es"}
                        timeCaption="Hora"
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={`form-control ${ titleClass }`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={ onInputChanged }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group mb-2">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={ formValues.notes }
                        onChange={ onInputChanged }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>
            </form>
        </Modal>
    )
}
