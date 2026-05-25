const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Store activities in memory (we'll add a database later)
let activities = [];

// Health check — lets us test the server is running
app.get("/", (req, res) => {
  res.json({ status: "Fitness backend is running! 💪" });
});

// Garmin will send activity data here
app.post("/garmin/webhook", (req, res) => {
  console.log("Received Garmin data:", req.body);
  
  const data = req.body;
  
  // Handle Garmin's verification ping
  if (data.type === "verification") {
    return res.json({ challenge: data.challenge });
  }

  // Store the activity
  if (data.activities) {
    data.activities.forEach(activity => {
      activities.push({
        id: Date.now(),
        source: "garmin",
        activityType: activity.activityType || "Other",
        date: activity.startTimeLocal?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        duration: Math.round((activity.duration || 0) / 60),
        distance: activity.distance ? (activity.distance / 1000).toFixed(2) : null,
        distUnit: "km",
        heartRate: activity.averageHR || null,
        calories: activity.calories || null,
        notes: `Auto-synced from Garmin ⌚`,
        emoji: getEmoji(activity.activityType),
      });
    });
  }

  res.json({ status: "ok" });
});

// Your app fetches activities from here
app.get("/activities", (req, res) => {
  res.json(activities);
});

function getEmoji(type) {
  const map = {
    "running": "🏃‍♀️",
    "walking": "🚶‍♀️",
    "swimming": "🏊‍♀️",
    "cycling": "🚴‍♀️",
    "other": "⚡",
  };
  return map[(type || "").toLowerCase()] || "⚡";
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
