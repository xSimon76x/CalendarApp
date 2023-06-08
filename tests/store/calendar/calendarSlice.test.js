import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";


describe('Pruebas en calendarSlice', () => {

    test('debe de regresar el estado por defecto', () => {
        const state = calendarSlice.getInitialState();
        expect( state ).toEqual( initialState );
    });

    test('onSetActiveEvent debe de activar el evento', () => {
        
        const activeEvent = events[0];
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( activeEvent ) );
        expect( state.activeEvent ).toEqual( activeEvent );

    });

    test('onAddNewEvent debe de agregar un evento', () => {
        
        const newEvent = {
            id: 3,
            title: 'Cumpleaños de rafael',
            start: new Date('2022-10-21 13:00:00'),
            end: new Date('2022-10-21 15:00:00'),
            notes: 'nota para rafael',
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        expect( state.events ).toEqual( [ ...events, newEvent ] );
    });

    test('onUpdateEvent debe de agregar un evento', () => {
        
        const updateEvent = {
            id: 1,
            title: 'Cumpleaños de mi hermano actualizado',
            start: new Date('2022-10-21 12:00:00'),
            end: new Date('2022-10-21 16:00:00'),
            notes: 'nota de prueba actualizado',
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updateEvent ) );
        expect( state.events ).toContain( updateEvent )
    });

    test('onDeleteEvent debe de borrar el evento activo', () => {
        // calendarWithActiveEventState

        const deleteEvent = calendarWithActiveEventState;
        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent( deleteEvent ) );
        expect( state ).not.toContain(deleteEvent.activeEvent);
        expect( state.activeEvent ).toBe( null );

    });

    test('onLoadEvents debe de establecer los eventos', () => {
        // initialState
        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect( state.events ).toEqual( events );
        expect( state.isLoadingEvents ).toBeFalsy();
        
        calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect( state.events.length ).toBe( events.length );


    });

    test('onLogoutCalendar debe de limpiar el estado', () => {
        // calendarWithActiveEventState
        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );
        expect( state ).toEqual( initialState );
    });
    
    
    
    
})
