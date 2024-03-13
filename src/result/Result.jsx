import React, { useContext, useEffect, useState } from "react";
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

export default function Result() {
  const {
    attendance,
    SERVER,
    users,
    graphData,
    subjectsGraphData,
    setAttendance,
    setGraphData,
    setSubjectsGraphData,
  } = useContext(DataContext);

  const [selectedSubject, setSelectedSubject] = useState(0);

  // const [graphData, setGraphData] = useState([]);

  // useEffect(() => {
  //   let all = JSON.parse(localStorage.getItem("graph"));
  //   console.log(all);
  //   if (all) {
  //     setGraphData(
  //       all.map((item, i) => {
  //         return {
  //           // name: "week " + i,
  //           name: FormatDate(item.week),
  //           attend: item.total.attend,
  //           held: item.total.held,
  //           percent: item.total.percent,
  //           // ML: item.data[0].attend,
  //           // CD: item.data[1].attend,
  //           // CNS: item.data[2].attend,
  //           // OOAD: item.data[3].attend,
  //           // DLD: item.data[4].attend,
  //         };
  //       })
  //     );
  //   }
  // }, []);

  useEffect(() => {
    return () => {
      setGraphData([]);
      setSubjectsGraphData([]);
      setAttendance(null);
    };
  }, []);

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
          <div className="course">
            <p className="label">Course</p>
            <p className="value">{attendance.bio.Course}</p>
          </div>
          <div className="semester">
            <p className="label">Semester</p>
            <p className="value">{attendance.bio.Semester.substr(0, 2)}</p>
          </div>
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
