import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"

function ForgotPassword() {
    const [email, setemail] = useState("")
    const [condition, setcondition] = useState(false)
    const [OTP, setOTP] = useState("")
    const [passcode, setpasscode] = useState("")
    const navigate = useNavigate();

    const SendOTP = () => {
        fetch(`http://localhost:8000/api/updates/verifyemail/${email}`, {
          method:'POST'
        })
        .then((response)=> {
          console.log(response)
            if(response.ok){
                setcondition(true)
            }
            else{
                response.json().then((result)=> alert(result.error))
            }
        })
    }

    const HandleOTP = () => {
      fetch(`http://localhost:8000/api/updates/${OTP}/${email}/${passcode}`, {
        method:"POST"
      })
      .then((response)=> {
          if(response.ok){
              setemail("")
              setOTP("")
              setcondition(false)
              alert("Your Password has updated SucessFully. You can Login Now")
              navigate("/login")
          }
          else{
              response.json().then((result)=> alert(result.error))
              window.location.reload();
          }
      })
    }

  return (
    !(condition)?
    <div className="bg-white p-8 rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Enter Your Registered Email Id</h2>
      <input
        type="text"
        value={email}
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
        onChange={(e)=>setemail(e.target.value)}
      />
      <button
        type="button"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
        onClick={SendOTP}
      >
        Send OTP
    </button> </div> 
      : <div className="bg-white p-8 rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">A OTP has been sent to the Registered Email Id</h2>
      <input
        type="text"
        value={OTP}
        placeholder='Enter the OTP'
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
        onChange={(e)=>setOTP(e.target.value)}
      />

        <input
        type="text"
        value={passcode}
        placeholder='Enter the New Password'
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
        onChange={(e)=>setpasscode(e.target.value)}
      />
      <button
        type="button"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
        onClick={HandleOTP}
      >
        Verify
      </button>
    </div> 
  ) 
}

export default ForgotPassword