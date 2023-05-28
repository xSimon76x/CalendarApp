import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../auth'
import { CalendarPage } from '../calendar/pages/CalendarPage'
import { getEnvVariables } from '../helpers'

export const AppRouter = () => {

  const authStatus = 'authenticated'

  const env = getEnvVariables();

  return (
    <Routes>
      {
        authStatus === 'not-authenticated'
        ? <Route path='/auth/*' element={ <LoginPage /> } />
        : <Route path='/auth/*' element={ <CalendarPage /> } />
      }

      <Route path='/*' element={ <Navigate to={'/auth/login'} /> } />
      
    </Routes>
  )
}
