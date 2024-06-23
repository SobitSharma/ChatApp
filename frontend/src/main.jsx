import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import SignupForm from './component/Signup.jsx'
import LoginForm from './component/LoginForm.jsx'
import ChatRoom from './component/ChatRoom.jsx'
import ForgotPassword from './component/ForgotPassword.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<SignupForm/>}></Route>
      <Route path='/login' element={<LoginForm/>}></Route>
      <Route path='/room' element={<ChatRoom/>}></Route>
      <Route path='/forgotpassword' element={<ForgotPassword/>}></Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
     <RouterProvider router={router}/>
    
  </React.StrictMode>,
)
