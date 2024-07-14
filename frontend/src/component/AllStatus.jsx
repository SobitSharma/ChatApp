import React, { useEffect } from 'react'
import {useNavigate} from "react-router-dom"
import { useStatus } from '../Context/StatusContext'

function AllStatus() {
    const navigate = useNavigate()
    const {updateallStatusData, allStatusData} = useStatus()
    const GetAllStatus = ()=> {
        fetch("http://localhost:8000/api/status/getallstatus", {
            method:'GET',
            credentials:'include'
        }).then((response)=>response.json()).
        then((result)=>updateallStatusData(result.alluserStatus)).
        catch((error)=>alert("Unexpected Error Ocurred"))
    }

    useEffect(GetAllStatus, [])
  return (
    <div>
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-2xl bg-gray-800 shadow-md rounded-lg p-4 overflow-y-auto h-96">
      <div className='flex flex-row gap-96'>
    <button
    onClick={() => navigate("/mystatus")}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    My Status
  </button>
  <button
    onClick={() => navigate("/room")}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Back
  </button>
  </div>
      {
        allStatusData?.map((singleStatus) => (
          <div
            key={singleStatus._id}
            className="flex items-center border-b border-gray-200 py-2 justify-center hover:bg-gray-300"
            onClick={()=>navigate("/showstatus", {state:{singleStatus}})}
          >
            <img
              src={singleStatus.statusId?.profilePic}
              alt={singleStatus.statusId?.fullname}
              className="w-10 h-10 rounded-full mr-4"
            />
            <li className="list-none text-white">{singleStatus.statusId.fullname}</li>
          </div>
        ))
      }
    </div>
  </div>
</div>

  )
}

export default AllStatus