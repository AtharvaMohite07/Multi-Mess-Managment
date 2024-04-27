import React, { useState, useEffect } from "react";
import axios from "../../Api/axios";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function SuperadminDashboad() {
  const COLORS = ["#005298", "#004e40", "#ff0000"];
  const color = "#009d7f";
  const color1 = "#005298";
  const COLORS1 = ["#005298", "#004e40", "#ff0000", "#cc8400", "#964b00"];
  const [userCountPerMess, setUserCountPerMess] = useState([]);
  const [userDistribution, setUserDistribution] = useState([]);
  const [totalMessCount, setTotalMessCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          userCountResponse,
          userDistributionResponse,
          messCountResponse,
        ] = await Promise.all([
          axios.get(`/StatsforsuperAdmin/getUserCountPerMess`),
          axios.get(`/StatsforsuperAdmin/getOverallUserDistribution`),
          axios.get(`/StatsforsuperAdmin/getTotalMessCount`),
        ]);

        const roleData = {
          0: { color: "#008000", label: "Admin" },
          1: { color: "#0000FF", label: "Employee" },
          2: { color: "#FF0000", label: "User" },
          // ... add more roles as needed
        };
        setUserCountPerMess(userCountResponse.data);
        setUserDistribution(userDistributionResponse.data);
        setTotalMessCount(messCountResponse.data.count);
      } catch (error) {
        // Handle errors (e.g., display error message)
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
      <div className="mainbar">
        <div className="m-main">
          {/* Dashboard Title */}
          <div className="m-title">
          <span className="text-[2rem] text-[#009d7f] h2 border-b-2 border-black pb-2 text-center">
            DASHBOARD for Super Admin
          </span>
          </div>

          {/* Mess Count and User Distribution */}
          <div className="flex items-center gap-[1rem]">
            <div className="card-container">
              <div className="piecard bg-gray-200 w-[37rem] shadow-xl h-[20rem] flex items-center mt-[1.5rem] rounded-[1rem] justify-around">
                <div className="p-content flex flex-col gap-[1rem]">
                  <span>Total Messes</span>
                  <span className="text-4xl font-bold">{totalMessCount}</span>
                </div>

                {/* User Distribution Pie Chart */}

                <div className="">

                  <PieChart width={300} height={200}>
                    <Pie
                        data={userDistribution}
                        dataKey="count"
                        cx="50%"
                        cy="55%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    >
                      {userDistribution.map((entry, index) => (
                          <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                          />
                      ))}
                    </Pie>
                    <Tooltip/>
                    <Legend/> {/* Add a legend for clarity */}
                  </PieChart>
                  <span>User Distribution</span>
                </div>
              </div>
            </div>

            {/* User Count per Mess Bar Chart */}
            <div className="card-container">
              <div
                  className="piecard bg-gray-200 shadow-xl w-[37rem] h-[20rem] flex items-center mt-[1.5rem] rounded-[1rem] justify-around">
                <BarChart
                    width={500}
                    height={300}
                    data={userCountPerMess}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="_id"/> {/* Mess ID on X-axis */}
                  <YAxis/>
                  <Tooltip/>
                  <Legend/>
                  <Bar dataKey="count" fill="#8884d8"/> {/* User count on Y-axis */}
                </BarChart>
                <span>User Distribution Per Mess</span>
              </div>
            </div>
          </div>

          {/* ... You can add more sections for other stats here */}
        </div>
      </div>
  );
}


export default SuperadminDashboad;
