const express = require("express");
const cors = require("cors");
const path = require("path");

const { answerAgentQuery, dataPack } = require("./agentEngine");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Executive Dashboard API
app.get("/api/dashboard", (req, res) => {
  const { tasks, calendars, calendarConflicts, voiceNotes } = dataPack;

  const arjunSchedule = calendars["Arjun Malhotra"] || [];

  const attentionCount = tasks.filter(
    (t) => t.status === "Overdue" || t.status === "Unassigned" || t.status === "Schedule Conflict"
  ).length;

  const overdueCount = tasks.filter((t) => t.status === "Overdue").length;
  const unassignedCount = tasks.filter((t) => t.status === "Unassigned").length;
  const conflictCount = calendarConflicts.length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  res.json({
    user: {
      name: "Arjun Malhotra",
      role: "VP Sales",
      email: "arjun.malhotra@veridian-corp.example",
      week: "21–25 September 2026"
    },
    stats: {
      attentionCount,
      overdueCount,
      unassignedCount,
      conflictCount,
      completedCount
    },
    tasks,
    calendar: arjunSchedule,
    conflicts: calendarConflicts,
    voiceNotes
  });
});

// 2. Executive Agent Intelligent Q&A
app.post("/api/ask", async (req, res) => {
  try {
    const { question, apiKey } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question parameter is required." });
    }

    const result = await answerAgentQuery(question, apiKey);
    res.json(result);
  } catch (err) {
    console.error("Error answering query:", err);
    res.status(500).json({
      error: "Failed to process query",
      details: err.message
    });
  }
});

// 3. Raw Data Pack Inspection API (Full transparency for reviewers)
app.get("/api/sources", (req, res) => {
  res.json({
    sourceTitle: "Assignment 1: Executive Productivity Agent Data Pack",
    weekContext: "Monday, 21 September 2026 – Friday, 25 September 2026",
    groundingRules: "No invented information. Strictly grounded in provided sources.",
    data: dataPack
  });
});

// 4. Proactive Calendar Conflicts API
app.get("/api/conflicts", (req, res) => {
  res.json({
    conflicts: dataPack.calendarConflicts
  });
});

// 5. Pre-built Executive Action Generator
app.post("/api/action", (req, res) => {
  const { actionType, payload } = req.body;

  if (actionType === "DRAFT_EMAIL_RAGHAV") {
    return res.json({
      success: true,
      action: "DRAFT_EMAIL",
      draft: {
        to: "raghav.sethi@veridian-corp.example",
        subject: "Re: Vendor List - Updated List Attached",
        body: "Hi Raghav,\n\nApologies for the delay on this — got pulled into board prep earlier in the week.\n\nAttached is the updated vendor list as discussed in Monday's leadership sync. Let me know if you need any clarification on the current supplier allocations.\n\nRegarding the Mumbai office lease renewal: I saw your note that it remains unassigned with the Friday EOD deadline. Let's discuss and formalize ownership during our Facilities Check-in on Friday at 10:00 AM.\n\nBest regards,\nArjun Malhotra\nVP Sales"
      }
    });
  }

  if (actionType === "RESOLVE_CONFLICT") {
    return res.json({
      success: true,
      action: "RESCHEDULE_PROPOSAL",
      draft: {
        to: "neha.kapoor@veridian-corp.example",
        subject: "Re: Q3 Campaign Deck - Adjusting Review to 10:00 AM Thursday",
        body: "Hi Neha,\n\nGot the draft deck sent at 8:00 AM, thank you. My Board Prep Session runs from 9:00 to 10:00 AM, so let's push our review to 10:00–10:30 AM right after. Looking forward to reviewing the data slides.\n\nBest,\nArjun"
      }
    });
  }

  if (actionType === "DELEGATE_LEASE") {
    return res.json({
      success: true,
      action: "DELEGATE_EMAIL",
      draft: {
        to: "facilities@veridian-corp.example",
        cc: "raghav.sethi@veridian-corp.example, divya.rao@veridian-corp.example",
        subject: "Urgent: Authorized Signatory for Mumbai Office Lease Renewal",
        body: "Hi Facilities Team,\n\nReferencing the reminders regarding the Mumbai office lease renewal due this Friday, 25 September (end of day).\n\nCould you please urgently confirm who from Facilities is authorized to sign off, or send the signature pack directly to my desk if executive VP authorization is required?\n\nRaghav and I will also touch base during our Facilities Check-in on Friday at 10:00 AM.\n\nThanks,\nArjun Malhotra\nVP Sales"
      }
    });
  }

  res.json({ success: true, message: "Action acknowledged" });
});

// 6. Serve static files in production if client/dist exists
const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  const indexPath = path.join(clientDistPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send("Executive Productivity Agent Backend API running on port " + PORT + ". Client available via Vite dev server or run 'npm run build'.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Executive Productivity Agent Server running on http://localhost:${PORT}`);
});