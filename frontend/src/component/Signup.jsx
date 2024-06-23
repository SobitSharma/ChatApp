import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpscreen, setotpscreen] = useState(false);
  const [tempdata, settempdata] = useState("");
  const [email, setemail] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const [otp, setotp] = useState("");

  const onSubmit = (e) => {
    setloading(true)
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!fullname || !username || !password || !gender || !email) {
      alert("Please Fill All the Required Details");
    }

    const dataToSend = {
      fullname,
      username,
      password,
      confirmPassword,
      gender,
      email,
    };
    fetch("http://localhost:8000/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        settempdata(dataToSend);
        setotpscreen(true);
      } else {
        response.json().then((result)=>alert(result.error))
        setloading(false)
      }
    });
  };

  function SignupVerification() {
    fetch("http://localhost:8000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...tempdata, OTP: otp }),
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        alert("You can Login Now");
        settempdata("");
        setotpscreen(false);
        setloading(false)
        navigate("/login");
      } else {
        alert("Wrong OTP Entered");
        setloading(false)
        setotpscreen(false);
      }
    });
  }

  return !otpscreen ? (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form
          onSubmit={onSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fullname"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="gender"
            >
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? "Processing..." : "SignUp"}
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:text-blue-700">
                Log in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div class="bg-white p-8 rounded-lg shadow-md max-w-sm mx-auto">
      <h2 class="text-2xl font-bold mb-4 text-center">OTP Has been sent to the provided Email</h2>
      <input
        type="text"
        onChange={(e) => setotp(e.target.value)}
        class="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
      />
      <button
        type="button"
        onClick={SignupVerification}
        class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
      >
        Verify
      </button>
    </div>
  );
};

export default SignupForm;
