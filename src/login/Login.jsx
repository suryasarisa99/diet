import React, { useContext, useState, useEffect } from "react";
import "./login.scss";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { saveUser, SERVER, users } = useContext(DataContext);

  useEffect(() => {
    if (users.length > 0) {
      navigate("/home");
    }
  }, []);

  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(`${SERVER}/login`, {
        user,
        password,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/home");
        saveUser({
          ...res.data,
          user,
          password,
        });
      })
      .catch((err) => {
        console.log("error while login ", err);
      });
  }
  return (
    <div className="login-page">
      <div className="box">
        <p className="login-heading">DIET ECAP</p>
        <form action="" onSubmit={handleSubmit}>
          <div className="inputs">
            <input
              type="text"
              name="user"
              value={user}
              placeholder="Employee or Student ID"
              onChange={(e) => setUser(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button>Sign In</button>
        </form>
      </div>
    </div>
  );
}
