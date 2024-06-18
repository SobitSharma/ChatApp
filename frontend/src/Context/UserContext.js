import { createContext, useContext } from "react";

export const UserContext = createContext({
    userLogin:false,
    changeStatus:()=>{},
    UserInfo:{},
    ChangeUserInfo:{},
    sideBarUsers:[],
    updateUsers:()=>{}
})



export const useUserContext = ()=> {
    return useContext(UserContext)
}