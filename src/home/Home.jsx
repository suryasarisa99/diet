import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../context/DataContext";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineCalendarMonth, MdCalendarMonth } from "react-icons/md";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Home() {
  const [date, setDate] = useState({
    from: "",
    to: "",
  });

  const [searchParams, setSearchParams] = useSearchParams();

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
  const inputFrom = useRef(null);
  const inputTo = useRef(null);
  const weekLastItem = useRef(null);
  const lastMonth = useRef(null);

  const monthRef = useRef(null);
  const navigate = useNavigate();

  // const week = [
  //   { name: "b Weeek", event: getBWeekAttendace },
  //   { name: "This Week", event: getThisWeekAttendace },
  //   { name: "Yesterday", event: getYesterdayAttendace },
  //   { name: "Today", event: getTodayAttendace },
  // ];
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

  function handleAttendance() {
    navigate(`/result?rollno=${user}&from=${date.from}&to=${date.to}`);
  }

  function onMonthChange(e) {
    navigate(`/result/?rollno=${user}&month=${e.target.value}`);
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

      <div className="section2 mobile">
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
        </div>
      </div>
      <div className="section2 pc">
        <div className="title">Range:</div>

        <div className="buttons-row">
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

      <div className="section2 month">
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
