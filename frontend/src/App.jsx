import { Outlet } from "react-router-dom"
import { UserContext } from "./Context/UserContext"
import { useContext, useState } from "react"
import { SocketContextProvider } from "./Context/SocketContext"
import { groupContext } from "./Context/GroupContext"
import { statusContext } from "./Context/StatusContext"

function App() {
  const [userLogin, setUserLogin] = useState(false)
  const [UserInfo, setUserInfo] = useState({})
  const [sideBarUsers, setsideBarUsers] = useState([])
  const [userGroupInfo, setUserGroupInfo] = useState({})
  const [userGroupMessages, setuserGroupMessages] = useState({})
  const [statusData, setstatusData] = useState([])
  const [allStatusData, setallStatusData] = useState([])

  const updateallStatusData = (data)=>{
    console.log(data)
    setallStatusData(data)
  }

  const updateStatusData = (values) => {
    setstatusData(values)
  }

  const appendGroupMessages = (id, message) => {
    console.log("looooo")
    setuserGroupMessages((prevmessages)=> {
      const selectData = prevmessages[id]
      selectData.push(message)
      return {...prevmessages, [id]:selectData}
    })
  }

  const updateuserGroupMessages = (messages) => {
    setuserGroupMessages(messages)
  }

    const updateUserGroupInfo = (info) => {
      setUserGroupInfo(info)
    }

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
         <groupContext.Provider value={{userGroupInfo, updateUserGroupInfo, userGroupMessages, updateuserGroupMessages, appendGroupMessages,
         }}>
          <statusContext.Provider value={{statusData, updateStatusData, allStatusData, updateallStatusData}}>
        <Outlet/>  
        </statusContext.Provider>
        </groupContext.Provider>
      </SocketContextProvider>
    </UserContext.Provider> 
  )
}

export default App   
