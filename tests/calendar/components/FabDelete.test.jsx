import { fireEvent, render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { store } from "../../../src/store"
import { FabDelete } from "../../../src/calendar/components/FabDelete"
import { useCalendarStore } from "../../../src/hooks";

jest.mock('../../../src/hooks/useCalendarStore.js');

describe('Pruebas en <FabDelete />', () => {

    const mockStartDeletingEvent = jest.fn();

    beforeEach(
        () => jest.clearAllMocks()
    );

    test('debe de mostrar el componente correctamente', () => {

        useCalendarStore.mockReturnValue({
            HasEventSelected: false
        });

        
        render(
            <FabDelete />
        );

        const btn = screen.getByLabelText('btn-delete');
        expect(btn.classList).toContain('btn');
        expect(btn.style.display).toContain('none');

    });

    test('debe de mostrar el boton si hay un evento activo', () => {

        useCalendarStore.mockReturnValue({
            HasEventSelected: true
        });

        
        render(
            <FabDelete />
        );

        const btn = screen.getByLabelText('btn-delete');
        expect(btn.style.display).toContain('');

    });
    
    test('debe de llamar startDeletingEvent si hay evento activo', () => {

        useCalendarStore.mockReturnValue({
            HasEventSelected: true,
            startDeleteEvent: mockStartDeletingEvent
        });

        
        render(
            <FabDelete />
        );

        const btn = screen.getByLabelText('btn-delete');
        fireEvent.click( btn );

        expect( mockStartDeletingEvent ).toHaveBeenCalled();
    });
    
})
