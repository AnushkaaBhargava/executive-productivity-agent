import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSources, setShowSources] = useState(false);

  // Fetch dashboard data on load
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .catch(() => fetch("/api/dashboard"))
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((error) => console.error("Error loading dashboard:", error));
  }, []);

  // Ask agent function
  const askAgent = async (customQuestion) => {
    const q = customQuestion || question;
    if (!q.trim()) return;

    setLoading(true);
    setAnswer("");
    setSource("");

    try {
      const response = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const result = await response.json();
      setAnswer(result.answer);
      setSource(result.source || "");
    } catch {
      // Fallback in case of relative path in production
      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q }),
        });
        const result = await response.json();
        setAnswer(result.answer);
        setSource(result.source || "");
      } catch (err) {
        setAnswer("Could not connect to the agent backend. Please check server.");
      }
    }

    setLoading(false);
  };

  const handleSuggestion = (text) => {
    setQuestion(text);
    askAgent(text);
  };

  if (!data) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Executive Productivity Agent for Arjun Malhotra...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* 1. HEADER */}
      <header className="main-header">
        <div className="header-left">
          <span className="logo-sparkle">✦</span>
          <div>
            <h1>Executive Productivity Agent</h1>
            <p className="subtitle">
              Personal Executive Brief for <strong>Arjun Malhotra (VP Sales)</strong> · Week of 21–25 Sep 2026
            </p>
          </div>
        </div>
        <div className="badge-grounded">100% Grounded in Data Pack</div>
      </header>

      {/* 2. TOP URGENT ALERTS */}
      <section className="alerts-section">
        <div className="alert-card alert-danger">
          <span className="alert-badge red">OVERDUE</span>
          <div className="alert-body">
            <strong>Updated Vendor List for Raghav:</strong> Promised Monday, postponed twice. Raghav checked in Wednesday 8:45 AM. Deliverable pending.
          </div>
        </div>

        <div className="alert-card alert-warning">
          <span className="alert-badge orange">UNASSIGNED RISK</span>
          <div className="alert-body">
            <strong>Mumbai Office Lease Renewal:</strong> Authorized signature due Friday 25 Sep EOD. Raghav escalated Thursday 4:45 PM asking who owns it.
          </div>
        </div>

        <div className="alert-card alert-conflict">
          <span className="alert-badge purple">CALENDAR CONFLICT</span>
          <div className="alert-body">
            <strong>Thursday 9:30 AM Overlap:</strong> Board Prep Session (9:00–10:00 AM) conflicts with Neha's Q3 Deck Review (9:30 AM). Move deck review to 10:00 AM.
          </div>
        </div>
      </section>

      {/* 3. ASK YOUR AGENT (AI Q&A) */}
      <section className="card-box agent-box">
        <div className="box-header">
          <h2>✦ Ask Your Productivity Agent</h2>
          <p>Click a suggested executive question below or type your own:</p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="suggestions-list">
          <button onClick={() => handleSuggestion("What needs my attention?")}>
            🚨 What needs my attention?
          </button>
          <button onClick={() => handleSuggestion("Who is waiting on me?")}>
            👥 Who is waiting on me?
          </button>
          <button onClick={() => handleSuggestion("Do I have any calendar conflicts?")}>
            ⚠️ Do I have calendar conflicts?
          </button>
          <button onClick={() => handleSuggestion("What am I behind on?")}>
            ⏱️ What am I behind on?
          </button>
          <button onClick={() => handleSuggestion("What is the status of the Mumbai lease?")}>
            🏢 Status of Mumbai lease?
          </button>
          <button onClick={() => handleSuggestion("What did I say in my voice notes?")}>
            🎙️ What are in my voice notes?
          </button>
        </div>

        {/* Input Field */}
        <div className="input-row">
          <input
            type="text"
            placeholder="Ask about meetings, deadlines, voice notes, or commitments..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAgent()}
          />
          <button className="btn-ask" onClick={() => askAgent()} disabled={loading}>
            {loading ? "Thinking..." : "Ask Agent"}
          </button>
        </div>

        {/* Answer Output */}
        {answer && (
          <div className="answer-card">
            <div className="answer-header">
              <span className="answer-icon">✦</span>
              <strong>Agent Response:</strong>
            </div>
            <p className="answer-text">{answer}</p>
            {source && (
              <div className="answer-source">
                <span>Source Evidence:</span> {source}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. ACTION ITEMS & COMMITMENTS */}
      <section className="card-box">
        <div className="box-header">
          <h2>📋 Executive Commitments & Action Items</h2>
          <p>Derived strictly from the Leadership Sync, Email Threads, and Voice Memos:</p>
        </div>

        <div className="tasks-grid">
          {data.tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${
                task.status === "Overdue"
                  ? "border-red"
                  : task.status === "Unassigned"
                  ? "border-orange"
                  : task.status === "Conflict"
                  ? "border-purple"
                  : "border-green"
              }`}
            >
              <div className="task-top">
                <span
                  className={`status-pill ${
                    task.status === "Overdue"
                      ? "pill-red"
                      : task.status === "Unassigned"
                      ? "pill-orange"
                      : task.status === "Conflict"
                      ? "pill-purple"
                      : "pill-green"
                  }`}
                >
                  {task.status}
                </span>
                <span className="priority-text">{task.priority} Priority</span>
              </div>

              <h3>{task.title}</h3>

              <div className="task-details">
                <div><strong>Owner:</strong> {task.owner}</div>
                <div><strong>Waiting on:</strong> {task.waitingOn}</div>
                <div><strong>Deadline:</strong> {task.deadline}</div>
              </div>

              <div className="task-evidence">
                <span className="evidence-title">Evidence ({task.source}):</span>
                <p>{task.evidence}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WEEKLY CALENDAR SCHEDULE */}
      <section className="card-box">
        <div className="box-header">
          <h2>📅 Arjun's Calendar (Week of 21–25 September 2026)</h2>
          <p>Scheduled meetings and detected conflicts:</p>
        </div>

        <div className="meetings-grid">
          {data.meetings.map((m, idx) => (
            <div
              key={idx}
              className={`meeting-box ${m.title.includes("Conflict") ? "meeting-conflict" : ""}`}
            >
              <div className="meeting-day">{m.day}</div>
              <div className="meeting-time">{m.time}</div>
              <div className="meeting-title">{m.title}</div>
              <div className="meeting-with">With: {m.with}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRANSPARENT SOURCE DATA PACK */}
      <section className="card-box sources-box">
        <div className="sources-header-toggle">
          <div>
            <h2>📂 View Ground-Truth Data Pack</h2>
            <p>Inspect the exact source material provided for Assignment 1</p>
          </div>
          <button className="btn-toggle" onClick={() => setShowSources(!showSources)}>
            {showSources ? "Hide Sources ▲" : "View Sources ▼"}
          </button>
        </div>

        {showSources && (
          <div className="sources-content">
            <div className="source-block">
              <h3>1. Meeting Transcript (Leadership Sync — Mon 21 Sep, 9:00 AM)</h3>
              <p>{data.rawDataSummary.syncTranscript}</p>
            </div>

            <div className="source-block">
              <h3>2. Voice Notes (Dictated Reminders to Self)</h3>
              <ul>
                {data.rawDataSummary.voiceNotes.map((vn, i) => (
                  <li key={i}>{vn}</li>
                ))}
              </ul>
            </div>

            <div className="source-block">
              <h3>3. Email Threads (5 Subjects × 5 Emails)</h3>
              <ul>
                {data.rawDataSummary.emailThreads.map((th, i) => (
                  <li key={i}>{th}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="footer">
        Executive Productivity Agent Prototype · Built for Arjun Malhotra (VP Sales) · AIONOS Assignment 1
      </footer>
    </div>
  );
}

export default App;