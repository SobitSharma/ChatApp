import React, { useEffect, useRef, useState } from 'react';
import {usegroupContext } from '../Context/GroupContext';
import { useUserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../Context/SocketContext';


function Groups() {
  const { userGroupInfo, updateUserGroupInfo , userGroupMessages, updateuserGroupMessages, appendGroupMessages} = usegroupContext();
  const [selectedGroup, setSelectedGroup] = useState(""); 
  const [newMessage, setNewMessage] = useState("");
  const {UserInfo, userLogin} = useUserContext()
  const navigate = useNavigate()
  const {newIncomingMessage} = useSocketContext();  
  const newMessageRef = useRef(null)  

  useEffect(()=>{
    if(!(isEmpty(newIncomingMessage)) && !(userGroupMessages[newIncomingMessage.receiverId]?.includes(newIncomingMessage))){
      appendGroupMessages(newIncomingMessage.receiverId, newIncomingMessage)   
      scrollToBottom(); 
    }
    
  }, [newIncomingMessage])

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  }

  const scrollToBottom = () => {
    newMessageRef.current?.scrollIntoView({ behavior: "smooth"});
  };

  useEffect(() => {
    if(isEmpty(userGroupMessages)){
      fetch("http://localhost:8000/api/groups/getgroupuser", {
        method: 'GET',
        credentials: 'include'
      }).then((response) => response.json())
        .then((result) => {
          updateUserGroupInfo(result.usergroup);  
          getMessagesFromFetchedData()
        });
    }
  }, []);     

  function getMessagesFromFetchedData(){
    const tempDataHolder = {}
    userGroupInfo?.Groups?.map((singleuser)=>{
      tempDataHolder[singleuser._id]=singleuser.groupmessages
    })
    updateuserGroupMessages(tempDataHolder)
  }

  const userSelected = (user) => {
    setSelectedGroup(user);
  }

  function convertDataAndTime(isoString){
    const date = new Date(isoString);
  
    let hours = date.getHours();  
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
  
    hours = hours % 12;
    hours = hours ? hours : 12;  
    const formattedHours = hours.toString().padStart(2, "0");
  
    const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
    return formattedTime;
  }

  const messagesInGroup = (e) => {
    e.preventDefault();
    const createNewMessage = {
      _id:Date.now(),
      senderId:UserInfo._id,
      receiverId:selectedGroup._id,
      message:newMessage,
      type:"text",
      sendername:UserInfo.fullname
    }

    const groupId = selectedGroup?._id;
    const Participants = []
    selectedGroup.participants?.map((singlepart)=> {Participants.push(singlepart._id)})
    fetch("http://localhost:8000/api/groups/send", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupId, message: newMessage, sendername:UserInfo.fullname, Participants}),
      credentials: 'include'
    }).then((response)=> {
      if(response.ok){
        appendGroupMessages(selectedGroup._id, createNewMessage)
        scrollToBottom()
      }
      else{
        alert("Server Crashed Try again After Some Time")
      }
    })
    setNewMessage("");
  }

  const HandleParticipants = () => {
    setparflag((prev)=>!prev)
  }

 
  return (
    userLogin?
    <div>
      <button 
      className='bg-blue-400 p-6 rounded w-full hover:bg-slate-500' 
      onClick={()=> navigate("/room")}
      >Back</button>
    <div className='flex flex-row bg-gray-100 h-screen'>
      <div className='bg-gray-200 flex flex-col w-1/4 p-4 overflow-y-auto'>
        <div className='bg-gray-100 text-xl text-center p-2 mb-4'>
          <h3>Your Groups</h3>
        </div>
        {
          userGroupInfo?.Groups?.map((singleUser) => (
            <div
              className='flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-300'
              key={singleUser._id}
              onClick={() => userSelected(singleUser)}
            >
              <img src={singleUser.grouppic} alt="" className='w-12 h-12 rounded-full' />
              <p className='text-lg'>{singleUser.groupname}</p>
            </div>
          ))
        }
      </div>
      <div className='flex flex-col flex-grow'>
        {selectedGroup ?
          <>
            <div className='bg-gray-100 p-4 text-lg font-semibold border-b flex flex-row justify-around'>
              <div> {selectedGroup.groupname} </div>
              <button className='' onClick={HandleParticipants}>Partcipants</button>
              <button onClick={()=>navigate('/addusers', {state:{groupId:selectedGroup._id, participants:selectedGroup.participants}})}>Add Participants</button>
            </div>
            <div className='flex-grow p-4 overflow-y-auto'>
              {userGroupMessages[selectedGroup._id]?.map((singleMessage, index) => (
                <div key={index} className='p-2 bg-white mb-2 rounded shadow'>
                  {singleMessage.message}
                  <p className="text-xs text-gray-600">
                    {convertDataAndTime(singleMessage.createdAt)} 
                  </p>
                  <p className="text-xs text-red-600"> 
                    {singleMessage.sendername}
                  </p>
                </div>
                
              ))}
            <div ref={newMessageRef}/>
            </div >
            <form onSubmit={messagesInGroup} className="flex items-center p-4 border-t bg-gray-100">
              <input
                value={newMessage}
                className="flex-grow rounded-full p-2 border-gray-300 focus:outline-none"
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button
                type="submit"
                className="ml-4 bg-blue-500 text-white p-2 rounded-full"
              >
                Send
              </button>
            </form>

          </>
          : <div className='flex-grow flex items-center justify-center'>
              <p className='text-gray-500'>Select a group to start messaging</p>
            </div>
        }
      </div>
    </div></div>
    :
    
    <div className='bg-green-300 text-center'>
        <button onClick={()=>navigate("/login")}>Login Again</button>
    </div>
  )
}

export default Groups;
