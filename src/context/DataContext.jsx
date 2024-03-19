import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
export const DataContext = createContext();

export default function DataProvider({ children }) {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users") || "[]")
  );
  const [rollno, setRollno] = useState("");

  const [graphData, setGraphData] = useState([]);
  const [subjectsGraphData, setSubjectsGraphData] = useState([]);
  const SERVER = "https://diet-b.vercel.app";
  // const SERVER = "http://localhost:3000";
  const [attendance, setAttendance] = useState(null);

  useEffect(() => {
    if (users.length === 0) return;
    localStorage.setItem("users", JSON.stringify(users));
    setRollno(users[0].user);
  }, [users]);

  function saveUser(data) {
    let user = users.find((user) => user.user === data.user);
    if (user) {
      user.password = data.password;
      user.cookie = data.cookie;
      user.role = data.role;
      setUsers([...users]);
    } else {
      setUsers([...users, data]);
    }
  }

  return (
    <DataContext.Provider
      value={{
        users,
        setUsers,
        saveUser,
        attendance,
        setAttendance,
        graphData,
        setGraphData,
        SERVER,
        subjectsGraphData,
        setSubjectsGraphData,
        rollno,
        setRollno,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
