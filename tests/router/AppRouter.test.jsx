import { render, screen } from "@testing-library/react";
import { useAuthStore, useForm } from "../../src/hooks";
import { AppRouter } from "../../src/router/AppRouter";
import { MemoryRouter } from "react-router-dom";

jest.mock('../../src/hooks');

// Mock o Simulacion de un componente COMPLETO, para validar que se haya llamado
jest.mock(
    '../../src/calendar/pages/CalendarPage', 
    () => ({
        CalendarPage: () => <h1>CalendarPage</h1>
    })
);


describe('Pruebas en <AppRouter />', () => {

    const mockCheckAuthToken = jest.fn();

    beforeEach(
        () => jest.clearAllMocks()
    )

    test('debe de mostrar la pantalla de carga y llamar checkAuthToken', () => {
        
        useAuthStore.mockReturnValue({
            status: 'cheking',
            checkAuthToken: mockCheckAuthToken

        });

        render(
            <AppRouter />
        );

        expect( screen.getByText('Cargando...') ).toBeTruthy();
        expect( mockCheckAuthToken ).toHaveBeenCalled();

    })

    test('debe de mostrar el login en caso de no estar autenticado', () => {
        
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        useForm.mockReturnValue({
            loginEmail: '',
            loginPassword: '',
        });

        const { container } = render(
            <MemoryRouter initialEntries={['/auth2/algo/otracosa']}>
                <AppRouter />
            </MemoryRouter>
        );

        expect( screen.getByText('Ingreso') ).toBeTruthy();
        expect( container ).toMatchSnapshot(); 

    })

    test('debe de mostrar el calendario si estamos autenticados', () => {
        
        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );

        expect( screen.getByText('CalendarPage') ).toBeTruthy();

    })
    
})
