import React, { useState, useEffect, useRef } from 'react';

const SendImages = ({selectUser, setpreviousmessages}) => {
    const [inputkey, setinputkey] = useState(Date.now())
    const [loading, setloading] = useState(false)
    const fileReference = useRef()

    useEffect(()=> {setinputkey(Date.now())}, [selectUser])

    function HandleSendingImages(){
        const file = fileReference.current.files[0]
        if(!file){
            return alert("Empty File cannot be sent")
        }
        const validateOfImages = file.type.split("/")[0] == "image"
        if(!validateOfImages){
            return alert("Only Image Files are Allowed")
        }
        setloading(true)
        const formdata = new FormData()
        formdata.append("image", file)

        fetch(`http://localhost:8000/api/messages/imagefile/${selectUser?._id}`, {
            method:'POST',
            body:formdata,
            credentials:'include'
        }).then((response)=> {
            if(response.ok){
                response.json().then((result)=> {
                    setpreviousmessages((previous) => {
                        const userMessages = previous[selectUser.fullname] || [];
                        return {
                          ...previous,
                          [selectUser.fullname]: [...userMessages, result],
                        };
                      });
                })
            }
            else{
                response.json().then((result)=> alert(result.error))
            }
            setloading(false)
            setinputkey(Date.now())

        })
    }

  return (
    <div className=" flex flex-row p-4 border rounded shadow-sm gap-8">
      <input
        key={inputkey}
        type="file"
        className="p-2 border rounded"
        ref={fileReference}
        id='inputfield'
      />
      {
      !loading?
      <button
      className='bg-blue-400 hover:bg-gray-600 rounded-xl p-2'
      onClick={HandleSendingImages}
      >Send</button>
      :
      <span>Sending...</span>}
    </div>
  );
};

export default SendImages;
