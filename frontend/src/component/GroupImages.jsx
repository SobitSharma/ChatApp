import React, { useEffect, useRef, useState } from 'react'
import { usegroupContext } from '../Context/GroupContext'

function GroupImages({groupId}) {

  const ImageRef = useRef()
  const {appendGroupMessages} = usegroupContext()
  const [loading, setloading] = useState(false)
  const [inputkey, setinputkey] = useState(Date.now())
  
  const SendImageToGroup = () => {
    const file = ImageRef.current.files[0]
    if(!file){
        return alert("Empty File cannot be sent")
    }
    const validateOfImages = file.type.split("/")[0] == "image"
    if(!validateOfImages){
        return alert("Only Image Files are Allowed")
    }

    setloading(true)

    const formdata = new FormData()
    formdata.append("imageFile", file)

    fetch(`http://localhost:8000/api/groups/sendimages/${groupId}`, {
      
        method:'POST',
        body:formdata,
        credentials:'include'
    }).then((response)=> {
      if(response.ok){
        response.json().then((result)=>{
          appendGroupMessages(result.receiverId, result)
        })
      }
      else{
        console.log(response)
      }
      setinputkey(Date.now())
      setloading(false)
    })


  }
  return (
    <div className=" flex flex-row p-4 border rounded shadow-sm gap-8">
    <input
    key={inputkey}
      type="file"
      className="p-2 border rounded"
      id='inputfield'
      ref={ImageRef}
    />
    {
      loading? <button className='bg-blue-400 rounded-xl p-2' disabled>
        Sending ..
      </button>
      :
      <button
    onClick={SendImageToGroup}
    className='bg-blue-400 hover:bg-gray-600 rounded-xl p-2'
    >Send</button>
    }
  </div>
    )
}

export default GroupImages