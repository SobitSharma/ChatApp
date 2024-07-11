import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usegroupContext } from "../Context/GroupContext";

function NewGroupForm() {
  const [inputvalue, setinputValue] = useState("");
  const navigate = useNavigate();
  const {updateUserGroupInfo, updateuserGroupMessages} = usegroupContext()
  function HandleAddNewGroup(e) {
    e.preventDefault();
    if (!inputvalue) {
      return alert("Empty Name not allowed");
    }
    const valueToSend = { groupname: inputvalue };
    fetch("http://localhost:8000/api/groups/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",    
      },
      body: JSON.stringify(valueToSend),
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        response.json().then((result) => {
          console.log(result);
        });
        updateInformation()
        alert("The Group has been Created");
        navigate("/groups")
      } else {
        response.json().then((result) => alert(result.error));
      }
      setinputValue("");
    });
  }

  function updateInformation(){
    fetch("http://localhost:8000/api/groups/getgroupuser", {
      method: 'GET',
      credentials: 'include'
    }).then((response) => response.json())
      .then((result) => {
        updateUserGroupInfo(()=>result.usergroup);  
        getMessagesFromFetchedData(result.usergroup)
      });
  }

  function getMessagesFromFetchedData(answer){
    const tempDataHolder = {}
    answer?.Groups?.map((singleuser)=>{
      tempDataHolder[singleuser._id]=singleuser.groupmessages
    })
    updateuserGroupMessages(tempDataHolder)
  }

  return (
    <div className="bg-green-100">
      <button
        className="bg-blue-500 h-10 w-full text-2xl rounded-xl hover:bg-blue-100"
        onClick={() => navigate("/groups")}
      >
        Back
      </button>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Enter The Group Name
            </label>
            <form onSubmit={HandleAddNewGroup}>
              <input
                type="text"
                id="username"
                value={inputvalue}
                autoComplete="off"
                onChange={(e) => setinputValue(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              <div className="bg-gray-400 mt-4 px-4">
                <button
                  className="bg-black text-white text-xl p-2 rounded w-full hover:bg-white hover:text-black"
                  type="submit"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewGroupForm;
