import { useState } from "react";
import axios from "axios";
import "./App.css";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const weightData = {
  labels: ["Day 1", "Day 3", "Day 7", "Day 10", "Day 14"],
  datasets: [
    {
      label: "Weight (kg)",
      data: [72, 71.5, 71, 70.8, 70.3],
      borderColor: "#4a90e2",
      tension: 0.4,
    },
  ],
};

const calorieData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      label: "Calories Burned",
      data: [300, 420, 390, 450, 500],
      backgroundColor: "#ff7043",
    },
  ],
};

const bmiData = {
  labels: ["Jan", "Feb", "Mar", "Apr"],
  datasets: [
    {
      label: "BMI",
      data: [25.1, 24.8, 24.6, 24.3],
      borderColor: "#9b59b6",
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: { color: "#fff" },
    },
  },
  scales: {
    x: { ticks: { color: "#ccc" } },
    y: { ticks: { color: "#ccc" } },
  },
};

function App() {
  // Profile State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("General Fitness");
  const [activity, setActivity] = useState("Moderate");

  // Modal Panel State
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTitle, setPanelTitle] = useState("");
  const [panelContent, setPanelContent] = useState("");
const [loadingAI, setLoadingAI] = useState(false);
const [aiError, setAiError] = useState("");

  const saveProfile = async () => {
    if (!name || !age || !height || !weight) {
      alert("Please fill all profile fields!");
      return;
    }

    try {
      await axios.post("http://localhost:8000/save_profile", {
        name,
        age,
        gender,
        height,
        weight,
        goal,
        activity_level: activity,
      });
      alert("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };
const fetchMealPlan = async () => {
  setLoadingAI(true);
  setAiError("");
  setPanelContent("");

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/ai/meal-plan/1"
    );

    setPanelContent(res.data.meal_plan);
  } catch (err) {
    console.error(err);
    setAiError("Failed to generate meal plan");
  } finally {
    setLoadingAI(false);
  }
};

  const openPanel = (type) => {
    if (type === "meal") {
  setPanelTitle("AI Meal Plan");
  fetchMealPlan();   // 🔥 THIS calls backend
}

    if (type === "calories") {
      setPanelTitle("Daily Calories");
      setPanelContent("Your calorie target based on TDEE will show here...");
    }
    if (type === "workout") {
      setPanelTitle("Workout Routine");
      setPanelContent("Weekly workout routines will be suggested here...");
    }
    if (type === "bmi") {
      setPanelTitle("BMI & Body Stats");
      setPanelContent("BMI and body health stats will appear here...");
    }
    if (type === "coach") {
      setPanelTitle("AI Fitness Coach");
      setPanelContent("AI coaching insights will go here...");
    }
    if (type === "progress") {
      setPanelTitle("Progress Overview");
      setPanelContent("Charts and progress tracking will be shown here...");
    }

    setPanelOpen(true);
  };

  return (
    <div className="app-container">

      {/* NAVBAR */}
      <div className="navbar">
        <div className="navbar-logo">BuddyFit</div>
        <div className="navbar-links">
          <span>Dashboard</span>
          <span>AI Coach</span>
          <span>Progress</span>
          <span>Profile</span>
          <span>About</span>
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <h1>AI Fitness Companion</h1>
        <p>Personalized meals, workouts & health insights tailored for you.</p>
      </div>

      {/* DASHBOARD GRID */}
      <div className="dashboard">

        {/* LEFT PANEL — PROFILE */}
        <div className="profile-card">
          <h3 className="section-title">👤 My Profile</h3>

          <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input type="number" placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)} />

          <select value={gender} onChange={(e)=>setGender(e.target.value)}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input type="number" placeholder="Height (cm)" value={height} onChange={(e)=>setHeight(e.target.value)} />
          <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e)=>setWeight(e.target.value)} />

          <select value={goal} onChange={(e)=>setGoal(e.target.value)}>
            <option>Fat Loss</option>
            <option>Muscle Gain</option>
            <option>General Fitness</option>
            <option>Maintenance</option>
            <option>Endurance</option>
          </select>

          <select value={activity} onChange={(e)=>setActivity(e.target.value)}>
            <option>Sedentary</option>
            <option>Light</option>
            <option>Moderate</option>
            <option>Active</option>
            <option>Athlete</option>
          </select>

          <button className="btn-primary" onClick={saveProfile}>
  Save Profile
</button>

        </div>

        {/* RIGHT PANEL — FEATURE CARDS */}
        <div className="feature-panel">
          <h3 className="section-title">⚡ Features</h3>

          <div className="feature-grid">
            <div className="feature-card" onClick={() => openPanel("meal")}>🍽 Meal Plan</div>
            <div className="feature-card" onClick={() => openPanel("calories")}>🔥 Calories</div>
            <div className="feature-card" onClick={() => openPanel("workout")}>🏋 Workout</div>
            <div className="feature-card" onClick={() => openPanel("bmi")}>⚖ BMI Stats</div>
            <div className="feature-card" onClick={() => openPanel("coach")}>🤖 AI Coach</div>
            <div className="feature-card" onClick={() => openPanel("progress")}>📈 Progress</div>
          </div>
        </div>
      </div>
{/* ---- METRICS & PROGRESS SECTION ---- */}
<div className="metrics-section">
  <div className="chart-card">
    <h2>Weight Progress</h2>
    <Line data={weightData} options={chartOptions} />
  </div>

  <div className="chart-card">
    <h2>Calories Burned</h2>
    <Bar data={calorieData} options={chartOptions} />
  </div>

  <div className="chart-card">
    <h2>BMI Trend</h2>
    <Line data={bmiData} options={chartOptions} />
  </div>
</div>

      {/* MODAL */}
      {panelOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{panelTitle}</h2>
            {loadingAI && <p>🧠 Generating your meal plan...</p>}

{aiError && <p style={{ color: "red" }}>{aiError}</p>}

{panelContent && (
  <div className="meal-plan">

    {/* SUMMARY CARD */}
    <div className="meal-card meal-summary">
      <h3>🍽 Today at a Glance</h3>
      <ul>
        <li>4 meals total</li>
        <li>High protein focus</li>
        <li>Balanced carbs & fats</li>
        <li>~1800–2000 kcal</li>
      </ul>
    </div>

    {/* MEAL CARDS */}
    {panelContent
      .split("###")
      .filter(section =>
        section.toLowerCase().includes("breakfast") ||
        section.toLowerCase().includes("lunch") ||
        section.toLowerCase().includes("snack") ||
        section.toLowerCase().includes("dinner")
      )
      .map((section, index) => (
        <div key={index} className="meal-card">
          <h3>{section.split("\n")[0]}</h3>
          <ul>
            {section
              .split("\n")
              .slice(1)
              .filter(line => line.trim().startsWith("-"))
              .map((item, i) => (
                <li key={i}>{item.replace("-", "").trim()}</li>
              ))}
          </ul>
        </div>
      ))}
  </div>
)}


            <button className="btn-primary" onClick={() => setPanelOpen(false)}>
  ← Back to Dashboard
</button>


          </div>
        </div>
      )}

    </div>
  );
}

export default App;
