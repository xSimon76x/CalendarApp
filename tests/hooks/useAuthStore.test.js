import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/store";
import { useAuthStore } from "../../src/hooks";
import { Provider } from "react-redux";
import { act, renderHook, waitFor } from "@testing-library/react";
import { initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";
import calendarApi from "../../src/api/calendarApi";



const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            // ui: uiSlice.reducer
            auth: authSlice.reducer
        },
        preloadedState: {
            // ui: { ...initialState }
            auth: { ...initialState }
        }
    });
}

describe('Pruebas en el useAuthStore', () => {

    beforeEach(
        () => localStorage.clear()
    );

    test('debe de regresar los valores por defecto', () => {

        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook(
            () => useAuthStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } > { children } </Provider>
            }
        );

        expect( result.current ).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            startLogin: expect.any( Function ),
            startRegister: expect.any( Function ),
            checkAuthToken: expect.any( Function ),
            startLogout: expect.any( Function )
        });

    });
    
    test('startLogin debe de realizar el login correctamente', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(
            () => useAuthStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } > { children } </Provider>
            }
        );

        await act( async() => {
            await result.current.startLogin( testUserCredentials )
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                name: 'TestSuit',
                uid: '647fdbff2ee7f838105dca61'
            }
        });
        expect( localStorage.getItem('token') ).toEqual( expect.any( String ) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any( String ) );
    });

    test('startRegister debe de fallar la autenticación', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(
            () => useAuthStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } > { children } </Provider>
            }
        )
        
        await act( async() => {
            await result.current.startLogin({
                email: 'alguncorreodetest123@gmail.com',
                password: '123123123'
            })
        });

        const { errorMessage, status, user } = result.current;

        expect( localStorage.getItem('token') ).toBe( null );
        expect( { errorMessage, status, user } ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: 'Un usuario no existe con ese correo',
        });

        await waitFor(
            () => expect( result.current.errorMessage ).toBe( undefined )
        );

    });

    test('startRegister debe de crear un usuario', async() => {

        const newUser = {
            name: 'alguncorreodetest',
            email: 'alguncorreodetest123@gmail.com',
            password: '123123123'
        };
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(
            () => useAuthStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } > { children } </Provider>
            }
        );
        
        // Para evitar que se realice el POST a la BD, se usa el spy
        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: "123123",
                name: "Test User",
                token: "ALHUN-TOKEN",
            }
        })
        
        await act( async() => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            status: 'authenticated',
            user: {
                uid: "123123",
                name: "Test User",
            },
            errorMessage: undefined,
        });

        // Para eliminar el espia, y solo funcione en este test, destruye el espia
        spy.mockRestore();
    })

    test('startRegister debe de fallar la creación ', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(
            () => useAuthStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } > { children } </Provider>
            }
        );
               
        await act( async() => {
            await result.current.startRegister(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: 'Un usuario existe con ese correo',
        });

    })
    
    test('checkAuthtoken debe de fallar si no hay token', async() => {
      
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(
            () => useAuthStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } > { children } </Provider>
            }
        );
               
        await act( async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        });
    });

    test('checkAuthtoken debe de autenticar el usuario si hay un token', async() => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(
            () => useAuthStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } > { children } </Provider>
            }
        );
               
        await act( async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            status: 'authenticated',
            user: {
                name: "TestSuit",
                uid: "647fdbff2ee7f838105dca61",
            },
            errorMessage: undefined
        });
    })
    
    
    

});
