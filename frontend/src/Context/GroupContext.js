import { createContext, useContext } from "react";

export const groupContext = createContext({
    userGroupInfo:"",
    updateUserGroupInfo:()=>{},
    userGroupMessages:{},
    updateuserGroupMessages:()=>{},
    appendGroupMessages:()=>{},
    ChangeFlag:null,
    updateChangeFlag:()=>{}
})



export function usegroupContext(){
    return useContext(groupContext)
}



