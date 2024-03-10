import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../context/DataContext";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineCalendarMonth, MdCalendarMonth } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [date, setDate] = useState({
    from: "",
    to: "",
  });
  const {
    users,
    attendance,
    setAttendance,
    setUsers,
    SERVER,
    graphData,
    setGraphData,
    ubjectsGraphData,
    setSubjectsGraphData,
  } = useContext(DataContext);
  const [user, setUser] = useState(users[0].user);
  const [month, setMonth] = useState("");
  const [excludeOtherSubjects, setExcludeOtherSubjects] = useState(true);
  const inputFrom = useRef(null);
  const inputTo = useRef(null);
  const weekLastItem = useRef(null);
  const monthRef = useRef(null);
  const lastMonth = useRef(null);
  const navigate = useNavigate();

  const week = [
    { name: "b Weeek", event: getBWeekAttendace },
    { name: "This Week", event: getThisWeekAttendace },
    { name: "Yesterday", event: getYesterdayAttendace },
    { name: "Today", event: getTodayAttendace },
  ];
  const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = new Date().getMonth();

  const MonthsRef = useRef(
    Months.slice(currentMonth + 1).concat(Months.slice(0, currentMonth + 1))
  );

  useEffect(() => {
    // how to scroll to last month, without any animation
    // lastMonth.current.scrollIntoView({ block: "end" });
    // weekLastItem.current.scrollIntoView({ block: "end" });
  }, []);

  function getAttendance(body) {
    navigate("/result");
    let graphs = JSON.parse(localStorage.getItem("graphs") || "{}");
    if (graphs[user.toLowerCase()]) {
      setGraphData(FormatGraphData(graphs[user.toLowerCase()]));
      setSubjectsGraphData(FormatSubjects(graphs[user.toLowerCase()]));
    } else {
      HandleGraphData();
    }
    axios
      .post(`${SERVER}/attendance`, {
        user: users[0].user,
        password: users[0].password,
        rollNo: user,
        cookie: users[0].cookie,
        excludeOtherSubjects,
        expire: users[0].expire,
        ...body,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.cookie) {
          setUsers([
            {
              ...users[0],
              cookie: res.data.cookie,
              role: res.data.role,
              expire: res.data.expire,
            },
          ]);
        }
        setAttendance(res.data);
      });
  }

  function handleAttendance() {
    let from = new Date(date.from).getTime();
    let to = new Date(date.to).getTime();
    getAttendance({
      from,
      to,
    });
  }

  function HandleGraphData() {
    axios
      .post(`${SERVER}/graph`, {
        user: users[0].user,
        password: users[0].password,
        rollNo: user,
        cookie: users[0].cookie,
        expire: users[0].cookie,
      })
      .then((res) => {
        console.log("graph: ", res.data);
        setGraphData(FormatGraphData(res.data.arr));
        setSubjectsGraphData(FormatSubjects(res.data.arr));

        let graphs = JSON.parse(localStorage.getItem("graphs") || "{}");
        graphs[user.toLowerCase()] = res.data.arr;
        localStorage.setItem("graphs", JSON.stringify(graphs));

        if (res.data.cookie) {
          setUsers([
            {
              ...users[0],
              cookie: res.data.cookie,
              role: res.data.role,
              expire: res.data.expire,
            },
          ]);
        }
      });
  }

  function onMonthChange(e) {
    console.log(e.target.value);
    let date = new Date(e.target.value);
    date.setHours(0, 0, 0, 0);
    date.setMinutes(0);
    getAttendance({
      from: date.getTime(),
      to: "",
    });
  }

  function getTodayAttendace(e) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setMinutes(0);
    getAttendance({
      from: date.getTime(),
      to: date.getTime(),
    });
  }

  function getYesterdayAttendace(e) {
    console.log("get Yesterday attendance");
    let date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    date.setMinutes(0);
    console.log(date);
    getAttendance({
      from: date.getTime(),
      to: date.getTime(),
    });
  }

  function getThisWeekAttendace(e) {
    /*
        - 6 and + 1 are for making monday as first of week, instead of sunday.
        if todya is sunday, means day is 0, so we subtract 6 to get prv monday
        else subtract the day + 1 to get monday
    */

    let date = new Date();
    let day = date.getDay();
    let from = new Date(date);
    let to = new Date(date);
    if (day == 0) {
      from.setDate(date.getDate() - 6);
      to.setDate(date.getDate());
    } else {
      from.setDate(date.getDate() - day + 1);
      to.setDate(date.getDate() + (6 - day + 1));
    }
    from.setHours(0, 0, 0, 0);
    from.setMinutes(0);
    to.setHours(0, 0, 0, 0);
    to.setMinutes(0);
    console.log(from, to);
    getAttendance({
      from: from.getTime(),
      to: to.getTime(),
    });
  }

  function getBWeekAttendace(e) {
    let date = new Date();
    let day = date.getDay();
    let from = new Date(date);
    let to = new Date(date);
    if (day == 0) {
      from.setDate(date.getDate() - 6 - 7);
      to.setDate(date.getDate() - 6 - 1);
    } else {
      from.setDate(date.getDate() - day - 7 + 1);
      to.setDate(date.getDate() - day + 1 + 1);
    }
    from.setHours(0, 0, 0, 0);
    from.setMinutes(0);
    to.setHours(0, 0, 0, 0);
    to.setMinutes(0);
    console.log(from, to);
    getAttendance({
      from: from.getTime(),
      to: to.getTime(),
    });
  }

  return (
    <div className="home-page">
      {/* <input type="month" />
      <input type="month" /> */}
      <input
        type="text"
        placeholder="ID"
        value={user}
        className="rollNo-input"
        autoCorrect="off"
        spellCheck={false}
        onChange={(e) => setUser(e.target.value)}
      />

      {/* <input
        type="checkbox"
        checked={excludeOtherSubjects}
        onChange={(e) => {
          setExcludeOtherSubjects(e.target.checked);
        }}
      /> */}

      <div className="section2">
        <div className="title">Range:</div>

        <div className="buttons-row">
          <button
            className="date-input from-btn"
            onClick={() => {
              inputFrom.current.click();
            }}
          >
            {date.from || "From"}
            <MdOutlineCalendarMonth size={22} />
          </button>

          <button
            className="date-input to-btn"
            onClick={() => {
              inputTo.current.focus();
              inputTo.current.click();
            }}
          >
            {date.to || "To"}
            <MdOutlineCalendarMonth size={22} />
          </button>
          <input
            ref={inputFrom}
            type="date"
            className="from-input"
            defaultValue={date.from}
            onChange={(e) => {
              setDate({ ...date, from: e.target.value });
            }}
          />
          <input
            ref={inputTo}
            type="date"
            className="to-input"
            defaultValue={date.to}
            onChange={(e) => {
              setDate({ ...date, to: e.target.value });
            }}
          />
        </div>
      </div>

      {/* MONTH */}

      <div className="section2">
        <div className="title">Month:</div>
        <div className="buttons-row">
          <button
            className="date-input"
            onClick={() => {
              monthRef.current.click();
            }}
          >
            {month || "Month"}
            <MdCalendarMonth size={22} />
          </button>

          <input
            ref={monthRef}
            type="month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              onMonthChange(e);
            }}
          />
        </div>
      </div>
      {/* 
      <div className="section">
        {week.map((w, week_index) => {
          if (week_index == week.length - 1) {
            return (
              <div ref={weekLastItem} key={w.name} onClick={w.event}>
                {w.name}
              </div>
            );
          } else {
            return (
              <div key={w.name} onClick={w.event}>
                {w.name}
              </div>
            );
          }
        })}
      </div> */}
      <button onClick={handleAttendance} className="attendance-button">
        Attendance
      </button>
      {/* <div className="section">
        {MonthsRef.current.map((m, month_index) => {
          if (month_index == 11) {
            return (
              <div ref={lastMonth} key={m}>
                {m}
              </div>
            );
          } else {
            return <div key={m}>{m}</div>;
          }
        })}
      </div> */}
    </div>
  );
}
function FormatDate(date) {
  let d = new Date(date);
  const day = String(d.getUTCDate());
  const month = String(d.getUTCMonth() + 1);
  const year = String(d.getUTCFullYear());
  // return `${day}/${month}/${year}`;
  return `${day}/${month}`;
}

function FormatGraphData(data) {
  return data.map((item, i) => {
    return {
      // name: "week " + i,
      name: FormatDate(item.week),
      attend: item.total.attend,
      held: item.total.held,
      percent: item.total.percent,
    };
  });
}

function FormatSubjects(data) {
  let temp = [];
  console.log(data);
  data[0].data.forEach((item, i) => {
    temp.push([]);
  });
  data.forEach((item, i) => {
    item.data.forEach((subject, j) => {
      subject.name = FormatDate(item.week);
      temp[j].push(subject);
    });
  });
  console.log(temp);
  return temp;
}
