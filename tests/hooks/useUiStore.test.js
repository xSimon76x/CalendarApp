import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook } from "@testing-library/react";
import { useUiStore } from "../../src/hooks";
import { Provider } from "react-redux";
import { store, uiSlice } from "../../src/store";



const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    });
}


describe('Pruebas en useUiStore', () => {

    test('debe de regresar los valores por defecto', () => {
        
        const mockStore = getMockStore({ isDateModalOpen: false });

        const { result } = renderHook(
            () => useUiStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } > { children } </Provider>
            }
        );
   
        expect( result.current ).toEqual({
            isDateModalOpen: false,
            closeDateModal: expect.any( Function ),
            openDateModal: expect.any( Function ),
            toggleDateModal: expect.any( Function )

        })
    });

    test('openDateModal debe de colocar true en el isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: false });

        const { result } = renderHook(
            () => useUiStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } > { children } </Provider>
            }
        );

        const { openDateModal } = result.current;

        act(
            () => {
                openDateModal();
            }
        );
        expect( result.current.isDateModalOpen ).toBeTruthy();

    })
    
    
})
