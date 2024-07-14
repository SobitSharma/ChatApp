import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import SignupForm from './component/Signup.jsx'
import LoginForm from './component/LoginForm.jsx'
import ChatRoom from './component/ChatRoom.jsx'
import ForgotPassword from './component/ForgotPassword.jsx'
import ProfileDashboard from './component/ProfileDashboard.jsx'
import Groups from './component/Groups.jsx'
import NewGroupForm from './component/NewGroupForm.jsx'
import AddNewUsers from './component/AddNewUsers.jsx'
import UserStatus from './component/UserStatus.jsx'
import AllStatus from './component/AllStatus.jsx'
import ShowStatus from './component/ShowStatus.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<SignupForm/>}></Route>
      <Route path='/login' element={<LoginForm/>}></Route>
      <Route path='/room' element={<ChatRoom/>}></Route>
      <Route path='/forgotpassword' element={<ForgotPassword/>}></Route>
      <Route path='/profile' element={<ProfileDashboard/>}></Route>
      <Route path='/groups' element={<Groups/>}></Route>
      <Route path='/newgroup' element={<NewGroupForm/>}></Route>
      <Route path='/addusers' element={<AddNewUsers/>}></Route>
      <Route path='/status' element={<AllStatus/>}></Route>
      <Route path='/mystatus' element={<UserStatus/>}></Route>
      <Route path='/showstatus' element={<ShowStatus/>}></Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
     <RouterProvider router={router}/>
    
  </React.StrictMode>,
)
