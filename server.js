const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

const SUPABASE_URL = "https://vkvdjislxiejefkisuva.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdmRqaXNseGllamVma2lzdXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NDQ2MDEsImV4cCI6MjA5NjMyMDYwMX0.YmWIYy-KR3pA-S3FisowytanA6Tfgb08lG_FWeFZAGs";

async function getVal(key) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fitness_data?key=eq.${key}&select=value`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  const data = await res.json();
  return data[0]?.value ?? null;
}

async function setVal(key, value) {
  await fetch(`${SUPABASE_URL}/rest/v1/fitness_data?key=eq.${key}`, {
    method: "PATCH",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({ value, updated_at: new Date().toISOString() })
  });
}

app.get("/", (req, res) => res.json({ status: "Fitness backend running with Supabase! 💪" }));

app.get("/data", async (req, res) => {
  try {
    const [entries, mealLog, planChecked, workoutDraft, metrics] = await Promise.all([
      getVal("entries"),
      getVal("mealLog"),
      getVal("planChecked"),
      getVal("workoutDraft"),
      getVal("metrics"),
    ]);
    res.json({ entries: entries || [], mealLog: mealLog || {}, planChecked: planChecked || {}, workoutDraft, metrics: metrics || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/entries", async (req, res) => {
  await setVal("entries", req.body.entries);
  res.json({ ok: true });
});

app.post("/meallog", async (req, res) => {
  await setVal("mealLog", req.body.mealLog);
  res.json({ ok: true });
});

app.post("/planchecked", async (req, res) => {
  await setVal("planChecked", req.body.planChecked);
  res.json({ ok: true });
});

app.post("/draft", async (req, res) => {
  await setVal("workoutDraft", req.body.draft);
  res.json({ ok: true });
});

app.post("/metrics", async (req, res) => {
  await setVal("metrics", req.body.metrics);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
