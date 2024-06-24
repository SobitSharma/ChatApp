import { Outlet } from "react-router-dom"
import { UserContext } from "./Context/UserContext"
import { useContext, useState } from "react"
import { SocketContextProvider } from "./Context/SocketContext"

function App() {
  const [userLogin, setUserLogin] = useState(false)
  const [UserInfo, setUserInfo] = useState({})
  const [sideBarUsers, setsideBarUsers] = useState([])

  const changeStatus = (flag) => {
    setUserLogin(flag)
  }

  const ChangeUserInfo = (data) => {
    setUserInfo(data)
  }

  const updateUsers = (users) => {
    setsideBarUsers(users)
  }

  const updateUserFullname = (name)=> {
    setUserInfo((previouse)=> {
      return {...previouse, fullname:name}
    })
  }

  const updateUserProfilePic = (url)=> {
    setUserInfo((previouse)=> {
      return {...previouse, profilePic:url}
    })
  }
  return (
    <UserContext.Provider value={{userLogin, UserInfo, changeStatus, ChangeUserInfo, sideBarUsers, updateUsers, updateUserFullname, updateUserProfilePic}}>
      <SocketContextProvider>
        <Outlet/>  
      </SocketContextProvider>
    </UserContext.Provider> 
  )
}

export default App
