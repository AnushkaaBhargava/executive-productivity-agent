# Executive Productivity Agent (Veridian Corp)
> **Assignment 1 Submission for AIONOS Interview Review**  
> **Candidate:** Anushkaa Bhargava  
> **Target Executive:** Arjun Malhotra (VP Sales)  
> **Active Week Context:** Monday, 21 September 2026 – Friday, 25 September 2026  

---

## 🚀 One-Command Local Run

This project is packaged for zero-friction review. The backend server serves the compiled React application directly.

```bash
# 1. Clone & enter repository
git clone <your-repo-url>
cd executive-productivity-agent

# 2. Install dependencies (root, server, client)
npm install
npm --prefix server install
npm --prefix client install

# 3. Build & start the unified server
npm run build
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

> **Development Mode (HMR):** If you prefer running frontend (Vite) and backend (Express) concurrently with live reload:
> ```bash
> npm run dev
> ```
> Frontend runs at `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

---

## 🎯 Executive Persona & Constraints

- **User of the Agent:** **Arjun Malhotra (VP Sales)**.
- **Information Sources:** Neha Kapoor (Marketing Lead), Raghav Sethi (Ops Manager), Divya Rao (Finance), Priya Nair (Meridian Logistics / External Client), and Facilities.
- **Strict Grounding Rule:** **Zero information is invented.** All commitments, dates, dependencies, and answers are derived with 100% fidelity from the 4 official Data Pack materials:
  1. **Meeting Transcript:** Leadership Sync (Mon 21 Sep, 9:00–9:35 AM)
  2. **Team Calendars:** Arjun Malhotra, Neha Kapoor, Raghav Sethi, Divya Rao
  3. **5 Email Threads (25 Emails total):** Vendor List, Q3 Campaign Deck, Call Reschedule, Expense Variance Report, Mumbai Office Lease Renewal
  4. **Voice Note Transcripts (2 memos):** Dictated by Arjun for himself (Mon 6:40 PM cab memo & Wed 8:15 AM morning memo)

---

## 🧠 Key Discoveries & Agent Proactive Intelligence

A standard mock agent would simply list static tasks. This Executive Productivity Agent conducts **cross-source synthesis, temporal conflict detection, and commitment tracking**:

### 1. 🔴 Overdue Deliverable — Updated Vendor List (Raghav Sethi)
- **Trail:** Promised at Monday Sync (due Tue EOD) → Slipped in email Mon 5:40 PM → Noted in Monday cab memo ("might slip to tomorrow morning") → Slipped in email Tue 6:30 PM ("will send by tomorrow morning for sure") → Raghav checked in Wed 8:45 AM.
- **Finding:** No record of Arjun sending the list. **Raghav is actively waiting on Arjun.**
- **Action:** One-click pre-drafted email apology with vendor list attachment.

### 2. 🔴 Unassigned Corporate Risk — Mumbai Office Lease Renewal
- **Trail:** Raghav raised at Monday sync ("needs someone to sign off this week") → Facilities sent company-wide notices (Mon 10:15 AM & Thu 4:00 PM) establishing a hard deadline of **Friday, 25 September, End of Day** → Arjun noted in cab memo ("someone needs to own that, I don't think it's me") → Divya clarified it sits with Facilities → Raghav escalated directly to Arjun on Thu 4:45 PM (*"This is now one day out and still unowned — can you confirm who's handling it?"*).
- **Finding:** Critical deadline Friday EOD with no designated owner.
- **Action:** Agent flags for urgent delegation during Arjun & Raghav's **Facilities Check-in on Friday at 10:00 AM**.

### 3. 🟡 Proactive Calendar Conflict Detection — Thursday 9:30 AM Double-Booking
- **Trail:** Arjun's calendar has **Board Prep Session (9:00–10:00 AM)** on Thursday 24 Sep. Neha scheduled the **Q3 Campaign Deck Review for 9:30 AM** (Email Thread 2, Msg 4: *"Let's say 9:30 AM Thursday, before your board prep block"*).
- **Finding:** A 30-minute direct double-booking conflict that neither party caught manually!
- **Action:** Agent proactively alerts Arjun and provides a one-click proposal to push the Deck Review to **10:00–10:30 AM Thursday** (when both Arjun and Neha are completely free).

### 4. ✅ Reconciled Deliverables
- **July Expense Variance Report:** Divya Rao delivered the report Wed 23 Sep at 6:00 PM; Arjun acknowledged receipt at 6:10 PM. Reconciles Arjun's Wed 8:15 AM voice note.
- **Meridian Logistics Call:** Successfully rescheduled from Monday to Wednesday 3:00 PM with Priya Nair, confirmed, and held.

---

## 🛠️ System Architecture

```
executive-productivity-agent/
├── server/
│   ├── index.js               # Express REST API + static production bundle server
│   ├── agentEngine.js         # Grounded Intelligence Engine + Intent Classifier + Gemini 2.5 Hook
│   └── data/
│       └── dataPack.js        # Typed, structured Data Pack (all 25 emails, calendars, transcripts, notes)
├── client/
│   ├── src/
│   │   ├── App.jsx            # Executive OS Dashboard (Tabs, Action Items, Calendar, AI Chat, Sources)
│   │   ├── App.css            # Sleek enterprise slate theme, badges, modal overlays
│   │   ├── main.jsx           # React root
│   │   └── index.css          # Reset & base typography
│   ├── index.html             # Executive OS entry point
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # React 19 dependencies
├── package.json               # Unified root runner with dev & start scripts
└── README.md                  # Comprehensive review documentation
```

### Hybrid AI Engine:
1. **Built-in Grounded Intelligence Engine (Default):** Runs immediately with **zero configuration or API keys**. Guaranteed zero hallucinations, 100% factually anchored in the week's source data.
2. **Optional Live Gemini 2.5 Flash Integration:** Reviewers can optionally provide a Google Gemini API key (via `GEMINI_API_KEY` environment variable or via the UI settings modal) to test live generative synthesis with the entire Data Pack injected into the system instruction.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/dashboard` | `GET` | Executive stats, prioritized tasks, Arjun's schedule, active conflicts, and voice memos. |
| `/api/ask` | `POST` | Agent query answering with natural language understanding, markdown response, source citations, and suggested actions. |
| `/api/conflicts` | `GET` | Proactive schedule and dependency conflict detector. |
| `/api/sources` | `GET` | Raw ground-truth Data Pack viewer (all 25 emails, transcript, 4 calendars, 2 voice notes). |
| `/api/action` | `POST` | Generates drafted communications (e.g. email to Raghav, reschedule to Neha, delegation to Facilities). |

---

## 🧪 Verification & Testing

To run the automated verification test suite:

```bash
node -e "
const { answerAgentQuery } = require('./server/agentEngine');
async function run() {
  console.log('Testing Attention Query...');
  const r1 = await answerAgentQuery('What needs my attention?');
  console.log('Intent:', r1.intent, '| Citations:', r1.citations.length);
  
  console.log('Testing Conflict Detection...');
  const r2 = await answerAgentQuery('Do I have calendar conflicts?');
  console.log('Conflict Caught:', r2.answer.includes('Thursday, 24 September'));
}
run();
"
```

---

## 💻 Tech Stack

- **Backend:** Node.js, Express 5, Native Fetch, REST API
- **Frontend:** React 19, Vite, Modern CSS3 with CSS Grid & Custom Properties
- **AI / Grounding:** Hybrid Rule & Context Grounding Engine with optional Google Gemini API support
- **Design:** Modern Executive OS theme (slate / cyan / crimson status pills, glassmorphism modals)
