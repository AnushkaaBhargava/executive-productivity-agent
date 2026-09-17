import React, { useEffect, useState, useRef } from "react";
import "./App.css";

// API Base URL (defaults to localhost:5000 or relative for production build)
const API_BASE = window.location.port === "5173" ? "http://localhost:5000" : "";

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [sources, setSources] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'calendar', 'agent', 'sources'
  const [taskFilter, setTaskFilter] = useState("all");
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [activeDraft, setActiveDraft] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("epa_gemini_key") || "");
  const [toastMessage, setToastMessage] = useState("");

  // Chat Agent state
  const [chatMessages, setChatMessages] = useState([
    {
      role: "agent",
      text: `Good morning, Arjun. I have analyzed your communications, meetings, and voice memos for the week of **21–25 September 2026**.

You have **3 urgent items requiring action**:
1. 🔴 **Overdue:** The updated vendor list for Raghav Sethi (due Wednesday morning).
2. 🔴 **High Risk:** The Mumbai Office Lease Renewal (due Friday EOD, currently unassigned).
3. 🟡 **Schedule Conflict:** Thursday 9:30 AM overlap between your Board Prep Session and Neha's Deck Review.

Ask me any question below, or use the quick action prompts.`,
      citations: [
        { source: "Executive Briefing Summary", quote: "Aggregated from Leadership Sync, 4 Calendars, 5 Email Threads & 2 Voice Memos" }
      ],
      suggestedActions: [
        { label: "What needs my attention?", actionType: "QUERY", query: "What needs my attention?" },
        { label: "Who is waiting on me?", actionType: "QUERY", query: "Who is waiting on me?" },
        { label: "Check calendar conflicts", actionType: "QUERY", query: "Do I have any calendar conflicts?" },
        { label: "Draft reply to Raghav", actionType: "DRAFT_EMAIL_RAGHAV" }
      ]
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Source explorer state
  const [sourceSubTab, setSourceSubTab] = useState("threads"); // 'transcript', 'threads', 'calendars', 'voicenotes'
  const [selectedThreadId, setSelectedThreadId] = useState(1);
  const [selectedCalendarPerson, setSelectedCalendarPerson] = useState("Arjun Malhotra");

  // Fetch initial dashboard and source data
  useEffect(() => {
    fetch(`${API_BASE}/api/dashboard`)
      .then((res) => res.json())
      .then((data) => setDashboard(data))
      .catch((err) => console.error("Error fetching dashboard:", err));

    fetch(`${API_BASE}/api/sources`)
      .then((res) => res.json())
      .then((data) => setSources(data.data))
      .catch((err) => console.error("Error fetching sources:", err));
  }, []);

  useEffect(() => {
    if (activeTab === "agent" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("epa_gemini_key", key);
    setShowSettings(false);
    showToast(key ? "Gemini API key saved!" : "Key cleared; using Grounded Intelligence Engine.");
  };

  // Send message to Executive Agent
  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || chatInput;
    if (!textToSend || !textToSend.trim()) return;

    const userMsg = { role: "user", text: textToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!queryText) setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSend, apiKey: apiKey.trim() || undefined })
      });

      const result = await response.json();
      setChatMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: result.answer,
          citations: result.citations || [],
          suggestedActions: result.suggestedActions || []
        }
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "⚠️ Unable to connect to the Executive Productivity Agent service. Please ensure the backend server is running on port 5000."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle triggered actions
  const handleAction = async (action) => {
    if (action.actionType === "QUERY") {
      setActiveTab("agent");
      handleSendMessage(action.query);
      return;
    }

    if (action.actionType === "DRAFT_EMAIL" && action.payload) {
      setActiveDraft({
        title: "Drafted Email",
        to: action.payload.to,
        subject: action.payload.subject,
        body: action.payload.body
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType: action.actionType })
      });
      const data = await res.json();
      if (data.draft) {
        setActiveDraft({
          title:
            action.actionType === "DRAFT_EMAIL_RAGHAV"
              ? "Draft Email: Updated Vendor List to Raghav Sethi"
              : action.actionType === "RESOLVE_CONFLICT"
              ? "Draft Email: Reschedule Deck Review to Neha Kapoor"
              : "Draft Email: Assign Mumbai Lease Signatory",
          to: data.draft.to,
          cc: data.draft.cc || null,
          subject: data.draft.subject,
          body: data.draft.body
        });
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  };

  if (!dashboard) {
    return (
      <div className="epa-loading-screen">
        <div className="epa-spinner"></div>
        <h2>Loading Executive Productivity Agent...</h2>
        <p>Grounding data for Arjun Malhotra (VP Sales) · Week of 21–25 Sep 2026</p>
      </div>
    );
  }

  const { stats, tasks, calendar, conflicts, voiceNotes, user } = dashboard;

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === "attention") return t.status === "Overdue" || t.status === "Unassigned" || t.status === "Schedule Conflict";
    if (taskFilter === "overdue") return t.status === "Overdue";
    if (taskFilter === "unassigned") return t.status === "Unassigned";
    if (taskFilter === "conflict") return t.status === "Schedule Conflict";
    if (taskFilter === "completed") return t.status === "Completed";
    return true;
  });

  return (
    <div className="epa-app">
      {/* TOAST NOTIFICATION */}
      {toastMessage && <div className="epa-toast">{toastMessage}</div>}

      {/* TOP EXECUTIVE BAR */}
      <header className="epa-header">
        <div className="epa-brand">
          <span className="epa-logo-icon">✦</span>
          <div>
            <div className="epa-brand-title">VERIDIAN EXECUTIVE OS</div>
            <div className="epa-brand-sub">Productivity Agent for {user.name} ({user.role})</div>
          </div>
        </div>

        <div className="epa-header-meta">
          <div className="epa-context-pill">
            <span className="epa-pill-dot green"></span>
            <span>Week of 21–25 September 2026</span>
          </div>

          <div className="epa-grounding-badge">
            <span className="epa-check-icon">✓</span>
            <span>100% Grounded in Data Pack</span>
          </div>

          <button
            className="epa-btn-subtle"
            onClick={() => setShowSettings(true)}
            title="Configure optional Gemini LLM key"
          >
            ⚙️ {apiKey ? "Gemini Key Set" : "LLM Settings"}
          </button>
        </div>
      </header>

      {/* CRITICAL ATTENTION TICKER / ALERTS */}
      <section className="epa-alerts-banner">
        <div className="epa-alert-item alert-critical">
          <span className="epa-alert-tag danger">OVERDUE</span>
          <div className="epa-alert-text">
            <strong>Vendor List for Raghav Sethi</strong> was due Wednesday morning. Raghav checked in at 8:45 AM; deliverable pending.
          </div>
          <button
            className="epa-alert-action"
            onClick={() => handleAction({ actionType: "DRAFT_EMAIL_RAGHAV" })}
          >
            Draft Reply →
          </button>
        </div>

        <div className="epa-alert-item alert-warning">
          <span className="epa-alert-tag warning">UNASSIGNED RISK</span>
          <div className="epa-alert-text">
            <strong>Mumbai Office Lease Renewal</strong> deadline is Friday EOD. Unassigned as of Thu 4:45 PM escalation.
          </div>
          <button
            className="epa-alert-action"
            onClick={() => handleAction({ actionType: "DELEGATE_LEASE" })}
          >
            Delegate to Facilities →
          </button>
        </div>

        <div className="epa-alert-item alert-conflict">
          <span className="epa-alert-tag conflict">SCHEDULE CONFLICT</span>
          <div className="epa-alert-text">
            <strong>Thursday 9:30 AM Double-Booking:</strong> Board Prep Session (9–10 AM) overlaps with Neha's Deck Review.
          </div>
          <button
            className="epa-alert-action"
            onClick={() => handleAction({ actionType: "RESOLVE_CONFLICT" })}
          >
            Auto-Reschedule (10 AM) →
          </button>
        </div>
      </section>

      {/* EXECUTIVE KPI BAR */}
      <section className="epa-stats-grid">
        <div
          className={`epa-stat-card ${taskFilter === "attention" ? "active" : ""}`}
          onClick={() => { setActiveTab("overview"); setTaskFilter("attention"); }}
        >
          <div className="epa-stat-num text-danger">{stats.attentionCount}</div>
          <div className="epa-stat-label">Require Attention</div>
          <div className="epa-stat-sub">Overdue, Unassigned, Conflicts</div>
        </div>

        <div
          className={`epa-stat-card ${taskFilter === "overdue" ? "active" : ""}`}
          onClick={() => { setActiveTab("overview"); setTaskFilter("overdue"); }}
        >
          <div className="epa-stat-num text-danger">{stats.overdueCount}</div>
          <div className="epa-stat-label">Overdue Deliverables</div>
          <div className="epa-stat-sub">Vendor List (Raghav)</div>
        </div>

        <div
          className={`epa-stat-card ${taskFilter === "unassigned" ? "active" : ""}`}
          onClick={() => { setActiveTab("overview"); setTaskFilter("unassigned"); }}
        >
          <div className="epa-stat-num text-warning">{stats.unassignedCount}</div>
          <div className="epa-stat-label">Unassigned Risks</div>
          <div className="epa-stat-sub">Mumbai Lease (Due Friday)</div>
        </div>

        <div
          className={`epa-stat-card ${taskFilter === "conflict" ? "active" : ""}`}
          onClick={() => { setActiveTab("calendar"); }}
        >
          <div className="epa-stat-num text-purple">{stats.conflictCount}</div>
          <div className="epa-stat-label">Calendar Conflicts</div>
          <div className="epa-stat-sub">Thu 9:30 AM Overlap</div>
        </div>

        <div
          className={`epa-stat-card ${taskFilter === "completed" ? "active" : ""}`}
          onClick={() => { setActiveTab("overview"); setTaskFilter("completed"); }}
        >
          <div className="epa-stat-num text-success">{stats.completedCount}</div>
          <div className="epa-stat-label">Completed Deliverables</div>
          <div className="epa-stat-sub">Expense Variance & Meridian Call</div>
        </div>
      </section>

      {/* MAIN NAVIGATION TABS */}
      <nav className="epa-tabs-nav">
        <button
          className={`epa-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📋 Executive Action Items ({tasks.length})
        </button>

        <button
          className={`epa-tab-btn ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => setActiveTab("calendar")}
        >
          📅 Schedule & Conflicts {conflicts.length > 0 && <span className="epa-badge-count">{conflicts.length}</span>}
        </button>

        <button
          className={`epa-tab-btn ${activeTab === "agent" ? "active" : ""}`}
          onClick={() => setActiveTab("agent")}
        >
          ✦ Ask Executive Agent (AI Chat)
        </button>

        <button
          className={`epa-tab-btn ${activeTab === "sources" ? "active" : ""}`}
          onClick={() => setActiveTab("sources")}
        >
          📂 Data Pack Source Inspector (100% Grounded)
        </button>
      </nav>

      {/* TAB 1: EXECUTIVE ACTION ITEMS */}
      {activeTab === "overview" && (
        <main className="epa-tab-content">
          <div className="epa-filter-bar">
            <div className="epa-filter-group">
              <span className="epa-filter-label">Filter tasks:</span>
              <button className={`epa-chip ${taskFilter === "all" ? "active" : ""}`} onClick={() => setTaskFilter("all")}>All ({tasks.length})</button>
              <button className={`epa-chip ${taskFilter === "attention" ? "active" : ""}`} onClick={() => setTaskFilter("attention")}>Needs Attention ({stats.attentionCount})</button>
              <button className={`epa-chip ${taskFilter === "overdue" ? "active" : ""}`} onClick={() => setTaskFilter("overdue")}>Overdue ({stats.overdueCount})</button>
              <button className={`epa-chip ${taskFilter === "unassigned" ? "active" : ""}`} onClick={() => setTaskFilter("unassigned")}>Unassigned ({stats.unassignedCount})</button>
              <button className={`epa-chip ${taskFilter === "completed" ? "active" : ""}`} onClick={() => setTaskFilter("completed")}>Completed ({stats.completedCount})</button>
            </div>
          </div>

          <div className="epa-task-grid">
            {filteredTasks.map((task) => {
              const isOverdue = task.status === "Overdue";
              const isUnassigned = task.status === "Unassigned";
              const isConflict = task.status === "Schedule Conflict";
              const isCompleted = task.status === "Completed";

              return (
                <div
                  key={task.id}
                  className={`epa-task-card ${
                    isOverdue
                      ? "card-border-danger"
                      : isUnassigned
                      ? "card-border-warning"
                      : isConflict
                      ? "card-border-conflict"
                      : "card-border-success"
                  }`}
                >
                  <div className="epa-task-header">
                    <span
                      className={`epa-status-pill ${
                        isOverdue ? "pill-danger" : isUnassigned ? "pill-warning" : isConflict ? "pill-conflict" : "pill-success"
                      }`}
                    >
                      {task.status}
                    </span>
                    <span className="epa-priority-badge">{task.priority} Priority</span>
                  </div>

                  <h3 className="epa-task-title">{task.title}</h3>

                  <div className="epa-task-meta-grid">
                    <div className="epa-meta-item">
                      <span className="meta-label">Owner</span>
                      <span className="meta-val">{task.owner}</span>
                    </div>

                    <div className="epa-meta-item">
                      <span className="meta-label">Waiting Party</span>
                      <span className="meta-val">{task.waitingPerson}</span>
                    </div>

                    <div className="epa-meta-item">
                      <span className="meta-label">Deadline</span>
                      <span className="meta-val font-semibold">{task.deadline}</span>
                    </div>

                    <div className="epa-meta-item">
                      <span className="meta-label">Category</span>
                      <span className="meta-val">{task.category}</span>
                    </div>
                  </div>

                  <div className="epa-task-evidence-box">
                    <div className="epa-evidence-header">
                      <span>Source: {task.source}</span>
                    </div>
                    <p className="epa-evidence-snippet">{task.evidence}</p>
                  </div>

                  <div className="epa-task-actions">
                    <button
                      className="epa-btn-secondary"
                      onClick={() => setActiveEvidence(task)}
                    >
                      🔍 Inspect Evidence
                    </button>

                    {isOverdue && (
                      <button
                        className="epa-btn-primary"
                        onClick={() => handleAction({ actionType: "DRAFT_EMAIL_RAGHAV" })}
                      >
                        ✉️ Draft Email to Raghav
                      </button>
                    )}

                    {isUnassigned && (
                      <button
                        className="epa-btn-primary"
                        onClick={() => handleAction({ actionType: "DELEGATE_LEASE" })}
                      >
                        🏢 Delegate to Facilities
                      </button>
                    )}

                    {isConflict && (
                      <button
                        className="epa-btn-primary"
                        onClick={() => handleAction({ actionType: "RESOLVE_CONFLICT" })}
                      >
                        🔄 Reschedule Deck Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* TAB 2: SCHEDULE & CONFLICT DETECTOR */}
      {activeTab === "calendar" && (
        <main className="epa-tab-content">
          <div className="epa-calendar-header">
            <div>
              <h2>Arjun Malhotra's Calendar Schedule</h2>
              <p>Week of Monday 21 Sep – Friday 25 Sep 2026</p>
            </div>

            {conflicts.length > 0 && (
              <div className="epa-conflict-alert-box">
                <span className="epa-icon-warn">⚠️</span>
                <div>
                  <strong>Proactive Schedule Conflict Detected (Thursday 9:30 AM)</strong>
                  <p>Board Prep Session (9:00–10:00 AM) overlaps with proposed Q3 Campaign Deck Review with Neha (9:30–10:00 AM).</p>
                </div>
                <button
                  className="epa-btn-primary-sm"
                  onClick={() => handleAction({ actionType: "RESOLVE_CONFLICT" })}
                >
                  Resolve Overlap →
                </button>
              </div>
            )}
          </div>

          <div className="epa-calendar-week-grid">
            {["Mon 21 Sep", "Tue 22 Sep", "Wed 23 Sep", "Thu 24 Sep", "Fri 25 Sep"].map((dayName) => {
              const dayEvents = calendar.filter((e) => e.day === dayName);

              return (
                <div key={dayName} className="epa-day-col">
                  <div className="epa-day-header">
                    <h3>{dayName}</h3>
                    <span className="epa-day-count">{dayEvents.length} events</span>
                  </div>

                  <div className="epa-events-list">
                    {dayEvents.map((ev, idx) => {
                      const isConflictThu = dayName === "Thu 24 Sep" && ev.event === "Board Prep Session";

                      return (
                        <div
                          key={idx}
                          className={`epa-event-card type-${ev.type} ${isConflictThu ? "event-conflict-flagged" : ""}`}
                        >
                          <div className="epa-event-time">{ev.time}</div>
                          <div className="epa-event-title">{ev.event}</div>

                          {ev.attendees && (
                            <div className="epa-event-attendees">
                              {ev.attendees.map((a, i) => (
                                <span key={i} className="attendee-chip">{a}</span>
                              ))}
                            </div>
                          )}

                          {isConflictThu && (
                            <div className="epa-conflict-subcard">
                              <span className="subcard-title">⚠️ Overlap Conflict:</span>
                              <p>Neha Kapoor has scheduled <strong>Deck Review</strong> at 9:30–10:00 AM.</p>
                              <span className="subcard-rec">Recommended: Move Deck Review to 10:00 AM.</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {dayName === "Fri 25 Sep" && (
                      <div className="epa-deadline-marker">
                        <span className="marker-badge">CRITICAL DEADLINE</span>
                        <div className="marker-title">Mumbai Office Lease Renewal</div>
                        <div className="marker-time">Due Friday End of Day</div>
                        <div className="marker-note">Discuss during 10:00 AM Facilities Check-in!</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* TAB 3: ASK EXECUTIVE AGENT (AI CHAT) */}
      {activeTab === "agent" && (
        <main className="epa-tab-content epa-chat-layout">
          <div className="epa-chat-sidebar">
            <h3>Suggested Executive Queries</h3>
            <p className="sidebar-sub">Instant answers grounded strictly in your communications and schedule.</p>

            <div className="epa-prompt-list">
              <button className="epa-prompt-chip" onClick={() => handleSendMessage("What needs my attention?")}>
                🚨 What needs my attention right now?
              </button>
              <button className="epa-prompt-chip" onClick={() => handleSendMessage("Who is waiting on me?")}>
                👥 Who is waiting on me?
              </button>
              <button className="epa-prompt-chip" onClick={() => handleSendMessage("Do I have any calendar conflicts?")}>
                ⚠️ Do I have any calendar conflicts?
              </button>
              <button className="epa-prompt-chip" onClick={() => handleSendMessage("What is the status of the Mumbai lease?")}>
                🏢 Status of the Mumbai Office lease?
              </button>
              <button className="epa-prompt-chip" onClick={() => handleSendMessage("What did I say in my voice notes?")}>
                🎙️ What did I dictate in my voice notes?
              </button>
              <button className="epa-prompt-chip" onClick={() => handleSendMessage("What are my commitments to Raghav?")}>
                👤 What commitments do I have to Raghav?
              </button>
              <button className="epa-prompt-chip" onClick={() => handleSendMessage("Did Divya send the expense report?")}>
                📈 Did Divya send the expense report?
              </button>
              <button className="epa-prompt-chip" onClick={() => handleSendMessage("Draft a reply to Raghav about the vendor list")}>
                ✉️ Draft a reply to Raghav
              </button>
            </div>

            <div className="epa-grounding-info-card">
              <h4>✦ Grounding Guarantee</h4>
              <p>Responses are compiled strictly from the week of 21–25 September 2026 Data Pack. No invented facts, no external hallucinations.</p>
            </div>
          </div>

          <div className="epa-chat-main">
            <div className="epa-chat-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`epa-chat-bubble-wrap ${msg.role}`}>
                  <div className="epa-sender-tag">
                    {msg.role === "agent" ? "✦ Executive Productivity Agent" : "👤 Arjun Malhotra"}
                  </div>

                  <div className="epa-chat-bubble">
                    <div className="epa-markdown-content" dangerouslySetInnerHTML={{
                      __html: formatMarkdownSimple(msg.text)
                    }} />

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="epa-chat-citations">
                        <span className="citation-title">Grounded Sources:</span>
                        {msg.citations.map((c, ci) => (
                          <div key={ci} className="citation-pill" title={c.quote}>
                            📄 {c.source}
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="epa-chat-action-bar">
                        {msg.suggestedActions.map((act, ai) => (
                          <button
                            key={ai}
                            className="epa-btn-chat-action"
                            onClick={() => handleAction(act)}
                          >
                            {act.label} →
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="epa-chat-bubble-wrap agent">
                  <div className="epa-sender-tag">✦ Executive Productivity Agent</div>
                  <div className="epa-chat-bubble thinking">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="thinking-text">Cross-referencing Data Pack...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="epa-chat-input-box">
              <input
                type="text"
                placeholder="Ask your agent about meetings, commitments, overdue items, voice memos..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                className="epa-btn-send"
                onClick={() => handleSendMessage()}
                disabled={chatLoading || !chatInput.trim()}
              >
                Send Query
              </button>
            </div>
          </div>
        </main>
      )}

      {/* TAB 4: DATA PACK SOURCE INSPECTOR */}
      {activeTab === "sources" && sources && (
        <main className="epa-tab-content">
          <div className="epa-sources-header">
            <div>
              <h2>Assignment 1: Raw Data Pack Inspector</h2>
              <p>Transparent inspection of the ground-truth materials provided for the agent.</p>
            </div>

            <div className="epa-subtab-group">
              <button
                className={`epa-subtab ${sourceSubTab === "threads" ? "active" : ""}`}
                onClick={() => setSourceSubTab("threads")}
              >
                📧 5 Email Threads (25 Emails)
              </button>
              <button
                className={`epa-subtab ${sourceSubTab === "transcript" ? "active" : ""}`}
                onClick={() => setSourceSubTab("transcript")}
              >
                🎙️ Meeting Transcript
              </button>
              <button
                className={`epa-subtab ${sourceSubTab === "calendars" ? "active" : ""}`}
                onClick={() => setSourceSubTab("calendars")}
              >
                📅 4 Team Calendars
              </button>
              <button
                className={`epa-subtab ${sourceSubTab === "voicenotes" ? "active" : ""}`}
                onClick={() => setSourceSubTab("voicenotes")}
              >
                🔊 Voice Notes (2)
              </button>
            </div>
          </div>

          {/* SUBTAB: EMAIL THREADS */}
          {sourceSubTab === "threads" && (
            <div className="epa-threads-explorer">
              <div className="epa-thread-selector">
                {sources.emailThreads.map((th) => (
                  <button
                    key={th.id}
                    className={`epa-thread-nav-btn ${selectedThreadId === th.id ? "active" : ""}`}
                    onClick={() => setSelectedThreadId(th.id)}
                  >
                    <div className="thread-nav-title">Thread {th.id}: {th.subject}</div>
                    <div className="thread-nav-sub">{th.topic}</div>
                    <span className="thread-count-badge">5 emails</span>
                  </button>
                ))}
              </div>

              <div className="epa-thread-view">
                {(() => {
                  const thread = sources.emailThreads.find((t) => t.id === selectedThreadId);
                  if (!thread) return null;

                  return (
                    <div>
                      <div className="thread-view-header">
                        <h3>Thread {thread.id} — Subject: {thread.subject}</h3>
                        <p>{thread.topic}</p>
                      </div>

                      <div className="thread-emails-list">
                        {thread.emails.map((em, i) => (
                          <div key={i} className="email-card">
                            <div className="email-meta-row">
                              <span className="email-index">#{em.index}</span>
                              <span className="email-time">📅 {em.timestamp}</span>
                            </div>
                            <div className="email-header-line">
                              <strong>From:</strong> <code>{em.from}</code>
                            </div>
                            <div className="email-header-line">
                              <strong>To:</strong> <code>{em.to}</code>
                            </div>
                            <div className="email-body-box">
                              <p>"{em.body}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* SUBTAB: MEETING TRANSCRIPT */}
          {sourceSubTab === "transcript" && (
            <div className="epa-transcript-view">
              <div className="transcript-header-box">
                <h3>{sources.meetingTranscript.title}</h3>
                <p><strong>Date & Time:</strong> {sources.meetingTranscript.date}, {sources.meetingTranscript.time}</p>
                <p><strong>Attendees:</strong> {sources.meetingTranscript.attendees.join(", ")}</p>
              </div>

              <div className="transcript-lines">
                {sources.meetingTranscript.dialogue.map((line, idx) => (
                  <div key={idx} className="transcript-row">
                    <div className="speaker-col">
                      <span className={`speaker-badge ${line.speaker.includes("Arjun") ? "speaker-user" : "speaker-other"}`}>
                        {line.speaker}
                      </span>
                    </div>
                    <div className="dialogue-col">
                      <p>{line.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBTAB: CALENDARS */}
          {sourceSubTab === "calendars" && (
            <div className="epa-calendars-explorer">
              <div className="calendar-person-tabs">
                {Object.keys(sources.calendars).map((name) => (
                  <button
                    key={name}
                    className={`person-tab-btn ${selectedCalendarPerson === name ? "active" : ""}`}
                    onClick={() => setSelectedCalendarPerson(name)}
                  >
                    👤 {name}
                  </button>
                ))}
              </div>

              <div className="calendar-table-view">
                <h3>Calendar: {selectedCalendarPerson}</h3>
                <table className="epa-table">
                  <thead>
                    <tr>
                      <th>Day/Date</th>
                      <th>Time</th>
                      <th>Event</th>
                      <th>Type / Conflict Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.calendars[selectedCalendarPerson].map((evt, idx) => (
                      <tr key={idx} className={evt.isConflict ? "tr-conflict" : ""}>
                        <td><strong>{evt.day}</strong></td>
                        <td>{evt.time}</td>
                        <td>{evt.event}</td>
                        <td>
                          {evt.isConflict ? (
                            <span className="badge-danger">⚠️ Conflicts with Arjun's Board Prep</span>
                          ) : (
                            <span className="badge-normal">{evt.type}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB: VOICE NOTES */}
          {sourceSubTab === "voicenotes" && (
            <div className="epa-voicenotes-view">
              <div className="voicenotes-alert">
                <strong>Source Classification Rule:</strong> Both voice notes are personal voice memos recorded by Arjun Malhotra for himself. The agent treats these as a source of his commitments and open items, not instructions from third parties.
              </div>

              <div className="voicenotes-grid">
                {sources.voiceNotes.map((vn) => (
                  <div key={vn.id} className="voicenote-card">
                    <div className="vn-header">
                      <span className="vn-mic">🎙️</span>
                      <div>
                        <h3>{vn.title}</h3>
                        <span className="vn-time">{vn.timestamp}</span>
                      </div>
                    </div>

                    <div className="vn-context">
                      <strong>Context:</strong> {vn.context}
                    </div>

                    <div className="vn-transcript-box">
                      <strong>Transcript:</strong>
                      <p>"{vn.transcript}"</p>
                    </div>

                    <div className="vn-commitments-box">
                      <strong>Identified Commitments & Open Items:</strong>
                      <ul>
                        {vn.commitments.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* MODAL: EVIDENCE INSPECTION */}
      {activeEvidence && (
        <div className="epa-modal-backdrop" onClick={() => setActiveEvidence(null)}>
          <div className="epa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="epa-modal-header">
              <h3>🔍 Grounded Evidence Verification</h3>
              <button className="epa-close-btn" onClick={() => setActiveEvidence(null)}>✕</button>
            </div>

            <div className="epa-modal-body">
              <h4>{activeEvidence.title}</h4>
              <div className="modal-meta-bar">
                <span><strong>Status:</strong> {activeEvidence.status}</span>
                <span><strong>Deadline:</strong> {activeEvidence.deadline}</span>
                <span><strong>Owner:</strong> {activeEvidence.owner}</span>
              </div>

              <div className="modal-evidence-card">
                <h5>Primary Source</h5>
                <p className="modal-source-tag">📄 {activeEvidence.source}</p>
                <div className="modal-quote-box">
                  <strong>Evidence Trail:</strong>
                  <p>{activeEvidence.evidence}</p>
                </div>
              </div>

              <div className="modal-action-recommendation">
                <strong>Recommended Agent Next Step:</strong>
                <p>{activeEvidence.suggestedAction}</p>
              </div>
            </div>

            <div className="epa-modal-footer">
              <button className="epa-btn-secondary" onClick={() => setActiveEvidence(null)}>Close</button>
              {activeEvidence.status === "Overdue" && (
                <button
                  className="epa-btn-primary"
                  onClick={() => {
                    setActiveEvidence(null);
                    handleAction({ actionType: "DRAFT_EMAIL_RAGHAV" });
                  }}
                >
                  Draft Reply to Raghav
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DRAFTED EMAIL / ACTION */}
      {activeDraft && (
        <div className="epa-modal-backdrop" onClick={() => setActiveDraft(null)}>
          <div className="epa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="epa-modal-header">
              <h3>✉️ {activeDraft.title}</h3>
              <button className="epa-close-btn" onClick={() => setActiveDraft(null)}>✕</button>
            </div>

            <div className="epa-modal-body">
              <div className="email-draft-container">
                <div className="draft-field">
                  <span className="field-label">To:</span>
                  <span className="field-value"><code>{activeDraft.to}</code></span>
                </div>

                {activeDraft.cc && (
                  <div className="draft-field">
                    <span className="field-label">Cc:</span>
                    <span className="field-value"><code>{activeDraft.cc}</code></span>
                  </div>
                )}

                <div className="draft-field">
                  <span className="field-label">Subject:</span>
                  <span className="field-value"><strong>{activeDraft.subject}</strong></span>
                </div>

                <div className="draft-body-field">
                  <textarea
                    rows={8}
                    readOnly
                    value={activeDraft.body}
                  />
                </div>
              </div>
            </div>

            <div className="epa-modal-footer">
              <button className="epa-btn-secondary" onClick={() => setActiveDraft(null)}>Cancel</button>
              <button
                className="epa-btn-primary"
                onClick={() => {
                  copyToClipboard(`To: ${activeDraft.to}\nSubject: ${activeDraft.subject}\n\n${activeDraft.body}`);
                  setActiveDraft(null);
                }}
              >
                📋 Copy Draft to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LLM SETTINGS */}
      {showSettings && (
        <div className="epa-modal-backdrop" onClick={() => setShowSettings(false)}>
          <div className="epa-modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="epa-modal-header">
              <h3>⚙️ AI Agent Settings</h3>
              <button className="epa-close-btn" onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="epa-modal-body">
              <p>The agent uses a <strong>100% Grounded Intelligence Engine</strong> by default with zero external keys required.</p>
              <p>If you'd like to test live LLM synthesis via Gemini 2.5 Flash, enter your key below:</p>

              <div className="settings-field">
                <label>Google Gemini API Key (Optional):</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>

            <div className="epa-modal-footer">
              <button className="epa-btn-secondary" onClick={() => handleSaveApiKey("")}>Clear Key</button>
              <button className="epa-btn-primary" onClick={() => handleSaveApiKey(apiKey)}>Save Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="epa-footer">
        <div>Veridian Corp Executive Productivity System · Built for Arjun Malhotra (VP Sales)</div>
        <div className="footer-sub">Assignment 1 Prototype for AIONOS Interview Review · 100% Grounded in Official Data Pack</div>
      </footer>
    </div>
  );
}

// Simple markdown formatter helper for clean rendering of bold, headers, quotes, lists
function formatMarkdownSimple(text) {
  if (!text) return "";
  let html = text
    .replace(/^### (.*$)/gim, "<h4>$1</h4>")
    .replace(/^## (.*$)/gim, "<h3>$1</h3>")
    .replace(/^# (.*$)/gim, "<h2>$1</h2>")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    .replace(/^\s*-\s+(.*$)/gim, "<li>$1</li>")
    .replace(/^\s*\d+\.\s+(.*$)/gim, "<li>$1</li>")
    .replace(/\n\n/gim, "<br/><br/>");

  return html;
}