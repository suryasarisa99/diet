import React, { useContext, useState, useEffect } from "react";
import "./login.scss";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { saveUser, SERVER, users } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (users.length > 0) {
      navigate("/home");
    }
  }, []);

  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    axios
      .post(`${SERVER}/login`, {
        user,
        password,
      })
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        navigate("/home");
        saveUser({
          ...res.data,
          user,
          password,
        });
      })
      .catch((err) => {
        console.log("error while login ", err);
        setError(true);
        setLoading(false);
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
              onChange={(e) => {
                if (error) setError(false);
                setUser(e.target.value);
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                if (error) setError(false);
                setPassword(e.target.value);
              }}
            />
          </div>
          <button>
            {!loading ? "Sign In" : <span className="loader"></span>}
          </button>
          {error && <p className="error">Incorrect Password or Id</p>}
        </form>
      </div>
    </div>
  );
}
