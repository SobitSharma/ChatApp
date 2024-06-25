import { createContext, useContext } from "react";

export const UserContext = createContext({
    userLogin:false,
    changeStatus:()=>{},
    UserInfo:{},
    ChangeUserInfo:{},
    sideBarUsers:[],
    updateUsers:()=>{},
    updateUserFullname :()=>{},
    updateUserProfilePic:()=>{},
    updatePreviousMessages:()=>{}
})



export const useUserContext = ()=> {
    return useContext(UserContext)
}