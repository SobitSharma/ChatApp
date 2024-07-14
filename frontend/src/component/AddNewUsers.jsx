import React, { useEffect, useState } from 'react';
import { useUserContext } from '../Context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { usegroupContext } from '../Context/GroupContext';

function AddNewUsers() {
  const { sideBarUsers , userLogin} = useUserContext();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [alreadyPresentUsers, setPresentUsers] = useState([]);
  const location = useLocation()
  const {groupId, participants} = location.state || {}
  const navigate = useNavigate()
  const {updateUserGroupInfo} = usegroupContext()

  const alreadyAddedUsers = ()=> {
    if(participants){
      const temp = participants.map((user)=> user._id)
      if(temp){
        setPresentUsers(temp)
      }
      
    }
  }


  function updateInformation(){
    fetch("http://localhost:8000/api/groups/getgroupuser", {
      method: 'GET',
      credentials: 'include'
    }).then((response) => response.json())
      .then((result) => {
        updateUserGroupInfo(()=>result.usergroup);  
      });
  }

  useEffect(alreadyAddedUsers, [])

  const handleCheckboxChange = (username) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(username)
        ? prevSelectedUsers.filter((user) => user !== username)
        : [...prevSelectedUsers, username]
    );
  };

  const handleAddClick = () => {
    console.log('Selected Users:', selectedUsers);

    fetch("http://localhost:8000/api/groups/adduser", {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({groupId, usersId:selectedUsers}),
      credentials:'include'
    }).then((response)=> {
      if(response.ok){
        updateInformation();
        alert("The users are added in this group")
        navigate("/groups")
      }
    })
  };

  return (
    userLogin
    ?
    <div>
      <button 
      className='bg-blue-400 p-3 rounded w-full hover:bg-slate-500' 
      onClick={()=> navigate("/groups")}
      >Back</button>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-center">All the Users are here. You can select:</h3>
        <ul className="space-y-2 mb-4">
          {sideBarUsers.map((singleUser) => (
            <li key={singleUser._id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md shadow-sm">
              <span className="text-gray-800">{singleUser.username}</span>
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={selectedUsers.includes(singleUser._id)}
                disabled= {alreadyPresentUsers.includes(singleUser._id)}
                onChange={() => handleCheckboxChange(singleUser._id)}
              />
            </li>
          ))}
        </ul>
        <button
          onClick={handleAddClick}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
        >
          ADD
        </button>
      </div>
    </div></div>
    :

    <div className='bg-green-300 text-center'>
    <button onClick={()=> navigate("/login")}>Login Again</button>
</div>
  );
}

export default AddNewUsers;
