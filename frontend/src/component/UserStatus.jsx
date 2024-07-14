import React, { useEffect, useRef, useState } from "react";
import { useStatus } from "../Context/StatusContext";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

function UserStatus() {
  const fileRef = useRef();
  const { statusData, updateStatusData } = useStatus();
  const [number, setnumber] = useState(0);
  const [inputkey, setinputkey] = useState(Date.now());
  const navigate = useNavigate();
  const { userLogin } = useUserContext();

  const handleSend = () => {
    const files = fileRef.current?.files;
    const formData = new FormData();

    if (files.length == 0) {
      return alert("Select a file First");
    }

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("photos", files[i]);
      }
    }

    fetch("http://localhost:8000/api/status/setstatus", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          response.json().then((result) => alert(result.error));
        } else {
          response.json().then((result) => {
            const urls = result.uploadedUrls;
            const newArrayData = [...statusData, ...urls];
            updateStatusData(newArrayData);
          });
        }
      })
      .catch((error) => {
        alert("Unexpected Error");
      });
  };

  const GetStatus = () => {
    fetch("http://localhost:8000/api/status/getstatus", {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        response.json().then((result) => {
          updateStatusData(result.userStatus.statusData);
        });
      } else {
        console.log("Error");
      }
    });
  };

  const HandleDeleteStatus = () => {
    if (statusData.length > 0) {
      fetch("http://localhost:8000/api/status/delete", {
        method: "POST",
        credentials: "include",
      }).then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            updateStatusData(result.statusData);
          });
        } else {
          alert("Some error Occurred");
        }
      });
    }
  };

  useEffect(() => {
    GetStatus();
  }, []);

  if(userLogin){
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-xl bg-gray-800 p-10 rounded-lg shadow-lg flex flex-col items-center gap-6">
          <button
            className="bg-red-500 text-white p-2 rounded w-full"
            onClick={() => navigate("/status")}
          >
            Back
          </button>
          <button
            className="bg-white text-black rounded-xl p-2 hover:bg-black hover:text-white"
            onClick={HandleDeleteStatus}
          >
            Delete Status
          </button>
          {statusData.length == 0 ? (
            <h3 className="text-white text-2xl font-semibold">Set Your Status</h3>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (number > 0) {
                    setnumber((prev) => prev - 1);
                  }
                }}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Left
              </button>
              <div className="w-96 h-96 bg-gray-700 flex items-center justify-center rounded-lg">
                <img
                  src={statusData[number]}
                  alt="Not available"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <button
                onClick={() => {
                  if (number < statusData.length - 1) {
                    setnumber((prev) => prev + 1);
                  }
                }}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Right
              </button>
            </div>
          )}
          <div className="w-full flex flex-col gap-4">
            <input
              type="file"
              multiple
              key={inputkey}
              ref={fileRef}
              name="photos"
              accept="image/*"
              className="text-white bg-gray-600 rounded p-2"
            />
            <button
              onClick={() => {
                setinputkey(Date.now());
                handleSend();
              }}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }
  else{
    return(
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <button className="bg-black text-white text-2xl p-2 rounded-xl" onClick={()=>navigate("/login")}>Login</button>
      </div>
    )
  }
 
}

export default UserStatus;
