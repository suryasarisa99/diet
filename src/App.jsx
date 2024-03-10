import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./home/Home";
import Result from "./result/Result";
import Login from "./login/Login";
import { useContext, useEffect } from "react";
import { DataContext } from "./context/DataContext";

function App() {
  const navigate = useNavigate();
  const { users } = useContext(DataContext);
  useEffect(() => {
    if (users.length > 0) {
      navigate("/home");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}

export default App;
