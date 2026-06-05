const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

let store = {
  entries: [],
  mealLog: {},
  planChecked: {},
  workoutDraft: null,
  metrics: [],
};


app.get("/", (req, res) => {
  res.json({ status: "Fitness backend is running! 💪" });
});

app.get("/data", (req, res) => {
  res.json(store);
});

app.post("/entries", (req, res) => {
  store.entries = req.body.entries;
  res.json({ ok: true });
});

app.post("/meallog", (req, res) => {
  store.mealLog = req.body.mealLog;
  res.json({ ok: true });
});

app.post("/planchecked", (req, res) => {
  store.planChecked = req.body.planChecked;
  res.json({ ok: true });
});

app.post("/draft", (req, res) => {
  store.workoutDraft = req.body.draft;
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.post("/metrics", (req, res) => { store.metrics = req.body.metrics; res.json({ ok: true }); });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
