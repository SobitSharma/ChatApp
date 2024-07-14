import { createContext, useContext } from "react";

export const statusContext = createContext({
    statusData:[],
    updateStatusData:()=>{},
    allStatusData:[],
    updateallStatusData:()=>{}
})


export function useStatus(){
    return useContext(statusContext)
}