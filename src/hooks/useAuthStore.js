import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store";



export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async({ email, password }) => {

        dispatch( onChecking() );

        try {
            
            const { data } = await calendarApi.post('/auth', { email, password });

            localStorage.setItem("token", data.token );
            localStorage.setItem("token-init-date", new Date().getTime() );
            
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
            
        } catch (error) {

            let errorCustom = '';
            console.log(error)
            if ( error && error.response ) {
                errorCustom = error.response.data?.msg || 
                    Object.values( error.response.data?.errors )[0].msg;
            } else {
                errorCustom = 'Error en las credenciales';
            }

            dispatch( onLogout(errorCustom) );

            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
            return;
        }
    }

    const startRegister = async({ name, email, password, password2  }) => {

        dispatch( onChecking() );

        try {
            
            const { data } = await calendarApi.post('/auth/new', { name, email, password });

            localStorage.setItem("token", data.token );
            localStorage.setItem("token-init-date", new Date().getTime() );
            
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
            
        } catch (error) {

            const errorCustom = error.response.data?.msg || 
                Object.values( error.response.data.errors )[0].msg;

            dispatch( onLogout(errorCustom) );

            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
            return;
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem("token");
        if ( !token ) return dispatch( onLogout() ); 

        try {
            const { data } = await calendarApi.get('auth/renew');
            localStorage.setItem("token", data.token );
            localStorage.setItem("token-init-date", new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
            
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogout() );
    };

    return {
        //* Propiedades
        errorMessage,
        status,
        user,

        //* Metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout
    }

}