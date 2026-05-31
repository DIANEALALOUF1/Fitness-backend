const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store
let store = {
  entries: [],
  mealLog: {},
  planChecked: {},
  workoutDraft: null,
};

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Fitness backend is running! 💪" });
});

// Get all data
app.get("/data", (req, res) => {
  res.json(store);
});

// Save entries
app.post("/entries", (req, res) => {
  store.entries = req.body.entries;
  res.json({ ok: true });
});

// Save meal log
app.post("/meallog", (req, res) => {
  store.mealLog = req.body.mealLog;
  res.json({ ok: true });
});

// Save plan checked
app.post("/planchecked", (req, res) => {
  store.planChecked = req.body.planChecked;
  res.json({ ok: true });
});

// Save workout draft
app.post("/draft", (req, res) => {
  store.workoutDraft = req.body.draft;
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
