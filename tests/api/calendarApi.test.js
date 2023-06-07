import calendarApi from "../../src/api/calendarApi"



describe('Pruebas en el CalendarApi', () => {
  
    test('debe de de tener la configuración por defecto', () => {
        const baseURL = calendarApi.defaults.baseURL;
        expect( baseURL ).toBe( process.env.VITE_API_URL );
    })

    test('debe de tener el x-token en el header de todas las peticiones ', async() => {
        
        const token = 'ABC-412-XSS';
        localStorage.setItem('token', token);
        const response = await calendarApi.get('/auth');

        expect( response.config.headers['x-token'] ).toBe( token );
    })
    
    
})
