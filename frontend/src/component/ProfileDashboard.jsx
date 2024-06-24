import React from 'react'
import { useUserContext } from '../Context/UserContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'

function ProfileDashboard() {
  const {UserInfo, userLogin,updateUserFullname, updateUserProfilePic} = useUserContext()
  const [edit, setedit] = useState(true)
  const [isPicLarge, setIsPicLarge] = useState(false);
  const [inputvalue, setinputvalue] = useState(UserInfo.fullname)
  const [imageflag, setimageflag] = useState(true)
  const navigate = useNavigate()
  const imageRef = useRef()

  const handleSaveFullName = () => {
    if(edit){
      setedit(false)
    }
    else{
      if(!inputvalue){
        return alert("Empty Values not allowed")
      }
      fetch(`http://localhost:8000/api/updates/updatename/${inputvalue}`, {
        method:"POST",
        credentials:'include'
      }).
      then((response)=> response.json()).then((result)=> {
        updateUserFullname(result.user?.fullname)
        setedit(true)
      })
    }
  }
  const handlePicDoubleClick = () => {
    setIsPicLarge(!isPicLarge);
  };

  function extractDayMonthYear(isoString) {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${day}:${month}:${year}`
}

  const HandleImageButton = ()=> {
    if (imageflag){
      setimageflag(false)
    }
    else{
      const imageFile = imageRef.current.files[0]
      if(!imageFile){
        return alert("The Image file should be not be Empty")
      }
      const formdata = new FormData();
      formdata.append("profilepic", imageFile)
      console.log(formdata)

      fetch("http://localhost:8000/api/updates/updateprofilepic", {
        method:'POST',
        body:formdata,
        credentials:'include'
      }).then((response)=>response.json()).
      then((result)=>{
        if(result.url){
          updateUserProfilePic(result.url)
        }
        else{
          alert(result.error)
        }
      })
      setimageflag(true)
    }
  }

  return (
    userLogin?
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
      <div 
      className='bg-gray-400 text-2xl text-black rounded-lg text-center p-2 hover:bg-green-200 hover:p-4'
      onClick={()=>navigate("/room")}
      >BACK</div>
        <div className="relative flex flex-col items-center">
          {
            imageflag ? 
            <img
            className={`rounded-full mx-auto cursor-pointer transition-all duration-300 bg-red-400 ${isPicLarge ? 'w-64 h-64' : 'w-32 h-32'}`}
            src={UserInfo.profilePic}
            alt="Profile Picture"
            onDoubleClick={handlePicDoubleClick} 
          /> : <input type='file' ref={imageRef}/>
          }
          <button className="mt-4 text-md text-blue-500 hover:underline"
          onClick={HandleImageButton}
          >
            {imageflag ? "Change Profile Pic" : "Save"}
          </button>
        </div>
        <div className="mt-6 text-center">
          <div className="relative inline-block">
            <input
              type="text"
              value={inputvalue}
              onChange={(e)=> setinputvalue(e.target.value)}
              disabled={edit}
              className="text-xl font-semibold text-gray-900 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-center w-full"
            />
            <button 
            className="absolute right-0 bottom-0 text-md text-blue-500 hover:underline"
            onClick={handleSaveFullName}
            >
              {edit ? "Edit" : "Save"}
            </button>
          </div>
          <h3 className="text-gray-600 mt-4">
            User Since {`${extractDayMonthYear(UserInfo.createdAt)}`}
          </h3>
        </div>
      </div>
    </div>: (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Please Login Again</h1>
        <button
          onClick={()=>navigate("/login")}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Login Page
        </button>
      </div>
    </div>
  )
  )
}

export default ProfileDashboard