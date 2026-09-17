const express = require("express");
const cors = require("cors");
const path = require("path");

const { tasks, meetings, rawDataSummary } = require("./data/data");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Dashboard data endpoint
app.get("/api/dashboard", (req, res) => {
  res.json({
    user: "Arjun Malhotra (VP Sales)",
    week: "21–25 September 2026",
    tasks,
    meetings,
    rawDataSummary
  });
});

// 2. Executive Agent Q&A endpoint
app.post("/api/ask", (req, res) => {
  const question = (req.body.question || "").toLowerCase();

  let answer =
    "I am your Executive Productivity Agent. Ask me about items needing attention, overdue work, who is waiting on you, meetings, or voice memos.";
  let source = "Data Pack: Leadership Sync, Calendars, Email Threads 1-5, Voice Notes";

  // Check question topic
  if (question.includes("attention") || question.includes("important") || question.includes("priority") || question.includes("urgent")) {
    answer =
      "You have 3 items needing attention: (1) The updated vendor list for Raghav is overdue. (2) The Mumbai office lease renewal is unassigned with a Friday EOD deadline. (3) There is a calendar conflict on Thursday 9:30 AM between Board Prep and Neha's Deck Review.";
    source = "Email Threads 1, 2, 5 & Calendar";
  } else if (question.includes("behind") || question.includes("overdue") || question.includes("late")) {
    answer =
      "You are behind on sending the updated vendor list to Raghav Sethi. You promised it at Monday's sync, postponed it twice, and Raghav followed up Wednesday morning. It has not been sent yet.";
    source = "Email Thread 1 & Leadership Sync";
  } else if (question.includes("waiting") || question.includes("who is waiting")) {
    answer =
      "Raghav Sethi is waiting on you for the updated vendor list. He also asked you who is handling the Mumbai lease renewal sign-off. Neha is waiting to confirm review timing for the Q3 campaign deck.";
    source = "Email Threads 1, 2, 5";
  } else if (question.includes("conflict") || question.includes("overlap") || question.includes("double")) {
    answer =
      "Yes, on Thursday 24 September at 9:30 AM: Your Board Prep Session runs from 9:00 AM to 10:00 AM, but Neha scheduled the Q3 Deck Review for 9:30 AM. You should move the Deck Review to 10:00 AM right after Board Prep.";
    source = "Arjun & Neha Calendars; Email Thread 2";
  } else if (question.includes("mumbai") || question.includes("lease") || question.includes("facilities")) {
    answer =
      "The Mumbai Office Lease Renewal requires an authorized signature by Friday 25 September (End of Day). It is currently unassigned. Raghav asked you on Thursday at 4:45 PM who is handling it. You can discuss this during your Facilities Check-in on Friday at 10:00 AM.";
    source = "Email Thread 5 & Voice Note 1";
  } else if (question.includes("vendor") || question.includes("raghav")) {
    answer =
      "Raghav Sethi followed up on Wednesday morning (8:45 AM) asking if the vendor list is still good for this morning. You promised it on Monday, but got pulled into board prep and haven't sent it yet.";
    source = "Email Thread 1";
  } else if (question.includes("deck") || question.includes("campaign") || question.includes("neha")) {
    answer =
      "Neha sent the draft Q3 Campaign Deck on Thursday at 8:00 AM. She scheduled the review for Thursday 9:30 AM, but that overlaps with your Board Prep Session. Moving it to 10:00 AM is recommended.";
    source = "Email Thread 2 & Calendar";
  } else if (question.includes("expense") || question.includes("divya") || question.includes("variance")) {
    answer =
      "The July Expense Variance Report is completed. Divya emailed the report on Wednesday at 6:00 PM, and you confirmed receipt at 6:10 PM.";
    source = "Email Thread 4";
  } else if (question.includes("meridian") || question.includes("priya") || question.includes("client")) {
    answer =
      "The client call with Priya Nair (Meridian Logistics) was rescheduled to Wednesday at 3:00 PM, confirmed, and held successfully.";
    source = "Email Thread 3 & Calendar";
  } else if (question.includes("voice") || question.includes("memo") || question.includes("note") || question.includes("cab")) {
    answer =
      "You recorded two personal voice memos: (1) Monday 6:40 PM in the cab: to send Raghav the vendor list tomorrow and noted the Mumbai lease needs an owner. (2) Wednesday 8:15 AM: reminding yourself that Divya's expense report is needed by Wednesday evening, and to lock in the Meridian call time.";
    source = "Voice Notes 1 & 2";
  } else if (question.includes("meeting") || question.includes("calendar") || question.includes("schedule")) {
    answer =
      "Your week includes: Monday Leadership Sync & 1:1 with Neha; Tuesday Budget Review; Wednesday Meridian call at 3 PM; Thursday Board Prep at 9 AM, Deck Review at 9:30 AM (conflict!), and Hiring Panel at 4 PM; Friday Facilities Check-in at 10 AM.";
    source = "Arjun Malhotra Calendar";
  } else if (question.includes("completed") || question.includes("done") || question.includes("finish")) {
    answer =
      "Two deliverables are completed: (1) July Expense Variance Report received from Divya on Wednesday evening. (2) Meridian Logistics client call completed on Wednesday at 3:00 PM.";
    source = "Email Threads 3 & 4";
  }

  res.json({
    answer,
    source
  });
});

// 3. Serve frontend in production
const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  const indexPath = path.join(clientDistPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send("Executive Productivity Agent Server running on port " + PORT);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});