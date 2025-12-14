// server.cjs
const express = require("express");
const cors = require("cors");
const path = require("path");
const { spawn } = require("child_process");

// Import your existing mock data
const mockData = require("./src/data/mockData.js");

const app = express();
app.use(cors());
app.use(express.json());

// Extract mock data safely
const {
  users = [],
  students = [],
  faculty = [],
  departments = [],
  subjects = [],
} = mockData;

// -----------------------------
// 🔐 AUTH ROUTES
// -----------------------------
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) =>
      (u.id === username || u.email === username) &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const { password: pw, ...safeUser } = user;
  res.json({ user: safeUser, token: "mock-jwt-token" });
});

// -----------------------------
// 👨‍🎓 STUDENTS / FACULTY ROUTES
// -----------------------------
app.get("/api/students", (req, res) => res.json(students));
app.get("/api/faculty", (req, res) => res.json(faculty));
app.get("/api/departments", (req, res) => res.json(departments));
app.get("/api/subjects", (req, res) => res.json(subjects));

// -----------------------------
// 🧠 STUDY PLANNER (mock)
// -----------------------------
app.get("/api/planner", (req, res) => {
  const plan = subjects.slice(0, 5).map((sub, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri"][i],
    subject: sub.name || `Subject ${i + 1}`,
    focus: sub.code || "General",
  }));
  res.json({ plan });
});

// -----------------------------
// 📊 DASHBOARD SUMMARY
// -----------------------------
app.get("/api/dashboard", (req, res) => {
  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  const avgAttendance =
    students.reduce((sum, s) => sum + (s.attendance?.average || 0), 0) /
    (students.length || 1);

  res.json({
    totalStudents,
    totalFaculty,
    avgAttendance: avgAttendance.toFixed(2),
    departments: departments.length,
  });
});

// -----------------------------
// 🧠 STUDY RESOURCE AI ROUTE
// -----------------------------
app.post("/api/study-resources", (req, res) => {
  const { topic, subject } = req.body;
  const fullTopic = `${subject} ${topic}`;

  const pythonProcess = spawn("python", ["resource_finder.py"]);
  handlePythonProcess(pythonProcess, res, fullTopic);
});

// -----------------------------
// 🤖 ML STUDY PLAN ROUTE (FIXED)
// -----------------------------
app.post("/api/ml-study-plan", (req, res) => {
  const { subjects } = req.body;

  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ error: "Invalid subjects data" });
  }

  console.log("📥 Received subjects for ML plan:", subjects);

  const pythonProcess = spawn("python", ["ml_study_planner.py"]);

  let rawData = "";
  let errorData = "";

  pythonProcess.on("error", (err) => {
    console.error("❌ Failed to spawn Python process:", err);
    return res.status(500).json({
      error: "Failed to run Python script",
      details: err.message,
    });
  });

  pythonProcess.stdin.write(JSON.stringify({ subjects }));
  pythonProcess.stdin.end();

  pythonProcess.stdout.on("data", (data) => {
    rawData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorData += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`⚠️ Python script exited with code ${code}:`, errorData);
      if (rawData === "") {
        return res
          .status(500)
          .json({ error: "Python script exited with error", details: errorData });
      }
    }

    try {
      console.log("📤 Raw Python output:", rawData);
      const parsed = JSON.parse(rawData.trim());
      res.json(parsed);
    } catch (e) {
      console.error("⚠️ Error parsing ML script output:", e.message);
      res.status(500).json({
        error: "Error parsing script output",
        details: e.message,
        raw: rawData,
      });
    }
  });
});

// -----------------------------
// 🎯 NEW AI PLAN ROUTE (FIXED)
// -----------------------------
app.post("/api/new-ai-plan", (req, res) => {
  const { subjects } = req.body;

  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ error: "Invalid subjects data" });
  }

  console.log("📥 Received subjects for New AI plan:", subjects);

  const pythonProcess = spawn("python", ["new_ai_planner.py"]);

  let rawData = "";
  let errorData = "";

  pythonProcess.on("error", (err) => {
    console.error("❌ Failed to spawn Python process:", err);
    return res.status(500).json({
      error: "Failed to run Python script",
      details: err.message,
    });
  });

  pythonProcess.stdin.write(JSON.stringify({ subjects }));
  pythonProcess.stdin.end();

  pythonProcess.stdout.on("data", (data) => {
    rawData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorData += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`⚠️ Python script exited with code ${code}:`, errorData);
      if (rawData === "") {
        return res
          .status(500)
          .json({ error: "Python script exited with error", details: errorData });
      }
    }

    try {
      console.log("📤 Raw Python output:", rawData);
      const parsed = JSON.parse(rawData.trim());
      res.json(parsed);
    } catch (e) {
      console.error("⚠️ Error parsing AI script output:", e.message);
      res.status(500).json({
        error: "Error parsing script output",
        details: e.message,
        raw: rawData,
      });
    }
  });
});

// -----------------------------
// 🧩 HELPER: Handle Python Processes
// -----------------------------
function handlePythonProcess(pythonProcess, res, fullTopic) {
  let rawData = "";
  let errorData = "";

  pythonProcess.on("error", (err) => {
    console.error("❌ Failed to spawn Python process. Is 'python' in PATH?");
    return res
      .status(500)
      .json({ message: "Failed to run Python script", error: err.message });
  });

  pythonProcess.stdin.write(fullTopic);
  pythonProcess.stdin.end();

  pythonProcess.stdout.on("data", (data) => {
    rawData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorData += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`⚠️ Python script error (Code ${code}): ${errorData}`);
      if (rawData === "") {
        return res
          .status(500)
          .json({ message: "Python script exited with error", error: errorData });
      }
    }

    try {
      const parsed = parsePythonOutput(rawData);
      res.json(parsed);
    } catch (e) {
      console.error(`⚠️ Error parsing script output: ${e.message}`);
      res.status(500).json({
        message: "Error parsing script output",
        error: e.message,
        raw: rawData,
      });
    }
  });
}

// -----------------------------
// 📚 Helper: Parse Python Output
// -----------------------------
function parsePythonOutput(text) {
  const resources = {
    summary: "",
    websites: [],
    textbooks: [],
    youtube: [],
  };

  const sections = {
    summary: text.split("###SUMMARY###")[1]?.split("###WEBSITES###")[0],
    websites: text.split("###WEBSITES###")[1]?.split("###TEXTBOOKS###")[0],
    textbooks: text.split("###TEXTBOOKS###")[1]?.split("###YOUTUBE###")[0],
    youtube: text.split("###YOUTUBE###")[1],
  };

  const cleanList = (str) => {
    if (!str) return [];
    return str
      .trim()
      .split("\n")
      .map((s) => s.replace(/^\d+\.\s*/, "").trim())
      .filter((s) => s !== "" && s.length > 5);
  };

  if (sections.summary) resources.summary = sections.summary.trim();

  if (sections.websites) {
    const websiteRegex = /^(.*?)\s*\((https?:\/\/[^\)]+)\)$/m;

    resources.websites = sections.websites
      .trim()
      .split("\n")
      .map((line) => {
        const cleanLine = line.replace(/^\d+\.\s*/, "").trim();
        const match = cleanLine.match(websiteRegex);

        if (match && match[1] && match[2]) {
          const title = match[1].replace(/:\s*$/, "").trim();
          const link = match[2].trim();
          return { title, link };
        }
        return null;
      })
      .filter(Boolean);
  }

  if (sections.textbooks) resources.textbooks = cleanList(sections.textbooks);

  if (sections.youtube) {
    resources.youtube = sections.youtube
      .trim()
      .split("\n")
      .filter((s) => s.includes(" || "))
      .map((line) => {
        const parts = line.split(" || ");
        if (parts.length > 2) {
          const link = parts[parts.length - 1];
          const title = parts.slice(0, parts.length - 1).join(" || ");
          return { title: title.trim(), link: link.trim() };
        }
        if (parts.length === 2) {
          return { title: parts[0].trim(), link: parts[1].trim() };
        }
        return null;
      })
      .filter(Boolean);
  }

  return resources;
}

// -----------------------------
// 🌐 SERVE FRONTEND BUILD
// -----------------------------
const __dirnameFull = path.resolve();
const frontendPath = path.join(__dirnameFull, "dist");

app.use(express.static(frontendPath));

app.get((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// -----------------------------
// 🚀 START SERVER
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
