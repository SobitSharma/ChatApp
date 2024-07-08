import { createContext, useContext } from "react";

export const groupContext = createContext({
    userGroupInfo:"",
    updateUserGroupInfo:()=>{},
    userGroupMessages:{},
    updateuserGroupMessages:()=>{},
    appendGroupMessages:()=>{}
})



export function usegroupContext(){
    return useContext(groupContext)
}



