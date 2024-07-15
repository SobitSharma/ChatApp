import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../Context/UserContext';

function ShowStatus() {
    const [number, setnumber] = useState(0)
    const {userLogin} = useUserContext()
    const location = useLocation()
    const navigate = useNavigate()
    const {singleStatus} = location.state || {}
    
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
     {
      userLogin ?  <div >
      <div>
        <button className='bg-black text-white p-4 rounded-lg text-xl' onClick={()=>navigate("/status")}>Back</button>
      </div>
      <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (number > 0) {
                  setnumber((prev) => prev - 1);
                }
              }}
              className="bg-blue-500 text-white p-10 rounded hover:bg-blue-600 text-3xl"
            >
              {"<"}
            </button>
            <div className="max-w-3xl max-h-3xl bg-gray-700 flex items-center justify-center rounded-lg p-2">
              <img
                src={singleStatus?.statusData[number]}
                alt="Not available"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <button
              onClick={() => {
                if (number < singleStatus?.statusData?.length - 1) {
                  setnumber((prev) => prev + 1);
                }
              }}
              className="bg-blue-500 text-white p-10 rounded hover:bg-blue-600 text-3xl"
            >
              {">"}
            </button>
          </div>
          </div> : <button className="bg-black text-white text-2xl p-3" onClick={()=>navigate('/login')}>Login</button>
     }
    </div>
  )
}

export default ShowStatus