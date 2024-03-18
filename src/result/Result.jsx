import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { DataContext } from "../context/DataContext";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

export default function Result() {
  const {
    user,
    attendance,
    SERVER,
    users,
    setUsers,
    graphData,
    subjectsGraphData,
    setAttendance,
    setGraphData,
    setSubjectsGraphData,
  } = useContext(DataContext);

  const navigate = useNavigate();
  const [excludeOtherSubjects, setExcludeOtherSubjects] = useState(true);
  const location = useLocation();
  const [paramas, setParams] = useState(location.search);

  const [searchParams] = useSearchParams();
  let from = searchParams.get("from");
  let to = searchParams.get("to");
  let month = searchParams.get("month");
  let rollno = searchParams.get("rollno");
  let week = searchParams.get("week");

  const [selectedSubject, setSelectedSubject] = useState(0);

  useEffect(() => {
    return () => {
      setGraphData([]);
      setSubjectsGraphData([]);
      setAttendance(null);
    };
  }, []);

  const getAttendance = useCallback(
    (body) => {
      let graphs = JSON.parse(localStorage.getItem("graphs") || "{}");
      if (graphs[rollno.toLowerCase()]) {
        setGraphData(FormatGraphData(graphs[rollno.toLowerCase()]));
        setSubjectsGraphData(FormatSubjects(graphs[rollno.toLowerCase()]));
      } else {
        HandleGraphData();
      }
      axios
        .post(`${SERVER}/attendance`, {
          user: users[0].user,
          password: users[0].password,
          rollNo: rollno,
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
    },
    [rollno]
  );

  useEffect(() => {
    console.log(from, to, rollno, month);

    if (month) {
      console.log("by month");
      let date = new Date(month);
      date.setHours(0, 0, 0, 0);
      date.setMinutes(0);
      getAttendance({
        from: date.getTime(),
        to: "",
      });
    } else if (from || to) {
      console.log("by from and to");
      let fromTime = new Date(from).getTime();
      let toTime = new Date(to).getTime();
      console.log(from, to);
      getAttendance({
        from: fromTime,
        to: toTime,
      });
    } else {
      switch (week) {
        case "today":
          getTodayAttendace();
          break;
        case "yesterday":
          getYesterdayAttendace();
          break;
        case "this":
          getThisWeekAttendace();
          break;
        case "bweek":
          getBWeekAttendace();
          break;
      }
    }
  }, [from, to, rollno, month, getAttendance]);

  function HandleGraphData() {
    axios
      .post(`${SERVER}/graph`, {
        user: users[0].user,
        password: users[0].password,
        rollNo: rollno,
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

  function getTodayAttendace() {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setMinutes(0);
    getAttendance({
      from: date.getTime(),
      to: date.getTime(),
    });
  }

  function getYesterdayAttendace() {
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

  function getThisWeekAttendace() {
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

  function getBWeekAttendace() {
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

  if (attendance == null) {
    return (
      <div className="loading-page">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="graph-boxes">
        <div className="graph">
          {graphData.length > 0 && (
            <ResponsiveContainer width={"100%"} height={350}>
              <LineChart data={graphData}>
                <Line
                  type="monotone"
                  dataKey="held"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="attend"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <CartesianGrid stroke="#4d4d4d9c" />
                <XAxis dataKey="name" />

                <YAxis
                  allowDataOverflow={false}
                  allowDecimals={true}
                  domain={[0, 60]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2a2a2a",
                    border: "0px",
                    borderRadius: "8px",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="subjects">
          {subjectsGraphData
            .filter((subjectGraphData) => {
              return subjectGraphData.some((subject) => {
                return subject.held > 0;
              });
            })
            .map((subjectGraphData, sub_index) => {
              return (
                <p
                  key={subjectGraphData[0].subject}
                  className={selectedSubject == sub_index ? "selected" : ""}
                  onClick={() => {
                    setSelectedSubject(sub_index);
                  }}
                >
                  {subjectGraphData[0].subject}{" "}
                </p>
              );
            })}
        </div>

        <div className="graph">
          {selectedSubject > -1 && subjectsGraphData.length > 0 && (
            <ResponsiveContainer
              width={"100%"}
              height={350}
              key={subjectsGraphData[selectedSubject][0].subject}
            >
              <LineChart
                key={subjectsGraphData[selectedSubject][0].subject}
                data={subjectsGraphData[selectedSubject]}
              >
                <Line
                  type="monotone"
                  dataKey="held"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="attend"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <CartesianGrid stroke="#6a6a6a77" />
                <XAxis dataKey="name" />

                <YAxis
                  allowDataOverflow={false}
                  allowDecimals={true}
                  domain={[0, 8]}
                />
                <Tooltip
                  key={
                    subjectsGraphData[selectedSubject][0].subject + "tooltip"
                  }
                  contentStyle={{
                    backgroundColor: "#2a2a2a",
                    border: "0px",
                    borderRadius: "8px",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* {subjectsGraphData.map((subjectGraphData) => {
          return (
            <ResponsiveContainer
              width={"100%"}
              height={350}
              key={subjectGraphData[0].subject}
            >
              <LineChart
                key={subjectGraphData[0].subject}
                data={subjectGraphData}
              >
                <Line
                  type="monotone"
                  dataKey="held"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="attend"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <CartesianGrid stroke="#6a6a6a77" />
                <XAxis dataKey="name" />

                <YAxis
                  allowDataOverflow={false}
                  allowDecimals={true}
                  domain={[0, 8]}
                />
                <Tooltip
                  key={subjectGraphData[0].subject + "tooltip"}
                  contentStyle={{
                    backgroundColor: "#2a2a2a",
                    border: "0px",
                    borderRadius: "8px",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          );
        })} */}
      </div>

      <div className="right-side">
        <div className="bio">
          <div className="name">
            <p className="label">Name</p>
            <p className="value">{attendance.bio.StudentName}</p>
          </div>
          <div className="rollNo">
            <p className="label">Roll No</p>
            <p className="value">{attendance.bio.RollNo}</p>
          </div>
          {/* <div className="bio-row"> */}
          <div className="course">
            <p className="label">Course</p>
            <p className="value">{attendance.bio.Course}</p>
          </div>
          <div className="semester">
            <p className="label">Semester</p>
            <p className="value">{attendance.bio.Semester.substr(0, 2)}</p>
          </div>
          {/* </div> */}
        </div>

        <div className="results-table">
          <div className={"row head"}>
            <div className="cell subject">Subject</div>
            <div className="cell cnt">Held</div>
            <div className="cell cnt">Attend</div>
            <div className="cell percentage">Percent</div>
          </div>
          {attendance.data.map((row, i) => {
            return (
              <div
                key={row.subject}
                className={"row " + (i % 2 == 0 ? " even" : "odd")}
              >
                <div className="cell subject">{row.subject}</div>
                <div className="cell cnt">{row.held}</div>
                <div className="cell cnt">{row.attend}</div>
                <div className="cell percentage">{row.percent}</div>
              </div>
            );
          })}
          <div key={"total"} className={"row total"}>
            <div className="cell subject">{attendance.total.subject}</div>
            <div className="cell cnt">{attendance.total.held}</div>
            <div className="cell cnt">{attendance.total.attend}</div>
            <div className="cell percentage">{attendance.total.percent}</div>
          </div>
        </div>
      </div>
    </div>
  );
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

function FormatDate(date) {
  let d = new Date(date);
  const day = String(d.getUTCDate());
  const month = String(d.getUTCMonth() + 1);
  const year = String(d.getUTCFullYear());
  // return `${day}/${month}/${year}`;
  return `${day}/${month}`;
}
