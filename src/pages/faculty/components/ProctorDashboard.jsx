import React, { useState } from "react";
import Card from "../../../components/ui/Card";
import { SEM1_SUBJECTS, SEM2_SUBJECTS } from "../../../data/mockData";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const SUBJECT_COLORS = [
  "#60A5FA",
  "#34D399",
  "#FBBF24",
  "#A78BFA",
  "#F87171",
  "#14B8A6",
  "#F472B6",
];
const PIE_COLORS = ["#10B981", "#F59E0B", "#EF4444"];

const ProctorDashboard = ({ role, students }) => {
  if (!students || students.length === 0) {
    return <p className="p-4">No student data available</p>;
  }

  const subjects = role?.semester === 1 ? SEM1_SUBJECTS : SEM2_SUBJECTS;

  // Build data
  const performanceData = students.map((s) => {
    const subjectScores = {};
    subjects.forEach((sub) => {
      const perf = s.performance?.[sub];
      const score = perf ? Math.round((perf.total / 70) * 100) : 0;
      subjectScores[sub] = score;
    });
    return {
      name: s.name.split(" ").slice(0, 2).join(" "),
      __fullName: s.name,
      ...subjectScores,
    };
  });

  const subjectStats = subjects.map((sub) => {
    const scores = performanceData.map((p) => p[sub]);
    const classAvg = scores.reduce((acc, cur) => acc + cur, 0) / scores.length || 0;
    const max = Math.max(...scores);
    return { name: sub, average: Number(classAvg.toFixed(1)), max };
  });

  // Calculate overall performance categories
  const getAverage = (student) =>
    subjects.reduce((sum, sub) => sum + student[sub], 0) / subjects.length;

  const strongStudents = performanceData.filter((p) => getAverage(p) >= 85);
  const averageStudents = performanceData.filter((p) => {
    const avg = getAverage(p);
    return avg >= 70 && avg < 85;
  });
  const weakStudents = performanceData.filter((p) => getAverage(p) < 70);

  const overallPerformance = [
    { name: "Strong (>=85)", value: strongStudents.length, students: strongStudents },
    { name: "Average (70-84)", value: averageStudents.length, students: averageStudents },
    { name: "Weak (<70)", value: weakStudents.length, students: weakStudents },
  ].filter((d) => d.value > 0);

  const [selectedPie, setSelectedPie] = useState(null);

  const handlePieClick = (payload) => {
    if (!payload) return;
    setSelectedPie(payload);
  };

  const getCellColor = (score, avg) => {
    if (score >= avg) return "bg-green-100";
    if (score < avg && score >= avg * 0.7) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* ----------------- Row 1 ----------------- */}
      <div className="flex gap-4">
        {/* 1) Matrix Table */}
        <Card className="flex-1 h-[500px] overflow-hidden">
          <Card.Header>
            <Card.Title>Student Performance Matrix</Card.Title>
          </Card.Header>
          <Card.Content
            className="h-[440px] overflow-y-scroll"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            <div
              className="overflow-auto h-full"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>
                {`
                  /* Hide scrollbar for Chrome, Safari and Opera */
                  .no-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              <div className="no-scrollbar overflow-auto h-full">
                <table className="w-full text-sm border-collapse border">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-2 border">Student</th>
                      {subjects.map((sub) => (
                        <th key={sub} className="p-2 border">
                          {sub}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((student) => (
                      <tr key={student.__fullName} className="border-b">
                        <td className="p-2 border font-semibold">
                          {student.__fullName}
                        </td>
                        {subjects.map((sub) => {
                          const stat = subjectStats.find((s) => s.name === sub);
                          const score = student[sub] ?? 0;
                          return (
                            <td
                              key={sub}
                              className={`p-2 border text-center ${getCellColor(
                                score,
                                stat?.average
                              )}`}
                            >
                              <div>Score: {score}%</div>
                              <div>Avg: {stat?.average}%</div>
                              <div>Max: {stat?.max}%</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* 2) Subject-wise Comparison */}
        <Card className="flex-1 h-[500px] overflow-hidden">
          <Card.Header>
            <Card.Title>Subject-wise Comparison</Card.Title>
          </Card.Header>
          <Card.Content className="h-[440px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={50}
                />
                <YAxis domain={[0, 100]} tickFormatter={(t) => `${t}%`} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                {subjects.map((sub, i) => (
                  <Bar
                    key={sub}
                    dataKey={sub}
                    fill={SUBJECT_COLORS[i % SUBJECT_COLORS.length]}
                    name={sub}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
      </div>

      {/* ----------------- Row 2 ----------------- */}
      <div className="flex gap-4">
        {/* 3) Pie Chart */}
        <Card className="flex-1 h-[500px] overflow-hidden">
          <Card.Header>
            <Card.Title>Class Performance Distribution</Card.Title>
          </Card.Header>
          <Card.Content className="h-[440px]">
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={overallPerformance}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                  onClick={(entry) => handlePieClick(entry && entry.payload)}
                >
                  {overallPerformance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const d = props.payload;
                    const list =
                      d?.students?.map((s) => s.__fullName).join(", ") || "None";
                    return [`Count: ${value}`, `${name} — ${list}`];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            {selectedPie && (
              <div className="mt-3 p-3 border rounded bg-gray-50 max-h-[150px] overflow-auto">
                <h4 className="font-medium">
                  {selectedPie.name} — Count ({selectedPie.value})
                </h4>
                <ul className="list-disc pl-5 text-sm">
                  {selectedPie.students.map((s) => (
                    <li key={s.__fullName}>{s.__fullName}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* 4) Overall Subject Averages */}
        <Card className="flex-1 h-[500px] overflow-hidden">
          <Card.Header>
            <Card.Title>Overall Subject Averages</Card.Title>
          </Card.Header>
          <Card.Content className="h-[440px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectStats}
                margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Bar dataKey="average" name="Class Average">
                  {subjectStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default ProctorDashboard;
